// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="../../es6-symbol" />
import type {
  NodePath,
  Context,
  Scope,
  Visitor,
} from "@pregenerator/ast-types";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  visit,
  NodePath as ASTNodePath,
} from "@pregenerator/ast-types";
import { getData, setData } from "../utils/data";
import cloneDeep from "lodash.clonedeep";
import { ensureBlock, unwrapFunctionEnvironment } from "../utils/conversion";
import {
  getBindingIdentifiers,
  isReferencedIdentifier,
} from "../utils/validation";
import { findParent, nodeHasProp, inherits } from "../utils/util";
import { getBindingIdentifier } from "../utils/scope";
import { rename } from "../utils/renamer";
import isEqual from "lodash.isequal";
import Symbol from "es6-symbol";

type LetReferenceState = {
  letReferences: Record<string, n.Identifier>;
  closurify: boolean;
  loopDepth: number;
};

type ContinuationVisitorState = {
  reassignments: Record<string, boolean>;
  returnStatements: Array<NodePath<n.ReturnStatement>>;
  outsideReferences: Record<string, n.Identifier>;
};

type LoopState = {
  hasBreakContinue: boolean;
  ignoreLabeless: boolean;
  inSwitchCase: boolean;
  innerLabels: string[];
  hasReturn: boolean;
  isLoop: boolean;
  map: Record<string, n.Statement>;
  LOOP_IGNORE: string | symbol;
};

function getFunctionParentScope(_scope: Scope): Scope | null {
  let scope: Scope | null = _scope;
  do {
    if (scope.path && n.Function.check(scope.path.node)) {
      return scope;
    }
  } while ((scope = scope.parent));
  return null;
}

export function isStrict(path: NodePath<n.Node>): boolean {
  return !!findParent(path, (p) => {
    const { node } = p;
    if (n.Program.check(node) || n.BlockStatement.check(node)) {
      if (!node.directives) return false;
      return node.directives.some(
        (directive) => directive.value.value === "use strict"
      );
    } else {
      return false;
    }
  });
}

function ignoreBlock(path: NodePath): boolean {
  return (
    !path.parent ||
    n.Loop.check(path.parent.node) ||
    n.CatchClause.check(path.parent.node)
  );
}

function buildRetCheck(ret: n.Identifier): n.IfStatement {
  return b.ifStatement(
    b.binaryExpression(
      // test
      "===", // operator
      b.unaryExpression(
        // left
        "typeof", // operator
        ret, // argument
        true // prefix
      ),
      b.stringLiteral("object") // right
    ),
    b.returnStatement(
      // consequent
      b.memberExpression(
        // argument
        ret, // object
        b.identifier("v"), // property
        false // computed
      )
    )
  );
}

function isBlockScoped(node: n.Node): node is n.VariableDeclaration {
  if (!n.VariableDeclaration.check(node)) return false;
  if (getData<boolean>(node, "@@BLOCK_SCOPED_SYMBOL")) return true;
  if (node.kind !== "let" && node.kind !== "const") return false;
  return true;
}

/**
 * If there is a loop ancestor closer than the closest function, we
 * consider ourselves to be in a loop.
 */
function isInLoop(path: NodePath): boolean {
  const loopOrFunctionParent = findParent(
    path,
    (p) => n.Loop.check(p.node) || n.Function.check(p.node)
  );

  return (
    loopOrFunctionParent instanceof ASTNodePath &&
    n.Loop.check(loopOrFunctionParent.node)
  );
}

function buildUndefinedNode(): n.UnaryExpression {
  return b.unaryExpression("void", b.numericLiteral(0), true);
}

function convertBlockScopedToVar(
  path: NodePath,
  declPath: NodePath<n.VariableDeclaration> | null,
  parent: NodePath,
  scope: Scope,
  moveBindingsToParent = false
): void {
  // https://github.com/babel/babel/issues/255
  const refPath = declPath || path;
  const node = refPath.node;
  n.assertVariableDeclaration(node);
  if (isInLoop(path) && !n.For.check(parent.node)) {
    n.assertVariableDeclaration(node);
    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      if (n.Identifier.check(declar)) {
        refPath
          .get("declarations")
          .get(i)
          .replace(b.variableDeclarator(declar, buildUndefinedNode()));
      } else {
        n.assertVariableDeclarator(declar);
        declar.init = declar.init || buildUndefinedNode();
      }
    }
  }

  setData(node, "@@BLOCK_SCOPED_SYMBOL", true);
  node.kind = "var";

  // Move bindings from current block scope to function scope.
  if (moveBindingsToParent) {
    const parentScope = getFunctionParentScope(scope) as Scope;
    if (!parentScope) return;
    const bindings = scope.getBindings();
    const parentBindings = parentScope.getBindings();
    for (const name of Object.keys(getBindingIdentifiers(path.node))) {
      if (name in bindings) {
        // TODO change VariableDeclaration.kind to 'var'?
        const binding = bindings[name];
        delete bindings[name];
        parentBindings[name] = binding;
      }
    }
  }
}

function isVar(
  node: n.Node | null | undefined
): node is n.VariableDeclaration & { kind: "var" } {
  return (
    n.VariableDeclaration.check(node) &&
    node.kind === "var" &&
    !isBlockScoped(node)
  );
}

const letReferenceBlockVisitor =
  PathVisitor.fromMethodsObject<LetReferenceState>({
    visitNode(path: NodePath<n.Node>, state: LetReferenceState) {
      const { node } = path;
      if (n.Loop.check(node)) state.loopDepth++;
      if (n.FunctionParent.check(node)) {
        if (state.loopDepth > 0) {
          for (const child of path.iterChildren()) {
            letReferenceFunctionVisitor.visit(child, state);
          }
        }
        if (n.Loop.check(node)) state.loopDepth--;
        return false;
      }
      this.traverse(path);
      if (n.Loop.check(node)) state.loopDepth--;
    },
  });

const letReferenceFunctionVisitor =
  PathVisitor.fromMethodsObject<LetReferenceState>({
    visitIdentifier(path: NodePath<n.Identifier>, state: LetReferenceState) {
      if (!isReferencedIdentifier(path)) {
        return false;
      }

      const ref = state.letReferences[path.node.name];

      // not a part of our scope
      if (!ref) return false;

      // this scope has a variable with the same name so it couldn"t belong
      // to our let scope
      if (!path.scope) return false;
      const localBinding = getBindingIdentifier(path.scope, path.node.name);
      const isSameLoc =
        ref.loc && localBinding && isEqual(ref.loc, localBinding.node.loc);
      if (localBinding && !isEqual(localBinding.node, ref) && !isSameLoc) {
        return false;
      }

      state.closurify = true;

      return false;
    },
  });

const hoistVarDeclarationsVisitor = PathVisitor.fromMethodsObject<BlockScoping>(
  {
    visitNode(path: NodePath<n.Node>, self: BlockScoping) {
      const { node } = path;

      if (n.ForStatement.check(node)) {
        if (isVar(node.init)) {
          const nodes = self.pushDeclar(node.init);
          if (nodes.length === 1) {
            node.init = nodes[0];
          } else {
            node.init = b.sequenceExpression(nodes);
          }
        }
      } else if (n.For.check(node)) {
        if (n.ForX.check(node) && isVar(node.left)) {
          self.pushDeclar(node.left);
          const leftDecl = node.left.declarations[0];
          n.assertVariableDeclarator(leftDecl);
          if (n.VariableDeclarator.check(leftDecl)) {
            node.left = leftDecl.id;
          }
        }
      } else if (isVar(node)) {
        const declars = self
          .pushDeclar(node)
          .map((expr) => b.expressionStatement(expr));
        const pp = path.parentPath;
        path.replace(...declars);
        if (pp) {
          for (let i = 0; i < declars.length; i++) {
            self.queue.push(pp?.get(i));
          }
        }
      } else if (n.Function.check(node)) {
        return false;
      }
      this.traverse(path);
    },
  }
);

const loopLabelVisitor = PathVisitor.fromMethodsObject<LoopState>({
  visitLabeledStatement(path: NodePath<n.LabeledStatement>, state: LoopState) {
    state.innerLabels.push(path.node.label.name);
    this.traverse(path);
  },
});

const continuationVisitor =
  PathVisitor.fromMethodsObject<ContinuationVisitorState>({
    visitNode(path: NodePath<n.Node>, state: ContinuationVisitorState) {
      const { node } = path;
      if (
        n.AssignmentExpression.check(node) ||
        n.UpdateExpression.check(node)
      ) {
        const bindings = getBindingIdentifiers(node);
        for (const name in bindings) {
          if (!path.scope) continue;
          const bindingIdentifier = getBindingIdentifier(path.scope, name);
          if (
            !bindingIdentifier ||
            !isEqual(state.outsideReferences[name], bindingIdentifier.node)
          )
            continue;
          state.reassignments[name] = true;
        }
      } else if (n.ReturnStatement.check(path.node)) {
        state.returnStatements.push(path as NodePath<n.ReturnStatement>);
      }
      this.traverse(path);
    },
  });

function isLoopNodeTo(
  node: n.Node
): node is n.BreakStatement | n.ContinueStatement {
  return n.BreakStatement.check(node) || n.ContinueStatement.check(node);
}

function loopNodeTo(node: n.Node): string | undefined {
  if (n.BreakStatement.check(node)) {
    return "break";
  } else if (n.ContinueStatement.check(node)) {
    return "continue";
  }
}

const loopVisitorMethods: Visitor<LoopState> = {
  visitLoop(path, state) {
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    for (const child of path.iterChildren()) {
      visit(child, loopVisitorMethods, state);
    }
    state.ignoreLabeless = oldIgnoreLabeless;
    return false;
  },
  visitFunction() {
    return false;
  },
  visitCompletionStatement(path, state) {
    const { node } = path;
    if (n.ThrowStatement.check(node)) {
      this.traverse(path);
      return;
    }
    if (getData<boolean>(node, state.LOOP_IGNORE)) {
      this.traverse(path);
      return false;
    }

    let replace;
    let loopText = loopNodeTo(node);

    if (isLoopNodeTo(node) && loopText) {
      if (node.label) {
        // we shouldn't be transforming this because it exists somewhere inside
        if (state.innerLabels.indexOf(node.label.name) >= 0) {
          this.traverse(path);
          return false;
        }

        loopText = `${loopText}|${node.label.name}`;
      } else {
        // we shouldn't be transforming these statements because
        // they don"t refer to the actual loop we're scopifying
        if (state.ignoreLabeless) {
          this.traverse(path);
          return false;
        }

        // break statements mean something different in this context
        if (n.BreakStatement.check(node) && state.inSwitchCase) {
          this.traverse(path);
          return false;
        }
      }

      state.hasBreakContinue = true;
      state.map[loopText] = node;
      replace = b.stringLiteral(loopText);
    }

    if (n.ReturnStatement.check(node)) {
      state.hasReturn = true;
      replace = b.objectExpression([
        b.objectProperty(
          b.identifier("v"),
          node.argument || buildUndefinedNode()
        ),
      ]);
    }

    /* istanbul ignore else  */
    if (replace) {
      replace = b.returnStatement(replace);
      setData(replace, state.LOOP_IGNORE, true);
      const { parentPath: pp, name } = path;
      path.replace(inherits(replace, node));
      if (pp && name) {
        visit(pp.get(name), loopVisitorMethods, state);
      }
      return false;
    }

    this.traverse(path);
  },
  visitSwitchCase(path, state) {
    const oldInSwitchCase = state.inSwitchCase;
    state.inSwitchCase = true;
    for (const child of path.iterChildren()) {
      visit(child, loopVisitorMethods, state);
    }
    state.inSwitchCase = oldInSwitchCase;
    return false;
  },
};

const loopVisitor =
  PathVisitor.fromMethodsObject<LoopState>(loopVisitorMethods);

type WithParent<NP extends NodePath = NodePath> = NP & {
  parent: NodePath;
  parentPath: NodePath;
  name: string | number;
};

function assertPathHasParent<NP extends NodePath>(
  path: NP
): asserts path is WithParent<NP> {
  if (path.parent === null || path.parentPath === null) {
    throw new Error("Unexpected orphaned path");
  }
}

type BlockScopingBlock = n.BlockStatement | n.SwitchStatement | n.Program;

type BlockScopingLoop = (n.Loop | n.CatchClause) & { body: n.BlockStatement };

class BlockScoping<
  L extends BlockScopingLoop = BlockScopingLoop,
  LP extends NodePath<L> | null = NodePath<L> | null,
  B extends NodePath<BlockScopingBlock> = NodePath<BlockScopingBlock>
> {
  letReferences: Record<string, n.Identifier>;
  scopePath: NodePath<n.Node>;
  scope: Scope;
  loopPath: WithParent<NodePath<L>> | undefined;
  blockPath: WithParent<B>;
  parent: NodePath;
  block: B["node"];
  outsideLetReferences: Record<string, n.Identifier>;
  hasLetReferences: boolean;
  loopParent: NodePath<n.Node> | undefined;
  loopLabel: n.Identifier | undefined;
  loop: L | undefined;
  queue: NodePath[];
  body: Array<
    | n.BlockStatement
    | n.SwitchStatement
    | n.ExpressionStatement
    | n.VariableDeclaration
    | n.SwitchStatement
    | n.IfStatement
  >;
  has?: LoopState;
  closurePath: NodePath | undefined;

  constructor(
    loopPath: LP,
    blockPath: B,
    parent: NodePath<n.Node>,
    scopePath: NodePath<n.Node>
  ) {
    // assertIsValidBlockScopingParentNodePath(parent);
    this.parent = parent;
    this.scopePath = scopePath;
    if (scopePath.scope === null) {
      throw new Error("Unexpected null path scope");
    }
    this.scope = scopePath.scope;

    assertPathHasParent(blockPath);

    if (Array.isArray(blockPath.value)) {
      const blockPathParent = blockPath.parentPath;
      assertPathHasParent(blockPathParent);
      this.blockPath = blockPathParent as WithParent<B>;
    } else {
      this.blockPath = blockPath;
    }
    this.block = blockPath.node;

    this.outsideLetReferences = {};
    this.hasLetReferences = false;
    this.letReferences = {};
    this.body = [];
    this.queue = [];

    if (loopPath) {
      const _loopPath = loopPath as NodePath<L>;
      assertPathHasParent(_loopPath);
      this.loopPath = _loopPath;
      this.loopParent = this.loopPath.parent;
      if (
        this.loopParent &&
        n.LabeledStatement.check(this.loopParent.node) &&
        n.Identifier.check(this.loopParent.node.label)
      ) {
        this.loopLabel = this.loopParent.node.label;
      }
      this.loop = this.loopPath.node;
    }
  }

  /**
   * Start the ball rolling.
   */

  run() {
    const block = this.block;
    if (getData<boolean>(block, "_letDone")) return;
    setData(block, "_letDone", true);

    const needsClosure = this.getLetReferences();

    // this is a block within a `Function/Program` so we can safely leave it be
    if (n.Function.check(this.parent.node) || n.Program.check(this.block)) {
      this.updateScopeInfo();
      return;
    }

    // we can skip everything
    if (!this.hasLetReferences) return;

    if (needsClosure) {
      this.wrapClosure();
    } else {
      this.remap();
    }

    this.updateScopeInfo(needsClosure);

    if (
      this.loopLabel &&
      this.loopParent &&
      !n.LabeledStatement.check(this.loopParent.node)
    ) {
      return b.labeledStatement(this.loopLabel, this.loop as n.Loop);
    }
  }

  updateScopeInfo(wrappedInClosure = false) {
    const scope = this.scope;

    const parentScope = getFunctionParentScope(scope);
    if (parentScope) {
      parentScope.scan(true);
    } else {
      scope.scan(true);
    }

    const bindings = scope.getBindings();

    const letRefs = this.letReferences;

    for (const key of Object.keys(letRefs)) {
      const ref = letRefs[key];
      const binding = Array.isArray(bindings[ref.name])
        ? (bindings[ref.name] as NodePath[])[0]
        : (bindings[ref.name] as NodePath);
      if (
        !binding ||
        !binding.parent ||
        !binding.parent.parent ||
        !binding.parentPath
      )
        continue;
      if (
        binding.parent.parent.check(n.VariableDeclaration) &&
        (binding.parent.parent.node.kind === "let" ||
          binding.parent.parent.node.kind === "const")
      ) {
        binding.parent.parent.node.kind = "var";

        delete bindings[ref.name];
        if (!wrappedInClosure && parentScope) {
          parentScope.scan(true);
          const parentBindings = parentScope.getBindings();
          if (typeof parentBindings[ref.name] === "undefined") {
            parentBindings[ref.name] = binding;
          }
        }
      }
    }
  }

  remap() {
    const letRefs = this.letReferences;
    const outsideLetRefs = this.outsideLetReferences;
    const scope = this.scope;
    const parentScope = scope.parent;
    const blockPathScope = this.blockPath.scope;
    if (blockPathScope === null) {
      throw new Error("Unexpected null path scope");
    }

    // alright, so since we aren"t wrapping this block in a closure
    // we have to check if any of our let variables collide with
    // those in upper scopes and then if they do, generate a uid
    // for them and replace all references with it
    for (const key of Object.keys(letRefs)) {
      // just an Identifier node we collected in `getLetReferences`
      // this is the defining identifier of a declaration
      const ref = letRefs[key] as n.Identifier;

      // todo: could skip this if the colliding binding is in another function
      if (parentScope) {
        parentScope.scan(true);
      }
      const globalScope = scope.isGlobal ? scope : scope.getGlobalScope();
      if (
        (parentScope && parentScope.lookup(key)) ||
        (!scope.isGlobal && globalScope && globalScope.declares(key))
      ) {
        // The same identifier might have been bound separately in the block scope and
        // the enclosing scope (e.g. loop or catch statement), so we should handle both
        // individually
        if (scope.declares(key)) {
          (scope as any).ref = ref;
          rename(scope, ref.name);
        }
        if (scope !== blockPathScope && blockPathScope.declares(key)) {
          (blockPathScope as any).ref = ref;
          rename(blockPathScope, ref.name);
        }
      }
    }

    for (const key of Object.keys(outsideLetRefs)) {
      const id = outsideLetRefs[key];
      // check for collisions with a for loop's init variable and the enclosing scope's bindings
      // https://github.com/babel/babel/issues/8498
      if (isInLoop(this.blockPath) && blockPathScope.declares(key)) {
        rename(blockPathScope, id.name);
      }
    }
  }

  wrapClosure() {
    const block = this.block;

    const outsideRefs = this.outsideLetReferences;

    // remap loop heads with colliding variables
    if (this.loop) {
      for (const name of Object.keys(outsideRefs)) {
        const id = outsideRefs[name];
        const globalScope = this.scope.getGlobalScope();
        if (
          (globalScope && globalScope.declares(id.name)) ||
          (this.scope.parent && this.scope.parent.declares(id.name))
        ) {
          delete outsideRefs[id.name];
          delete this.letReferences[id.name];

          rename(this.scope, id.name);

          this.letReferences[id.name] = id;
          outsideRefs[id.name] = id;
        }
      }
    }

    // if we're inside of a for loop then we search to see if there are any
    // `break`s, `continue`s, `return`s etc
    this.has = this.checkLoop();

    // hoist let references to retain scope
    this.hoistVarDeclarations();

    // turn outsideLetReferences into an array
    const args = Object.values(outsideRefs).map((id) => cloneDeep(id));
    const params = args.map((id) => cloneDeep(id));

    const isSwitch = n.SwitchStatement.check(block);

    // build the closure that we're going to wrap the block with, possible wrapping switch(){}
    const fn = b.functionExpression(
      null,
      params,
      b.blockStatement(
        n.SwitchStatement.check(block)
          ? [block]
          : nodeHasProp(block, "body")
          ? block.body
          : []
      )
    );

    // continuation
    this.addContinuations(fn);

    let call: n.CallExpression | n.YieldExpression | n.AwaitExpression =
      b.callExpression(b.stringLiteral("__placeholder__"), args);
    const basePath: Array<number | string> = ["callee"];

    let hasYield = false;
    let hasAsync = false;

    visit(fn.body, {
      visitNode(path: NodePath<n.Node>) {
        if (n.Function.check(path.node)) {
          return false;
        }
        if (hasYield && hasAsync) {
          this.abort();
          return false;
        }
        if (path.node.type === "YieldExpression") {
          hasYield = true;
        } else if (path.node.type === "AwaitExpression") {
          hasAsync = true;
        }
        this.traverse(path);
      },
    });

    if (hasYield) {
      fn.generator = true;
      call = b.yieldExpression(call, true);
      basePath.unshift("argument");
    }

    if (hasAsync) {
      fn.async = true;
      call = b.awaitExpression(call);
      basePath.unshift("argument");
    }

    let placeholderPath: Array<number | string> = [];
    let index;
    if (this.has && (this.has.hasReturn || this.has.hasBreakContinue)) {
      const ret = this.scope.declareTemporary("ret");

      this.body.push(
        b.variableDeclaration("var", [b.variableDeclarator(ret, call)])
      );
      placeholderPath = ["declarations", 0, "init", ...basePath];
      index = this.body.length - 1;

      this.buildHas(ret);
    } else {
      this.body.push(b.expressionStatement(call));
      placeholderPath = ["expression", ...basePath];
      index = this.body.length - 1;
    }

    let callPath;
    // replace the current block body with the one we're going to build
    if (isSwitch) {
      const listKey = this.blockPath.parentPath.name as string;
      const key = this.blockPath.name as number;
      const grandparentPath = this.blockPath.parentPath
        .parentPath as NodePath<n.Node>;

      this.blockPath.replace(...this.body);
      for (let i = 0; i < index; i++) {
        this.queue.push(grandparentPath.get(listKey).get(key + i));
      }
      callPath = grandparentPath.get(listKey).get(key + index);
    } else if (nodeHasProp(block, "body")) {
      block.body = this.body;
      for (let i = 0; i < index; i++) {
        this.queue.push(this.blockPath.get("body").get(i));
      }
      callPath = this.blockPath.get("body").get(index);
    } else {
      throw new Error("");
    }

    const placeholder = callPath.getMany(...placeholderPath);

    let fnPath;
    if (this.loop && this.loopPath) {
      const loopId = this.scope.declareTemporary("loop");
      const loopIdDecl = b.variableDeclaration("var", [
        b.variableDeclarator(loopId, fn),
      ]);
      const parentIsLabeledStatement =
        this.loopPath.parentPath &&
        n.LabeledStatement.check(this.loopPath.parentPath.node);
      const refNode = parentIsLabeledStatement
        ? this.loopPath.parentPath
        : this.loopPath;
      const [declPath] = refNode.insertBefore(loopIdDecl);
      placeholder.replace(b.identifier(loopId.name));
      fnPath = declPath.get("declarations").get(0).get("init");
      this.queue.push(declPath);
    } else {
      placeholder.replace(fn);
      fnPath = placeholder;
      this.queue.push(fnPath);
    }
    this.queue.push(callPath.getMany(...placeholderPath));

    // Ensure "this", "arguments", and "super" continue to work in the wrapped function.
    unwrapFunctionEnvironment(fnPath);

    fnPath.scope?.parent?.scan(true);

    this.closurePath = fnPath;
  }

  /**
   * If any of the outer let variables are reassigned then we need to rename them in
   * the closure so we can get direct access to the outer variable to continue the
   * iteration with bindings based on each iteration.
   *
   * Reference: https://github.com/babel/babel/issues/1078
   */

  addContinuations(fn: n.FunctionExpression): void {
    const state: ContinuationVisitorState = {
      reassignments: {},
      returnStatements: [],
      outsideReferences: this.outsideLetReferences,
    };

    const fnPath = new ASTNodePath({ root: fn }, this.scopePath).get(
      "root"
    ) as ASTNodePath<n.FunctionExpression>;

    continuationVisitor.visit(fnPath, state);

    for (let i = 0; i < fn.params.length; i++) {
      const param = fn.params[i];
      if (!n.Identifier.check(param)) continue;
      if (!state.reassignments[param.name]) continue;

      const paramName = param.name;
      const newParam = this.scope.declareTemporary(param.name);
      const newParamName = newParam.name;
      fn.params[i] = newParam;

      rename(this.scope, paramName, newParamName, fnPath);

      state.returnStatements.forEach((returnStatement) => {
        const stmtName = returnStatement.name;
        const pp = returnStatement.parentPath;
        returnStatement.insertBefore(
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              b.identifier(paramName),
              b.identifier(newParamName)
            )
          )
        );
        if (pp && stmtName) {
          this.queue.push(pp.get(stmtName));
        }
      });

      // assign outer reference as it's been modified internally and needs to be retained
      fn.body.body.push(
        b.expressionStatement(
          b.assignmentExpression(
            "=",
            b.identifier(paramName),
            b.identifier(newParamName)
          )
        )
      );
    }
  }

  getLetReferences() {
    const block = this.block;

    const declarators: Array<
      | n.VariableDeclarator
      | n.VariableDeclaration
      | n.ClassDeclaration
      | n.FunctionDeclaration
    > = [];

    if (this.loop) {
      const init = nodeHasProp(this.loop, "left")
        ? this.loop.left
        : nodeHasProp(this.loop, "init")
        ? this.loop.init
        : undefined;
      if (init && isBlockScoped(init)) {
        declarators.push(init);
        const refs = getBindingIdentifiers(init);
        for (const k in refs) {
          this.outsideLetReferences[k] = refs[k];
        }
      }
    }

    const addDeclarationsFromChild = (
      path: NodePath<n.Node>,
      childPath?: NodePath<n.Node>
    ): void => {
      childPath = childPath || path;
      const node = childPath.node;
      if (isBlockScoped(node)) {
        convertBlockScopedToVar(
          path,
          childPath as NodePath<n.VariableDeclaration>,
          this.blockPath,
          this.scope
        );
        declarators.push(...(node.declarations as n.VariableDeclarator[]));
      } else if (
        n.ClassDeclaration.check(node) ||
        n.FunctionDeclaration.check(node)
      ) {
        declarators.push(node);
      }
      if (n.LabeledStatement.check(node)) {
        addDeclarationsFromChild(path.get("body"));
      }
    };

    if (Array.isArray(this.blockPath.value)) {
      for (let i = 0; i < this.blockPath.value.length; i++) {
        addDeclarationsFromChild(this.blockPath.get(i));
      }
    } else if (nodeHasProp(block, "body")) {
      const declarPaths = this.blockPath.get("body");
      for (let i = 0; i < block.body.length; i++) {
        addDeclarationsFromChild(declarPaths.get(i));
      }
    } else if (nodeHasProp(block, "cases")) {
      const declarPaths = this.blockPath.get("cases");
      for (let i = 0; i < block.cases.length; i++) {
        const consequents = block.cases[i].consequent;

        for (let j = 0; j < consequents.length; j++) {
          addDeclarationsFromChild(
            declarPaths.get(i),
            declarPaths.get(i).get("consequent").get(j)
          );
        }
      }
    }

    for (let i = 0; i < declarators.length; i++) {
      const declar = declarators[i];
      // Passing true as the third argument causes getBindingIdentifiers
      // to return only the *outer* binding identifiers of this
      // declaration, rather than (for example) mistakenly including the
      // parameters of a function declaration. Fixes #4880.
      const keys = getBindingIdentifiers(declar, false, true);
      for (const k in keys) {
        this.letReferences[k] = keys[k];
      }
      // Object.assign(this.letReferences, keys);
      this.hasLetReferences = true;
    }

    // no let references so we can just quit
    if (!this.hasLetReferences) return;

    const state: LetReferenceState = {
      letReferences: this.letReferences,
      closurify: false,
      loopDepth: 0,
    };

    if (isInLoop(this.blockPath)) {
      state.loopDepth++;
    }

    // traverse through this block, stopping on functions and checking if they
    // contain any local let references
    for (const child of this.blockPath.iterChildren()) {
      letReferenceBlockVisitor.visit(child, state);
    }

    return state.closurify;
  }

  /**
   * If we're inside of a loop then traverse it and check if it has one of
   * the following node types `ReturnStatement`, `BreakStatement`,
   * `ContinueStatement` and replace it with a return value that we can track
   * later on.
   */

  checkLoop(): LoopState {
    const state: LoopState = {
      hasBreakContinue: false,
      ignoreLabeless: false,
      inSwitchCase: false,
      innerLabels: [],
      hasReturn: false,
      isLoop: !!this.loop,
      map: {},
      LOOP_IGNORE: Symbol(),
    };

    for (const child of this.blockPath.iterChildren()) {
      loopLabelVisitor.visit(child, state);
    }
    for (const child of this.blockPath.iterChildren()) {
      loopVisitor.visit(child, state);
    }

    return state;
  }

  /**
   * Hoist all let declarations in this block to before it so they retain scope
   * once we wrap everything in a closure.
   */

  hoistVarDeclarations() {
    for (const child of this.blockPath.iterChildren()) {
      hoistVarDeclarationsVisitor.visit(child, this);
    }
  }

  /**
   * Turn a `VariableDeclaration` into an array of `AssignmentExpressions` with
   * their declarations hoisted to before the closure wrapper.
   */

  pushDeclar(node: n.VariableDeclaration): n.AssignmentExpression[] {
    const declars = [];
    const names = getBindingIdentifiers(node);
    for (const name of Object.keys(names)) {
      declars.push(b.variableDeclarator(names[name]));
    }

    this.body.push(b.variableDeclaration(node.kind, declars));

    const replace = [];

    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      if (!n.VariableDeclarator.check(declar) || !declar.init) continue;
      const expr = b.assignmentExpression("=", declar.id, declar.init);
      replace.push(inherits(expr, declar));
    }

    return replace;
  }

  buildHas(ret: n.Identifier): void {
    const body = this.body;
    let retCheck: undefined | n.IfStatement;
    const has = this.has as LoopState;
    const cases = [];

    if (has.hasReturn) {
      retCheck = buildRetCheck(ret);
    }

    /* istanbul ignore else */
    if (has.hasBreakContinue) {
      for (const key in has.map) {
        cases.push(b.switchCase(b.stringLiteral(key), [has.map[key]]));
      }

      if (retCheck) {
        cases.push(b.switchCase(null, [retCheck]));
      }

      /* istanbul ignore else */
      if (cases.length === 1) {
        const single = cases[0];
        body.push(
          b.ifStatement(
            b.binaryExpression("===", ret, single.test as n.Expression),
            single.consequent[0]
          )
        );
      } else if (this.loop) {
        // https://github.com/babel/babel/issues/998
        for (let i = 0; i < cases.length; i++) {
          const caseConsequent = cases[i].consequent[0];
          if (n.BreakStatement.check(caseConsequent) && !caseConsequent.label) {
            /* istanbul ignore else */
            if (!this.loopLabel) {
              this.loopLabel = this.scope.declareTemporary("loop");
            }
            caseConsequent.label = cloneDeep(this.loopLabel);
          }
        }

        body.push(b.switchStatement(ret, cases));
      }
    } else if (retCheck) {
      body.push(retCheck);
    }
  }
}

function visitBlockScopingStatementProgram<
  T extends NodePath<n.BlockStatement | n.SwitchStatement | n.Program>
>(this: Context, path: T): void {
  if (!ignoreBlock(path)) {
    assertPathHasParent(path);
    const blockScoping = new BlockScoping(null, path, path.parent, path);
    blockScoping.run();
    this.traverse(path);
    blockScoping.queue.forEach((p) => {
      visit(p, pluginVisitorMethods);
    });
    return;
  }
  this.traverse(path);
}

const pluginVisitorMethods: Visitor = {
  visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
    if (isBlockScoped(path.node)) {
      assertPathHasParent(path);
      const { parent, scope } = path;
      if (scope === null) {
        throw new Error("Unexpected null scope");
      }
      convertBlockScopedToVar(path, null, parent, scope, true);
    }
    this.traverse(path);
  },
  visitLoop(path: NodePath<n.Loop>) {
    assertPathHasParent(path);
    const { parent } = path;
    const blockPath = ensureBlock(path);
    const blockScoping = new BlockScoping(
      blockPath,
      blockPath.get("body") as NodePath<n.BlockStatement>,
      parent,
      blockPath
    );
    const replace = blockScoping.run();

    const { parentPath: pp, name } = path;
    const queue: NodePath[] = [];
    if (replace) {
      path.replace(replace);
      queue.push(pp.get(name));
    }

    this.traverse(path);

    [...blockScoping.queue, ...queue].forEach((p) => {
      visit(p, pluginVisitorMethods);
    });
  },
  visitCatchClause(path: NodePath<n.CatchClause>) {
    assertPathHasParent(path);
    const blockPath = ensureBlock(path);
    assertPathHasParent(blockPath);
    const blockScoping = new BlockScoping(
      blockPath,
      blockPath.get("body") as NodePath<n.BlockStatement>,
      path.parent,
      path
    );
    blockScoping.run();
    blockScoping.queue.forEach((p) => {
      visit(p.parent || p, pluginVisitorMethods);
    });
    this.traverse(path);
  },
  visitBlockStatement(path: NodePath<n.BlockStatement>) {
    visitBlockScopingStatementProgram.call(this, path);
  },
  visitSwitchStatement(path: NodePath<n.SwitchStatement>) {
    visitBlockScopingStatementProgram.call(this, path);
  },
  visitProgram(path: NodePath<n.Program>) {
    visitBlockScopingStatementProgram.call(this, path);
  },
};

const plugin = {
  visitor: PathVisitor.fromMethodsObject(pluginVisitorMethods),
};

export default plugin;
