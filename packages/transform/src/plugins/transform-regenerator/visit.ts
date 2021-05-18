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
  ASTNode,
  NodePath as ASTNodePath,
  PathVisitor,
  // visit,
  builtInTypes,
} from "ast-types";
import type { NodePath } from "ast-types/lib/node-path";
import * as K from "ast-types/gen/kinds";
import { hoist } from "./hoist";
import { Emitter } from "./emit";
import { runtimeProperty, isReference, findParent } from "./util";
import cloneDeep from "lodash.clonedeep";

const isArray = builtInTypes.array;

const mMap = new WeakMap();

type RuntimeMarkVariableDeclaration = n.VariableDeclaration & {
  declarations: Array<
    n.VariableDeclarator & {
      id: n.Identifier;
      init: n.CallExpression & {
        callee: n.MemberExpression & {
          object: n.ArrayExpression;
        };
      };
    }
  >;
};

type MarkInfo = {
  decl?: RuntimeMarkVariableDeclaration;
};

function getMarkInfo(node: ASTNode): MarkInfo {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  return mMap.get(node) as MarkInfo;
}

const mMapBlockHoist = new WeakMap();

type BlockHoistInfo = {
  blockHoist?: number;
};

function getBlockHoistInfo(node: ASTNode): BlockHoistInfo {
  if (!mMapBlockHoist.has(node)) {
    mMapBlockHoist.set(node, {});
  }
  return mMapBlockHoist.get(node) as BlockHoistInfo;
}

type TransformOptions = {
  madeChanges?: boolean;
  disableAsync?: boolean;
};

export function transform(
  node: NodePath | ASTNode,
  options?: TransformOptions
): ASTNode {
  options = options || {};

  const path = node instanceof ASTNodePath ? node : new ASTNodePath(node);
  visitor.visit(path, options);
  node = path.node as ASTNode;

  // if (
  //   options.includeRuntime === true ||
  //   (options.includeRuntime === "if used" && visitor.wasChangeReported())
  // ) {
  //   injectRuntime(n.File.check(node) ? node.program : node);
  // }

  options.madeChanges = visitor.wasChangeReported();

  return node;
}

// function injectRuntime(program) {
//   n.Program.assert(program);
//
//   // Include the runtime by modifying the AST rather than by concatenating
//   // strings. This technique will allow for more accurate source mapping.
//   var runtimePath = require("..").runtime.path;
//   var runtime = fs.readFileSync(runtimePath, "utf8");
//   var runtimeBody = recast.parse(runtime, {
//     sourceFileName: runtimePath,
//   }).program.body;
//
//   var body = program.body;
//   body.unshift.apply(body, runtimeBody);
// }

const visitor = PathVisitor.fromMethodsObject({
  reset(node: ASTNode, options: TransformOptions) {
    this.options = options;
  },

  visitFunction(path: NodePath<K.FunctionKind>): void | n.CallExpression {
    // Calling this.traverse(path) first makes for a post-order traversal.
    this.traverse(path);

    const { node } = path;
    const shouldTransformAsync = node.async && !this.options.disableAsync;

    if (!node.generator && !shouldTransformAsync) {
      return;
    }

    if (node.expression) {
      // Transform expression lambdas into normal functions.
      node.expression = false;
      node.body = b.blockStatement([
        b.returnStatement(node.body as K.ExpressionKind),
      ]);
    }

    this.reportChanged();

    if (shouldTransformAsync) {
      awaitVisitor.visit(path.get("body"));
    }

    const outerBody: K.StatementKind[] = [];
    const innerBody: K.StatementKind[] = [];
    const bodyPath = path.get("body", "body");

    bodyPath.each((childPath: NodePath<K.StatementKind>) => {
      const { node } = childPath;

      // const { blockHoist } = getBlockHoistInfo(node);
      // // if (node && getBlockHoistInfo(node).blockHoist !== null )
      // if (blockHoist !== undefined) {
      //   outerBody.push(node);
      // } else {
      //   innerBody.push(node);
      // }
      innerBody.push(node);
      // if (node && node._blockHoist != null) {
      //   outerBody.push(node);
      // } else {
      //   innerBody.push(node);
      // }
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
    n.Identifier.assert(node.id);
    const innerFnId = b.identifier((node.id as n.Identifier).name + "$");
    const contextId = path.scope.declareTemporary("context$") as n.Identifier;
    const argsId = path.scope.declareTemporary("args$") as n.Identifier;

    // Turn all declarations into vars, and replace the original
    // declarations with equivalent assignment expressions.
    let vars = hoist(path);

    const didRenameArguments = renameArguments(path, argsId);
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
      // Async functions that are not generators don't care about the
      // outer function because they don't need it to be marked and don't
      // inherit from its .prototype.
      node.generator ? outerFnExpr : b.literal(null),
      b.thisExpression(),
    ];

    const tryLocsList = emitter.getTryLocsList();
    if (tryLocsList) {
      wrapArgs.push(tryLocsList);
    }

    const wrapCall = b.callExpression(
      runtimeProperty(shouldTransformAsync ? "async" : "wrap"),
      wrapArgs
    );

    outerBody.push(b.returnStatement(wrapCall));
    node.body = b.blockStatement(outerBody);

    const wasGeneratorFunction = node.generator;
    if (wasGeneratorFunction) {
      node.generator = false;
    }

    if (shouldTransformAsync) {
      node.async = false;
    }

    if (wasGeneratorFunction && n.Expression.check(node)) {
      return b.callExpression(runtimeProperty("mark"), [
        node as K.ExpressionKind,
      ]);
    }
  },

  visitForOfStatement(path: NodePath<n.ForOfStatement>): n.ForStatement {
    this.traverse(path);

    const { node } = path;
    const tempIterId = path.scope.declareTemporary("t$");
    const tempIterDecl = b.variableDeclarator(
      tempIterId,
      b.callExpression(runtimeProperty("values"), [node.right])
    );

    const tempInfoId = path.scope.declareTemporary("t$");
    const tempInfoDecl = b.variableDeclarator(tempInfoId, null);

    let init = node.left;
    let loopId;
    if (n.VariableDeclaration.check(init)) {
      loopId = n.Identifier.check(init.declarations[0])
        ? init.declarations[0]
        : (init.declarations[0] as n.VariableDeclarator).id;
      init.declarations.push(tempIterDecl, tempInfoDecl);
    } else {
      loopId = init;
      init = b.variableDeclaration("var", [tempIterDecl, tempInfoDecl]);
    }
    n.Identifier.assert(loopId);

    const loopIdAssignExprStmt = b.expressionStatement(
      b.assignmentExpression(
        "=",
        loopId,
        b.memberExpression(tempInfoId, b.identifier("value"), false)
      )
    );

    if (n.BlockStatement.check(node.body)) {
      node.body.body.unshift(loopIdAssignExprStmt);
    } else {
      node.body = b.blockStatement([loopIdAssignExprStmt, node.body]);
    }

    return b.forStatement(
      init,
      b.unaryExpression(
        "!",
        b.memberExpression(
          b.assignmentExpression(
            "=",
            tempInfoId,
            b.callExpression(
              b.memberExpression(tempIterId, b.identifier("next"), false),
              []
            )
          ),
          b.identifier("done"),
          false
        )
      ),
      null,
      node.body
    );
  },
});

// Given a NodePath for a Function, return an Expression node that can be
// used to refer reliably to the function object from inside the function.
// This expression is essentially a replacement for arguments.callee, with
// the key advantage that it works in strict mode.
function getOuterFnExpr(
  funPath: NodePath<K.FunctionKind>
): n.Identifier | n.MemberExpression {
  const { node } = funPath;
  n.Function.assert(node);

  if (
    node.generator && // Non-generator functions don't need to be marked.
    n.FunctionDeclaration.check(node)
  ) {
    const blockPath = findParent(
      funPath,
      (path) =>
        n.Program.check(path.value) || n.BlockStatement.check(path.value)
    );

    if (!blockPath) {
      return node.id as n.Identifier;
    }

    const markDecl = getRuntimeMarkDecl(blockPath);
    const markedArray = markDecl.declarations[0].id;
    const funDeclIdArray = markDecl.declarations[0].init.callee.object;
    n.ArrayExpression.assert(funDeclIdArray);

    const index = funDeclIdArray.elements.length;
    funDeclIdArray.elements.push(node.id);

    return b.memberExpression(markedArray, b.literal(index), true);
  }

  return (node.id ||
    (node.id = funPath.scope.parent.declareTemporary(
      "callee$"
    ))) as n.Identifier;
}

function getRuntimeMarkDecl(
  blockPath: NodePath<n.Program | n.BlockStatement>
): RuntimeMarkVariableDeclaration {
  assert.ok(blockPath instanceof ASTNodePath);
  const block = blockPath.node;
  isArray.assert(block.body);

  const info = getMarkInfo(block);
  if (info.decl) {
    return info.decl;
  }

  const tempId = blockPath.scope.declareTemporary("marked") as n.Identifier;

  info.decl = b.variableDeclaration("var", [
    b.variableDeclarator(
      tempId,
      b.callExpression(
        b.memberExpression(b.arrayExpression([]), b.identifier("map"), false),
        [runtimeProperty("mark")]
      )
    ),
  ]) as RuntimeMarkVariableDeclaration;

  let i = 0;

  for (i = 0; i < block.body.length; ++i) {
    if (!shouldNotHoistAbove(blockPath.get("body", i))) {
      break;
    }
  }

  blockPath.get("body").insertAt(i, info.decl);

  return info.decl;
}

function shouldNotHoistAbove(stmtPath: NodePath<K.StatementKind>): boolean {
  const value = stmtPath.node;
  n.Statement.assert(value);

  // If the first statement is a "use strict" declaration, make sure to
  // insert hoisted declarations afterwards.
  return (
    n.ExpressionStatement.check(value) &&
    n.Literal.check(value.expression) &&
    value.expression.value === "use strict"
  );
}

function renameArguments(
  funcPath: NodePath<K.FunctionKind>,
  argsId: n.Identifier
) {
  assert.ok(funcPath instanceof ASTNodePath);
  const func = funcPath.node;
  let didRenameArguments = false;

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
        path.replace(argsId);
        didRenameArguments = true;
        return false;
      }

      this.traverse(path);
    },
  });

  renameArgumentsVisitor.visit(funcPath);

  // If the traversal replaced any arguments references, then we need to
  // alias the outer function's arguments binding (be it the implicit
  // arguments object or some other parameter or variable) to the variable
  // named by argsId.
  return didRenameArguments;
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
