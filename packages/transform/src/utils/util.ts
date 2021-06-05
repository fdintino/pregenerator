/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import { namedTypes as n } from "@pregenerator/ast-types";

export function findParent(
  path: NodePath,
  condition: (pp: NodePath) => boolean
): NodePath | null {
  let pp = path.parent;
  while (pp && !condition(pp)) {
    pp = pp.parent;
  }
  return pp;
}

export type KeysOfUnion<T> = T extends T ? keyof T : never;

export function nodeHasProp<
  T extends n.ASTNode,
  P extends KeysOfUnion<n.ASTNode>
>(obj: T, prop: P): obj is T & Record<P, any> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function assertNodeHasProp<
  T extends n.ASTNode,
  P extends KeysOfUnion<n.ASTNode>
>(obj: T, prop: P): asserts obj is T & Record<P, any> {
  if (!nodeHasProp(obj, prop)) {
    throw new Error(`${obj.type} does not have property ${prop}`);
  }
}
