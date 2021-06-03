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
  visit,
  NodePath as ASTNodePath,
} from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";
import clone from "lodash.clone";

const hasOwn = Object.prototype.hasOwnProperty;

function assertIsNodePath(path: unknown): asserts path is NodePath {
  assert.ok(path instanceof ASTNodePath);
}

function assertFunctionPath(
  path: unknown
): asserts path is NodePath<K.FunctionKind> {
  // assert.ok(path instanceof ASTNodePath);
  assertIsNodePath(path);
  n.Function.assert(path.node);
}

// The hoist function takes a FunctionExpression or FunctionDeclaration
// and replaces any Declaration nodes in its body with assignments, then
// returns a VariableDeclaration containing just the names of the removed
// declarations.
export function hoist(funPath: unknown): n.VariableDeclaration | null {
  assertFunctionPath(funPath);

  const vars: Record<string, n.Identifier> = {};

  function varDeclToExpr(
    vdec: n.VariableDeclaration,
    includeIdentifiers: boolean
  ): n.SequenceExpression | n.Identifier | n.AssignmentExpression | null {
    n.VariableDeclaration.assert(vdec);
    const exprs: Array<n.Identifier | n.AssignmentExpression> = [];

    vdec.declarations.forEach((dec) => {
      let id;
      if (dec.type === "Identifier") {
        id = dec;
      } else if (
        dec.type === "VariableDeclarator" &&
        dec.id.type === "Identifier"
      ) {
        id = dec.id;
      } else {
        return;
      }
      vars[id.name] = id;

      if (dec.type === "VariableDeclarator" && dec.init) {
        exprs.push(b.assignmentExpression("=", dec.id, dec.init));
      } else if (includeIdentifiers) {
        exprs.push(id);
      }
    });

    if (exprs.length === 0) return null;

    if (exprs.length === 1) return exprs[0];

    return b.sequenceExpression(exprs);
  }

  visit(funPath.get("body"), {
    visitVariableDeclaration(
      path: NodePath<n.VariableDeclaration>
    ): n.ExpressionStatement | false {
      const expr = varDeclToExpr(path.node, false);
      if (expr === null) {
        path.replace();
      } else {
        // We don't need to traverse this expression any further because
        // there can't be any new declarations inside an expression.
        return b.expressionStatement(expr);
      }

      // Since the original node has been either removed or replaced,
      // avoid traversing it any further.
      return false;
    },

    visitForStatement(path: NodePath<n.ForStatement>): void {
      const init = path.node.init;
      if (n.VariableDeclaration.check(init)) {
        path.get("init").replace(varDeclToExpr(init, false));
      }
      this.traverse(path);
    },

    visitForInStatement(path: NodePath<n.ForInStatement>): void {
      const left = path.node.left;
      if (n.VariableDeclaration.check(left)) {
        path.get("left").replace(varDeclToExpr(left, true));
      }
      this.traverse(path);
    },

    visitFunctionDeclaration(path: NodePath<n.FunctionDeclaration>): false {
      const node = path.node;
      if (!node.id || node.id.type !== "Identifier") {
        return false;
      }
      vars[node.id.name] = node.id;

      const assignment = b.expressionStatement(
        b.assignmentExpression(
          "=",
          clone(node.id),
          b.functionExpression(
            path.scope.declareTemporary(node.id.name),
            node.params,
            node.body,
            node.generator,
            node.expression
          )
        )
      );

      if (n.BlockStatement.check(path.parent.node)) {
        // Insert the assignment form before the first statement in the
        // enclosing block.
        path.parent.get("body").unshift(assignment);

        // Remove the function declaration now that we've inserted the
        // equivalent assignment form at the beginning of the block.
        path.replace();
      } else {
        // If the parent node is not a block statement, then we can just
        // replace the declaration with the equivalent assignment form
        // without worrying about hoisting it.
        path.replace(assignment);
      }

      // Don't hoist variables out of inner functions.
      return false;
    },

    visitFunctionExpression(): false {
      // Don't descend into nested function expressions.
      return false;
    },

    visitArrowFunctionExpression(): false {
      // Don't descend into nested arrow function expressions.
      return false;
    },
  });

  const paramNames: Record<string, n.Identifier> = {};
  funPath.get("params").each((paramPath: NodePath<K.PatternKind>) => {
    const param = paramPath.node;
    if (n.Identifier.check(param)) {
      paramNames[param.name] = param;
    } else {
      // Variables declared by destructuring parameter patterns will be
      // harmlessly re-declared.
    }
  });

  const declarations: n.VariableDeclarator[] = [];

  Object.keys(vars).forEach((name: string) => {
    if (!hasOwn.call(paramNames, name)) {
      declarations.push(b.variableDeclarator(vars[name], null));
    }
  });

  if (declarations.length === 0) {
    return null; // Be sure to handle this case!
  }

  return b.variableDeclaration("var", declarations);
}
