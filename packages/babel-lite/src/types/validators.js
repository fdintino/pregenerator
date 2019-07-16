import { getBindingIdentifiers } from "./retrievers";
import esutils from "esutils";
import * as t from "./index";
import { BLOCK_SCOPED_SYMBOL } from "./constants";

/**
 * Check if the input `node` is a binding identifier.
 */

export function isBinding(node, parent) {
  let keys = getBindingIdentifiers.keys[parent.type];
  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let val = parent[key];
      if (Array.isArray(val)) {
        if (val.indexOf(node) >= 0) return true;
      } else {
        if (val === node) return true;
      }
    }
  }

  return false;
}

/**
 * Check if the input `node` is a reference to a bound variable.
 */

export function isReferenced(node, parent) {
  switch (parent.type) {
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.NODE
    case "MemberExpression":
    case "BindExpression":
      if (parent.property === node && parent.computed) {
        return true;
      } else if (parent.object === node) {
        return true;
      } else {
        return false;
      }

    // yes: { [NODE]: "" }
    // yes: { NODE }
    // no: { NODE: "" }
    case "ObjectProperty":
      if (parent.key === node) {
        return parent.computed;
      }

    // no: let NODE = init;
    // yes: let id = NODE;
    case "VariableDeclarator":
      return parent.id !== node;

    // no: function NODE() {}
    // no: function foo(NODE) {}
    case "ArrowFunctionExpression":
    case "FunctionDeclaration":
    case "FunctionExpression":
      for (let param of parent.params) {
        if (param === node) return false;
      }

      return parent.id !== node;

    case "LabeledStatement":
      return false;

    // no: try {} catch (NODE) {}
    case "CatchClause":
      return parent.param !== node;

    // no: function foo(...NODE) {}
    case "RestElement":
      return false;

    // yes: left = NODE;
    // no: NODE = right;
    case "AssignmentExpression":
      return parent.right === node;

    // no: [NODE = foo] = [];
    // yes: [foo = NODE] = [];
    case "AssignmentPattern":
      return parent.right === node;

    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    case "ObjectPattern":
    case "ArrayPattern":
      return false;
  }

  return true;
}

/**
 * Check if the input `name` is a valid identifier name
 * and isn't a reserved word.
 */

export function isValidIdentifier(name) {
  if (typeof name !== "string" || esutils.keyword.isReservedWordES6(name, true)) {
    return false;
  } else {
    return esutils.keyword.isIdentifierNameES6(name);
  }
}

/**
 * Check if the input `node` is a `let` variable declaration.
 */

export function isLet(node) {
  return t.isVariableDeclaration(node) && (node.kind !== "var" || node[BLOCK_SCOPED_SYMBOL]);
}

/**
 * Check if the input `node` is block scoped.
 */

export function isBlockScoped(node) {
  return t.isFunctionDeclaration(node) || t.isClassDeclaration(node) || t.isLet(node);
}

/**
 * Check if the input `node` is a variable declaration.
 */

export function isVar(node) {
  return t.isVariableDeclaration(node, { kind: "var" }) && !node[BLOCK_SCOPED_SYMBOL];
}

/**
 * Check if the input `node` is a scope.
 */

export function isScope(node, parent) {
  if (t.isBlockStatement(node) && t.isFunction(parent, { body: node })) {
    return false;
  }

  return t.isScopable(node);
}
