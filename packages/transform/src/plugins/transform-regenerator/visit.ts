/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */
import assert from "assert";
import {
  namedTypes as n,
  builders as b,
  NodePath as ASTNodePath,
  PathVisitor,
  Scope,
} from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import type * as K from "@pregenerator/ast-types/gen/kinds";
import { hoist } from "./hoist";
import { Emitter } from "./emit";
import { runtimeProperty, isReference, findParent } from "./util";
import cloneDeep from "lodash.clonedeep";
import { ensureBlock } from "../../utils/conversion";
import { rename } from "../../utils/renamer";
import { getData } from "../../utils/data";

const mMap = new WeakMap();

type MarkInfo = {
  decl?: n.VariableDeclaration;
  declPath?: NodePath<n.VariableDeclaration>;
};

function getMarkInfo(node: n.Node): MarkInfo {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  return mMap.get(node) as MarkInfo;
}

type TransformOptions = {
  madeChanges?: boolean;
  disableAsync?: boolean;
  num: number;
};

export function transform(
  node: NodePath | n.Node,
  options?: TransformOptions
): n.Node {
  options = options || { num: 0 };

  const path = node instanceof ASTNodePath ? node : new ASTNodePath(node);
  visitor.visit(path, options);
  node = path.node as n.Node;

  options.madeChanges = visitor.wasChangeReported();

  return node;
}

const visitor = PathVisitor.fromMethodsObject<TransformOptions>({
  reset(node: NodePath, options: TransformOptions) {
    // this.options = options;
    if (!options.num) {
      options.num = 1;
    }
  },

  visitFunction(
    path: NodePath<K.FunctionKind>,
    options: TransformOptions
  ): void | n.CallExpression {
    // Calling this.traverse(path) first makes for a post-order traversal.
    this.traverse(path);

    const { node } = path;
    const shouldTransformAsync = node.async && !options.disableAsync;

    if (!node.generator && !shouldTransformAsync) {
      return;
    }

    if (!path.scope) {
      throw new Error("");
    }

    const varsSuffix = options.num === 1 ? "" : `${options.num}`;
    options.num++;
    const contextId = path.scope.declareTemporary(
      `context${varsSuffix}`
    ) as n.Identifier;
    const argsId = path.scope.declareTemporary(
      `args${varsSuffix}`
    ) as n.Identifier;

    ensureBlock(path);
    const bodyBlockPath = path.get("body");

    this.reportChanged();

    if (shouldTransformAsync) {
      awaitVisitor.visit(bodyBlockPath);
    }

    const outerBody: K.StatementKind[] = [];
    const innerBody: K.StatementKind[] = [];
    const bodyPath = bodyBlockPath.get("body");

    bodyPath.each((childPath: NodePath<K.StatementKind>) => {
      const { node } = childPath;

      const blockHoist = getData<number>(node, "_blockHoist");

      if (
        n.ExpressionStatement.check(node) &&
        n.Literal.check(node.expression) &&
        typeof node.expression.value === "string"
      ) {
        outerBody.push(node);
      } else if (blockHoist !== undefined) {
        outerBody.push(node);
      } else {
        innerBody.push(node);
      }
    });

    if (outerBody.length > 0) {
      // Only replace the inner body if we actually hoisted any statements
      // to the outer body.
      bodyPath.replace(innerBody);
    }

    const outerFnExpr = getOuterFnExpr(path);
    // Note that getOuterFnExpr has the side-effect of ensuring that the
    // function has a name (so node.id will always be an Identifier), even
    // if a temporary name has to be synthesized.
    // n.Identifier.assert(node.id);
    n.assertIdentifier(node.id);
    const innerFnId = b.identifier(
      (node.id as n.Identifier).name + `${varsSuffix}$`
    );

    // Turn all declarations into vars, and replace the original
    // declarations with equivalent assignment expressions.
    let vars = hoist(path);

    const { didRenameArguments, usesThis } = renameArguments(path, argsId);

    if (didRenameArguments) {
      vars = vars || b.variableDeclaration("var", []);
      vars.declarations.push(
        b.variableDeclarator(cloneDeep(argsId), b.identifier("arguments"))
      );
    }

    const emitter = new Emitter(contextId);
    emitter.explode(path.get("body"));

    if (vars && vars.declarations.length > 0) {
      outerBody.push(vars);
    }

    const wrapArgs: K.ExpressionKind[] = [
      emitter.getContextFunction(innerFnId),
    ];
    const tryLocsList = emitter.getTryLocsList();

    if (node.generator) {
      wrapArgs.push(outerFnExpr);
    } else if (usesThis || tryLocsList || node.async) {
      // Async functions that are not generators don't care about the
      // outer function because they don't need it to be marked and don't
      // inherit from its .prototype.
      wrapArgs.push(b.nullLiteral(null));
    }
    if (usesThis) {
      wrapArgs.push(b.thisExpression());
    } else if (tryLocsList || node.async) {
      wrapArgs.push(b.nullLiteral(null));
    }

    if (tryLocsList) {
      wrapArgs.push(tryLocsList);
    } else if (node.async) {
      wrapArgs.push(b.nullLiteral(null));
    }

    if (node.async) {
      // Rename any locally declared "Promise" variable,
      // to use the global one.
      let currentScope: Scope | null = path.scope as Scope;
      do {
        if (currentScope.declares("Promise")) {
          rename(currentScope, "Promise");
        }
      } while ((currentScope = currentScope.parent));

      wrapArgs.push(b.identifier("Promise"));
    }

    const wrapCall = b.callExpression(
      runtimeProperty(shouldTransformAsync ? "async" : "wrap"),
      wrapArgs
    );

    outerBody.push(b.returnStatement(wrapCall));
    node.body = b.blockStatement(outerBody);

    // We injected a few new variable declarations (for every hoisted var),
    // so we need to add them to the scope.
    // path
    //   .get("body")
    //   .get("body")
    //   .each((p: NodePath) => p.scope?.scan(true));

    const wasGeneratorFunction = node.generator;
    if (wasGeneratorFunction) {
      node.generator = false;
    }

    if (shouldTransformAsync) {
      node.async = false;
    }

    if (wasGeneratorFunction && n.Expression.check(node)) {
      path.replace(
        b.callExpression(runtimeProperty("mark"), [node as K.ExpressionKind])
      );
      if (!path.node.comments) {
        path.node.comments = [];
      }
      path.node.comments.push({
        type: "CommentBlock",
        leading: true,
        value: "#__PURE__",
      });
    }
  },
});

function getMarkedFunctionId(funPath: NodePath<K.FunctionKind>): n.Identifier {
  const node = funPath.node;
  // n.Identifier.assert(node.id);
  n.assertIdentifier(node.id);

  const blockPath = findParent(
    funPath,
    (path) => n.Program.check(path.value) || n.BlockStatement.check(path.value)
  ) as
    | undefined
    | NodePath<n.Program, n.Program>
    | NodePath<n.BlockStatement, n.BlockStatement>;

  if (!blockPath) {
    return node.id as n.Identifier;
  }
  if (!blockPath.scope) {
    throw new Error("");
  }

  const block = blockPath.node;
  assert.ok(Array.isArray(block.body));

  const info = getMarkInfo(block);
  if (!info.decl) {
    info.decl = b.variableDeclaration("var", []);
    blockPath.get("body").unshift(info.decl);
    info.declPath = blockPath.get("body").get(0);
  }

  // assert.strictEqual(info.declPath.node, info.decl);

  // Get a new unique identifier for our marked variable.
  const markedId = blockPath.scope.declareTemporary("marked");
  const markCallExp = b.callExpression(runtimeProperty("mark"), [
    cloneDeep(node.id as n.Identifier),
  ]);

  const index =
    info.decl.declarations.push(b.variableDeclarator(markedId, markCallExp)) -
    1;

  const markCallExpPath = (info.declPath as NodePath<n.VariableDeclaration>)
    .get("declarations")
    .get(index)
    .get("init");

  assert.strictEqual(markCallExpPath.node, markCallExp);

  if (!markCallExpPath.node.comments) {
    markCallExpPath.node.comments = [];
  }
  markCallExpPath.node.comments.push({
    type: "CommentBlock",
    leading: true,
    value: "#__PURE__",
  });

  return cloneDeep(markedId);
}

// Given a NodePath for a Function, return an Expression node that can be
// used to refer reliably to the function object from inside the function.
// This expression is essentially a replacement for arguments.callee, with
// the key advantage that it works in strict mode.
function getOuterFnExpr(funPath: NodePath<K.FunctionKind>): n.Identifier {
  const { node } = funPath;
  n.assertFunction(node);

  if (!node.id) {
    if (!funPath?.scope?.parent) {
      throw new Error("");
    }
    // Default-exported function declarations, and function expressions may not
    // have a name to reference, so we explicitly add one.
    node.id = funPath.scope.parent.declareTemporary("callee");
  }
  if (
    node.generator && // Non-generator functions don't need to be marked.
    n.FunctionDeclaration.check(node)
  ) {
    // Return the identifier returned by runtime.mark(<node.id>).
    return getMarkedFunctionId(funPath);
  }

  return cloneDeep(node.id as n.Identifier);
}

function renameArguments(
  funcPath: NodePath<K.FunctionKind>,
  argsId: n.Identifier
) {
  assert.ok(funcPath instanceof ASTNodePath);
  const func = funcPath.node;
  let didRenameArguments = false;
  let usesThis = false;

  const renameArgumentsVisitor = PathVisitor.fromMethodsObject({
    visitFunction(path: NodePath<K.FunctionKind>) {
      if (path.node === func) {
        this.traverse(path);
      } else {
        return false;
      }
    },

    visitIdentifier(path: NodePath<n.Identifier>) {
      if (path.node.name === "arguments" && isReference(path)) {
        path.replace(cloneDeep(argsId));
        didRenameArguments = true;
        return false;
      }

      this.traverse(path);
    },

    visitThisExpression() {
      usesThis = true;
      return false;
    },
  });

  renameArgumentsVisitor.visit(funcPath);

  // If the traversal replaced any arguments references, then we need to
  // alias the outer function's arguments binding (be it the implicit
  // arguments object or some other parameter or variable) to the variable
  // named by argsId.
  return { didRenameArguments, usesThis };
}

const awaitVisitor = PathVisitor.fromMethodsObject({
  visitFunction() {
    return false; // Don't descend into nested function scopes.
  },

  visitAwaitExpression(path: NodePath<n.AwaitExpression>) {
    // Convert await and await* expressions to yield expressions.
    let argument = path.node.argument;

    // If the parser supports await* syntax using a boolean .all property
    // (#171), desugar that syntax to yield Promise.all(argument).
    if (path.node.all) {
      argument = b.callExpression(
        b.memberExpression(b.identifier("Promise"), b.identifier("all"), false),
        argument ? [argument] : []
      );
    }

    // Transforming `await x` to `yield regeneratorRuntime.awrap(x)`
    // causes the argument to be wrapped in such a way that the runtime
    // can distinguish between awaited and merely yielded values.
    return b.yieldExpression(
      b.callExpression(runtimeProperty("awrap"), argument ? [argument] : []),
      false
    );
  },
});
