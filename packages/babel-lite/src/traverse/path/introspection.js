// This file contains methods responsible for introspecting the current path for certain values.

import { includes } from "../../utils";
import * as t from "../../types";


/**
 * Check whether we have the input `key`. If the `key` references an array then we check
 * if the array has any items, otherwise we just check if it's falsy.
 */

export function has(key) {
  let val = this.node && this.node[key];
  if (val && Array.isArray(val)) {
    return !!val.length;
  } else {
    return !!val;
  }
}

/**
 * Alias of `has`.
 */

export let is = has;

/**
 * Check the type against our stored internal type of the node. This is handy when a node has
 * been removed yet we still internally know the type and need it to calculate node replacement.
 */

export function isNodeType(type) {
  return t.isType(this.type, type);
}

/**
 * This checks whether or now we're in one of the following positions:
 *
 *   for (KEY in right);
 *   for (KEY;;);
 *
 * This is because these spots allow VariableDeclarations AND normal expressions so we need
 * to tell the path replacement that it's ok to replace this with an expression.
 */

export function canHaveVariableDeclarationOrExpression() {
    return (this.key === "init" || this.key === "left") && this.parentPath.isFor();
 }

export function canSwapBetweenExpressionAndStatement(replacement) {
  if (this.key !== "body" || !this.parentPath.isArrowFunctionExpression()) {
    return false;
  }

  if (this.isExpression()) {
    return t.isBlockStatement(replacement);
  } else if (this.isBlockStatement()) {
    return t.isExpression(replacement);
  }

  return false;
}

/**
 * Check whether the current path references a completion record
 */

export function isCompletionRecord(allowInsideFunction) {
  let path = this;
  let first = true;

  do {
    let container = path.container;

    // we're in a function so can't be a completion record
    if (path.isFunction() && !first) {
      return !!allowInsideFunction;
    }

    first = false;

    // check to see if we're the last item in the container and if we are
    // we're a completion record!
    if (Array.isArray(container) && path.key !== container.length - 1) {
      return false;
    }
  } while ((path = path.parentPath) && !path.isProgram());

  return true;
}

/**
 * Check whether or not the current `key` allows either a single statement or block statement
 * so we can explode it if necessary.
 */

export function isStatementOrBlock() {
  if (this.parentPath.isLabeledStatement() || t.isBlockStatement(this.container)) {
    return false;
  } else {
    return includes(t.STATEMENT_OR_BLOCK_KEYS, this.key);
  }
}
