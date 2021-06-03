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
