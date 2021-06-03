import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import type { Context } from "@pregenerator/ast-types/dist/lib/path-visitor";
import type { Scope } from "@pregenerator/ast-types/dist/lib/scope";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  visit,
  NodePath as ASTNodePath,
  someField,
} from "@pregenerator/ast-types";
import { getData, setData } from "../utils/data";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";
import cloneDeep from "lodash.clonedeep";
import { ensureBlock, unwrapFunctionEnvironment } from "../utils/conversion";
import {
  getBindingIdentifiers,
  isReferencedIdentifier,
} from "../utils/validation";
import { getBindingIdentifier } from "../utils/scope";
import { rename } from "../utils/renamer";
import isEqual from "lodash.isequal";

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

// const LOOP_IGNORE = Symbol();

type LoopState = {
  hasBreakContinue: boolean;
  ignoreLabeless: boolean;
  inSwitchCase: boolean;
  innerLabels: string[];
  hasReturn: boolean;
  isLoop: boolean;
  map: Record<string, K.StatementKind>;
};

type Loop =
  | n.DoWhileStatement
  | n.ForInStatement
  | n.ForStatement
  | n.WhileStatement
  | n.ForOfStatement;

type For = n.ForInStatement | n.ForStatement | n.ForOfStatement;
type ForX = n.ForInStatement | n.ForOfStatement;

function getFunctionParentScope(scope: Scope): Scope | null {
  do {
    if (scope.path && n.Function.check(scope.path.node)) {
      return scope;
    }
  } while ((scope = scope.parent));
  return null;
}

type KeysOfUnion<T> = T extends T ? keyof T : never;
// type AllAstNodeKeys = KeysOfUnion<n.ASTNode>;

function findParent(
  path: NodePath,
  condition: (pp: NodePath) => boolean
): NodePath | null {
  let pp = path.parent;
  while (pp && !condition(pp)) {
    pp = pp.parent;
  }
  return pp;
}

function nodeHasProp<T extends n.ASTNode, P extends KeysOfUnion<n.ASTNode>>(
  obj: T,
  prop: P
): obj is T & Record<P, any> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function inherits<T extends n.ASTNode | null | undefined>(
  child: T,
  parent: n.ASTNode | null | undefined
): T {
  if (!child || !parent) return child;

  const childMod = child as T & n.Node;
  const parentMod = parent as T & n.Node;

  childMod.loc = parentMod.loc;
  childMod.comments = parentMod.comments;

  return child;
}

export function isStrict(path: NodePath<n.ASTNode>): boolean {
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

export function isLoop(node: n.ASTNode | null | undefined): node is Loop {
  if (!node) return false;

  const nodeType = node.type;
  return (
    // nodeType === "Loop" ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ForOfStatement" === nodeType
  );
}

export function isForX(node: n.ASTNode | null | undefined): node is ForX {
  return n.ForInStatement.check(node) || n.ForOfStatement.check(node);
}

export function isFor(node: n.ASTNode | null | undefined): node is For {
  return isForX(node) || n.ForStatement.check(node);
}

function ignoreBlock(path: NodePath): boolean {
  return (
    !path.parent ||
    isLoop(path.parent.node) ||
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
      b.literal("object") // right
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

function isBlockScoped(node: n.ASTNode): node is n.VariableDeclaration {
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
    (p) => isLoop(p.node) || n.Function.check(p.node)
  );

  return (
    loopOrFunctionParent instanceof ASTNodePath &&
    isLoop(loopOrFunctionParent.node)
  );
}

function buildUndefinedNode(): n.UnaryExpression {
  return b.unaryExpression("void", b.literal(0), true);
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
  n.VariableDeclaration.assert(node);
  if (isInLoop(path) && !isFor(parent.node)) {
    n.VariableDeclaration.assert(node);
    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      if (n.Identifier.check(declar)) {
        refPath
          .get("declarations", i)
          .replace(b.variableDeclarator(declar, buildUndefinedNode()));
      } else {
        n.VariableDeclarator.assert(declar);
        declar.init = declar.init || buildUndefinedNode();
      }
    }
  }

  setData(node, "@@BLOCK_SCOPED_SYMBOL", true);
  // node[t.BLOCK_SCOPED_SYMBOL] = true;
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
  node: n.ASTNode | null | undefined
): node is n.VariableDeclaration & { kind: "var" } {
  return (
    n.VariableDeclaration.check(node) &&
    node.kind === "var" &&
    !isBlockScoped(node)
  );
}

const letReferenceBlockVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, state: LetReferenceState) {
    this.state = state;
  },
  visitNode(path: NodePath<n.ASTNode>) {
    const state = this.state as LetReferenceState;
    const { node } = path;
    if (isLoop(node)) {
      state.loopDepth++;
      this.traverse(path);
      state.loopDepth--;
    } else {
      const isFunctionParent = someField(node, (k: string, v: unknown) =>
        n.Function.check(v)
      );
      if (isFunctionParent || n.Function.check(node)) {
        if (state.loopDepth > 0) {
          letReferenceFunctionVisitor.visit(path, state);
        }
        // this.traverse(path);
        return false;
      } else {
        this.traverse(path);
      }
    }
  },
  // visitDoWhileStatement(path: NodePath<n.DoWhileStatement>) {
  //   const state = this.state as LetReferenceState;
  //   state.loopDepth++;
  //   this.traverse(path);
  //   state.loopDepth--;
  // },
  // visitForInStatement(path: NodePath<n.ForInStatement>) {
  //   const state = this.state as LetReferenceState;
  //   state.loopDepth++;
  //   this.traverse(path);
  //   state.loopDepth--;
  // },
  // visitForStatement(path: NodePath<n.ForStatement>) {
  //   const state = this.state as LetReferenceState;
  //   state.loopDepth++;
  //   this.traverse(path);
  //   state.loopDepth--;
  // },
  // visitWhileStatement(path: NodePath<n.WhileStatement>) {
  //   const state = this.state as LetReferenceState;
  //   state.loopDepth++;
  //   this.traverse(path);
  //   state.loopDepth--;
  // },
  // visitForOfStatement(path: NodePath<n.ForOfStatement>) {
  //   const state = this.state as LetReferenceState;
  //   state.loopDepth++;
  //   this.traverse(path);
  //   state.loopDepth--;
  // },
  // visitFunction(path: NodePath<K.FunctionKind>) {
  //   // References to block-scoped variables only require added closures if it's
  //   // possible for the code to run more than once -- otherwise it is safe to
  //   // simply rename the variables.
  //   const state = this.state as LetReferenceState;
  //   if (state.loopDepth > 0) {
  //     letReferenceFunctionVisitor.visit(path, state);
  //   }
  //   return false;
  // },
});

const letReferenceFunctionVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, state: LetReferenceState) {
    this.state = state;
  },
  visitIdentifier(path: NodePath<n.Identifier>) {
    const state = this.state as LetReferenceState;

    if (!isReferencedIdentifier(path)) {
      return false;
    }

    const ref = state.letReferences[path.node.name];

    // not a part of our scope
    if (!ref) return false;

    // this scope has a variable with the same name so it couldn"t belong
    // to our let scope
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

const hoistVarDeclarationsVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, self: BlockScoping) {
    this.self = self;
  },
  visitNode(path: NodePath<n.ASTNode>) {
    const { node } = path;
    const self = this.self as BlockScoping;

    if (n.ForStatement.check(node)) {
      if (isVar(node.init)) {
        const nodes = self.pushDeclar(node.init);
        if (nodes.length === 1) {
          node.init = nodes[0];
        } else {
          node.init = b.sequenceExpression(nodes);
        }
      }
    } else if (isFor(node)) {
      if (isForX(node) && isVar(node.left)) {
        self.pushDeclar(node.left);
        const leftDecl = node.left.declarations[0];
        n.VariableDeclarator.assert(leftDecl);
        if (n.VariableDeclarator.check(leftDecl)) {
          node.left = leftDecl.id;
        }
      }
    } else if (isVar(node)) {
      // const replacements =
      //   self.pushDeclar(node).map((expr) => b.expressionStatement(expr));
      path.replace(
        ...self.pushDeclar(node).map((expr) => b.expressionStatement(expr))
      );
    } else if (n.Function.check(node)) {
      return false;
    }
    this.traverse(path);
  },
});

const loopLabelVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, state: LoopState) {
    this.state = state;
  },
  visitLabeledStatement(path: NodePath<n.LabeledStatement>) {
    const state = this.state as LoopState;
    state.innerLabels.push(path.node.label.name);
    this.traverse(path);
  },
});

const continuationVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, state: ContinuationVisitorState) {
    this.state = state;
  },
  visitNode(path: NodePath<n.ASTNode>) {
    const { node } = path;
    const state = this.state as ContinuationVisitorState;
    if (n.AssignmentExpression.check(node) || n.UpdateExpression.check(node)) {
      const bindings = getBindingIdentifiers(node);
      for (const name in bindings) {
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
  node: n.ASTNode
): node is n.BreakStatement | n.ContinueStatement {
  return n.BreakStatement.check(node) || n.ContinueStatement.check(node);
}

function loopNodeTo(node: n.ASTNode): string | undefined {
  if (n.BreakStatement.check(node)) {
    return "break";
  } else if (n.ContinueStatement.check(node)) {
    return "continue";
  }
}

type LoopStatementVisitorNodePath = NodePath<
  n.BreakStatement | n.ContinueStatement | n.ReturnStatement
>;

function loopStatementVisitorFn(
  this: Context,
  path: LoopStatementVisitorNodePath,
  state: LoopState
): void | false {
  const { node } = path;
  if (getData<boolean>(node, "@@LOOP_IGNORE")) return false;
  // if (node[LOOP_IGNORE]) return false;

  let replace;
  let loopText = loopNodeTo(node);

  if (isLoopNodeTo(node) && loopText) {
    if (node.label) {
      // we shouldn't be transforming this because it exists somewhere inside
      if (state.innerLabels.indexOf(node.label.name) >= 0) {
        return false;
      }

      loopText = `${loopText}|${node.label.name}`;
    } else {
      // we shouldn't be transforming these statements because
      // they don"t refer to the actual loop we're scopifying
      if (state.ignoreLabeless) return false;

      //
      // if (state.inSwitchCase) return;

      // break statements mean something different in this context
      if (n.BreakStatement.check(node) && state.inSwitchCase) return false;
    }

    state.hasBreakContinue = true;
    state.map[loopText] = node;
    replace = b.literal(loopText);
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
    setData(replace, "@@LOOP_IGNORE", true);
    // replace[LOOP_IGNORE] = true;
    path.replace(inherits(replace, node));
    return false;
  }

  this.traverse(path);
}

const loopVisitor = PathVisitor.fromMethodsObject({
  reset(path: NodePath, state: LoopState) {
    this.state = state;
  },
  visitDoWhileStatement(path: NodePath<n.DoWhileStatement>) {
    const state = this.state as LoopState;
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    this.traverse(path);
    state.ignoreLabeless = oldIgnoreLabeless;
  },
  visitForInStatement(path: NodePath<n.ForInStatement>) {
    const state = this.state as LoopState;
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    this.traverse(path);
    state.ignoreLabeless = oldIgnoreLabeless;
  },
  visitForStatement(path: NodePath<n.ForStatement>) {
    const state = this.state as LoopState;
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    this.traverse(path);
    state.ignoreLabeless = oldIgnoreLabeless;
  },
  visitWhileStatement(path: NodePath<n.WhileStatement>) {
    const state = this.state as LoopState;
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    this.traverse(path);
    state.ignoreLabeless = oldIgnoreLabeless;
  },
  visitForOfStatement(path: NodePath<n.ForOfStatement>) {
    const state = this.state as LoopState;
    const oldIgnoreLabeless = state.ignoreLabeless;
    state.ignoreLabeless = true;
    this.traverse(path);
    state.ignoreLabeless = oldIgnoreLabeless;
  },
  visitFunction() {
    return false;
  },
  visitSwitchCase(path: NodePath<n.SwitchCase>) {
    const state = this.state as LoopState;
    const oldInSwitchCase = state.inSwitchCase;
    state.inSwitchCase = true;
    this.traverse(path);
    state.inSwitchCase = oldInSwitchCase;
  },
  visitBreakStatement(path: NodePath<n.BreakStatement>) {
    const state = this.state as LoopState;
    return loopStatementVisitorFn.call(this, path, state);
  },
  visitContinueStatement(path: NodePath<n.ContinueStatement>) {
    const state = this.state as LoopState;
    return loopStatementVisitorFn.call(this, path, state);
  },
  visitReturnStatement(path: NodePath<n.ReturnStatement>) {
    const state = this.state as LoopState;
    return loopStatementVisitorFn.call(this, path, state);
  },
});

type BlockScopingBlock = n.BlockStatement | n.SwitchStatement | n.Program;

type BlockScopingLoop = (Loop | n.CatchClause) & { body: n.BlockStatement };

class BlockScoping<
  L extends BlockScopingLoop = BlockScopingLoop,
  LP extends NodePath<L> | null = NodePath<L> | null,
  B extends NodePath<BlockScopingBlock> = NodePath<BlockScopingBlock>
> {
  letReferences: Record<string, n.Identifier>;
  scopePath: NodePath<n.ASTNode>;
  scope: Scope;
  loopPath: NodePath<L> | undefined;
  blockPath: B;
  parent: NodePath<
    n.Program | n.File | K.ExpressionKind | K.FunctionKind | K.StatementKind
  >;
  block: B["node"];
  outsideLetReferences: Record<string, n.Identifier>;
  hasLetReferences: boolean;
  loopParent: NodePath<n.ASTNode> | undefined;
  loopLabel: n.Identifier | undefined;
  loop: L | undefined;
  body: Array<
    | BlockScopingBlock
    | n.ExpressionStatement
    | n.VariableDeclaration
    | n.SwitchStatement
    | n.IfStatement
  >;
  has?: LoopState;

  constructor(
    loopPath: LP,
    blockPath: B,
    parent: NodePath<
      n.Program | n.File | K.ExpressionKind | K.FunctionKind | K.StatementKind
    >,
    scopePath: NodePath<n.ASTNode>
  ) {
    this.parent = parent;
    this.scopePath = scopePath;
    this.scope = scopePath.scope;

    if (Array.isArray(blockPath.value)) {
      this.blockPath = blockPath.parentPath;
    } else {
      this.blockPath = blockPath;
    }
    // this.blockPath = blockPath;
    this.block = blockPath.node;

    this.outsideLetReferences = {};
    this.hasLetReferences = false;
    this.letReferences = {};
    this.body = [];

    if (loopPath) {
      this.loopParent = loopPath.parent;
      if (
        this.loopParent &&
        n.LabeledStatement.check(this.loopParent.node) &&
        n.Identifier.check(this.loopParent.node.label)
      ) {
        this.loopLabel = this.loopParent.node.label;
      }
      this.loopPath = loopPath as NodePath<L>;
      this.loop = loopPath.node;
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
      return b.labeledStatement(this.loopLabel, this.loop as Loop);
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
    // const parentBindings = parentScope.getBindings();

    // const parentScope = scope.getFunctionParent();

    const letRefs = this.letReferences;

    for (const key of Object.keys(letRefs)) {
      const ref = letRefs[key];
      // const bindings = scope.getBindings();
      const binding = bindings[ref.name];
      if (!binding) continue;
      if (binding.kind === "let" || binding.kind === "const") {
        binding.kind = "var";

        delete bindings[ref.name];
        if (!wrappedInClosure && parentScope) {
          const parentBindings = parentScope.getBindings();
          parentBindings[ref.name] = binding;
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
    // alright, so since we aren"t wrapping this block in a closure
    // we have to check if any of our let variables collide with
    // those in upper scopes and then if they do, generate a uid
    // for them and replace all references with it
    for (const key of Object.keys(letRefs)) {
      // just an Identifier node we collected in `getLetReferences`
      // this is the defining identifier of a declaration
      const ref = letRefs[key] as n.Identifier;

      // todo: could skip this if the colliding binding is in another function
      if (
        (parentScope && parentScope.lookup(key)) ||
        (!scope.isGlobal && scope.getGlobalScope().declares(key))
      ) {
        // const binding = getOwnBinding(scope, key);
        // const parentBinding = getOwnBinding(parentScope, key);
        // if (
        //   !binding ||
        //   ((!n.Function.check(binding.node) ||
        //     (!binding.node.async && !binding.node.generator)) &&
        //     (!parentBinding || isVar(parentBinding.parent)) &&
        //     !isStrict(binding.parentPath))
        // ) {
        //   if (binding) {
        //     console.log(scope.getBindings());
        //     console.log("binding.name=", binding.name);
        //     console.log("binding.node.type=", binding.node.type);
        //     if (scope.path && scope.path.node) {
        //       console.log("scope.path.node.type=", scope.path.node.type);
        //     }
        //     if (scope.path && scope.path.parent && scope.path.parent.node) {
        //       console.log("scope.path.parent.node.type=", scope.path.parent.node.type);
        //     }
        //     if (scope.path && scope.path.parent && scope.path.parent.parent && scope.path.parent.parent.node) {
        //       console.log("scope.path.parent.parent.node.type=", scope.path.parent.parent.node.type);
        //     }
        //     if (binding.parent && binding.parent.node) {
        //       console.log("binding.parent.node.type=", binding.parent.node.type);
        //     }
        //     if (parentScope && parentScope.path && parentScope.path.node) {
        //       console.log("parentScope.path.node.type=", parentScope.path.node.type);
        //     }
        //   }
        //   if (parentBinding) {
        //     console.log("parentBinding.name=", parentBinding.name);
        //     console.log("parentBinding.node.type=", parentBinding.node.type);
        //   }
        //   continue;
        // }

        // The same identifier might have been bound separately in the block scope and
        // the enclosing scope (e.g. loop or catch statement), so we should handle both
        // individually
        if (scope.declares(key)) {
          (scope as any).ref = ref;
          rename(scope, ref.name);
          // blockPathScope.scan(true);
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

        if (
          this.scope.getGlobalScope().declares(id.name) ||
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
      b.callExpression(b.literal("__placeholder__"), args);
    const basePath: Array<number | string> = ["callee"];

    let hasYield = false;
    let hasAsync = false;

    visit(fn.body, {
      visitNode(path: NodePath<n.ASTNode>) {
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
      // placeholderPath = "declarations.0.init" + basePath;
      index = this.body.length - 1;

      this.buildHas(ret);
    } else {
      this.body.push(b.expressionStatement(call));
      placeholderPath = ["expression", ...basePath];
      // placeholderPath = "expression" + basePath;
      index = this.body.length - 1;
    }

    let callPath;
    // replace the current block body with the one we're going to build
    if (isSwitch) {
      const listKey = this.blockPath.parentPath.name as string;
      const key = this.blockPath.name as number;
      const grandparentPath = this.blockPath.parentPath
        .parentPath as NodePath<n.ASTNode>;
      // const { parentPath, listKey, key } = this.blockPath;

      this.blockPath.replace(...this.body);
      callPath = grandparentPath.get(listKey, key + index);
    } else if (nodeHasProp(block, "body")) {
      block.body = this.body;
      callPath = this.blockPath.get("body", index);
    }

    const placeholder = callPath.get(...placeholderPath);

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
      const p = refNode.insertBefore(loopIdDecl);
      const fnPathIndex = (refNode.name as number) - 1;

      placeholder.replace(loopId);
      fnPath = p.get(fnPathIndex, "declarations", 0, "init");
    } else {
      placeholder.replace(fn);
      fnPath = placeholder;
    }

    // Ensure "this", "arguments", and "super" continue to work in the wrapped function.
    unwrapFunctionEnvironment(fnPath);
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

    const fnPath = new ASTNodePath({ root: fn }, this.scopePath).get("root");

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
        returnStatement.insertBefore(
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              b.identifier(paramName),
              b.identifier(newParamName)
            )
          )
        );
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
        // Object.assign(this.outsideLetReferences, getBindingIdentifiers(init));
      }
    }

    const addDeclarationsFromChild = (
      path: NodePath<n.ASTNode>,
      childPath?: NodePath<n.ASTNode>
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
          // const declar = consequents[j];
          // addDeclarationsFromChild(declarPaths.get(i), declar);
          addDeclarationsFromChild(
            declarPaths.get(i),
            declarPaths.get(i, "consequent", j)
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
    letReferenceBlockVisitor.visit(this.blockPath, state);

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
      // LOOP_IGNORE: Symbol(),
    };

    loopLabelVisitor.visit(this.blockPath, state);
    loopVisitor.visit(this.blockPath, state);

    return state;
  }

  /**
   * Hoist all let declarations in this block to before it so they retain scope
   * once we wrap everything in a closure.
   */

  hoistVarDeclarations() {
    hoistVarDeclarationsVisitor.visit(this.blockPath, this);
    // this.blockPath.traverse(hoistVarDeclarationsVisitor, this);
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
        cases.push(b.switchCase(b.literal(key), [has.map[key]]));
      }

      if (retCheck) {
        cases.push(b.switchCase(null, [retCheck]));
      }

      /* istanbul ignore else */
      if (cases.length === 1) {
        const single = cases[0];
        body.push(
          b.ifStatement(
            b.binaryExpression("===", ret, single.test as K.ExpressionKind),
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

function visitBlockScopingLoop<T extends NodePath<Loop>>(
  this: Context,
  path: T
): void {
  const { parent } = path;
  const blockPath = ensureBlock(path);
  const blockScoping = new BlockScoping(
    blockPath,
    blockPath.get("body") as NodePath<n.BlockStatement>,
    parent,
    blockPath
  );
  const replace = blockScoping.run();
  if (replace) path.replace(replace);
  this.traverse(path);
}

function visitBlockScopingStatementProgram<
  T extends NodePath<n.BlockStatement | n.SwitchStatement | n.Program>
>(this: Context, path: T): void {
  if (!ignoreBlock(path)) {
    const blockScoping = new BlockScoping(null, path, path.parent, path);
    blockScoping.run();
  }
  this.traverse(path);
}

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
      const { node, parent, scope } = path;
      if (isBlockScoped(node)) {
        convertBlockScopedToVar(path, null, parent, scope, true);
      }
      this.traverse(path);
    },
    visitDoWhileStatement(path: NodePath<n.DoWhileStatement>) {
      visitBlockScopingLoop.call(this, path);
    },
    visitForInStatement(path: NodePath<n.ForInStatement>) {
      visitBlockScopingLoop.call(this, path);
    },
    visitForStatement(path: NodePath<n.ForStatement>) {
      visitBlockScopingLoop.call(this, path);
    },
    visitWhileStatement(path: NodePath<n.WhileStatement>) {
      visitBlockScopingLoop.call(this, path);
    },
    visitForOfStatement(path: NodePath<n.ForOfStatement>) {
      visitBlockScopingLoop.call(this, path);
    },
    visitCatchClause(path: NodePath<n.CatchClause>) {
      const blockPath = ensureBlock(path);
      const blockScoping = new BlockScoping(
        blockPath,
        blockPath.get("body") as NodePath<n.BlockStatement>,
        path.parent,
        path
      );
      blockScoping.run();
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
  }),
};

export default plugin;
