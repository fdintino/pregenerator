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
import { namedTypes as n, eachField, ASTNode } from "@pregenerator/ast-types";

const mMap = new WeakMap();

type ContainsLeapMeta = {
  containsLeap?: boolean;
};

export function containsLeap(node: ASTNode): boolean {
  // n.Node.assert(node);
  n.assertNode(node);
  const { type } = node;

  let meta: ContainsLeapMeta;

  if (mMap.has(node)) {
    meta = mMap.get(node);
  } else {
    meta = {};
    mMap.set(node, meta);
  }

  if ("containsLeap" in meta) {
    return !!meta.containsLeap;
  }

  // Certain types are "opaque," which means they have no side
  // effects or leaps and we don't care about their subexpressions.
  if (type === "FunctionExpression") {
    return (meta.containsLeap = false);
  }

  if (
    type === "YieldExpression" ||
    type === "BreakStatement" ||
    type === "ContinueStatement" ||
    type === "ReturnStatement" ||
    type === "ThrowStatement"
  ) {
    return (meta.containsLeap = true);
  }

  return (meta.containsLeap = containsLeapingChildren(node));
}

export function containsLeapingChildren(node: ASTNode): boolean {
  // n.Node.assert(node);
  n.assertNode(node);

  // Assume no side effects until we find out otherwise.
  let result = false;

  function check(child: any): boolean {
    if (result) {
      // Do nothing.
    } else if (Array.isArray(child)) {
      child.some(check);
    } else if (n.Node.check(child)) {
      assert.strictEqual(result, false);
      result = containsLeap(child);
    }
    return result;
  }

  eachField(node, (name, child) => check(child));

  return result;
}
