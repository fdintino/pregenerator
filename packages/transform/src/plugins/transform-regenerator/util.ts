/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";

export function runtimeProperty(name: string): n.MemberExpression {
  return b.memberExpression(
    b.identifier("regeneratorRuntime"),
    b.identifier(name),
    false
  );
}

// Inspired by the isReference function from ast-util:
// https://github.com/eventualbuddha/ast-util/blob/9bf91c5ce8/lib/index.js#L466-L506
export function isReference(path: NodePath, name?: string | null): boolean {
  const node = path.value;

  if (!n.Identifier.check(node)) {
    return false;
  }

  if (name && node.name !== name) {
    return false;
  }
  if (!path.parent) {
    return false;
  }
  const parent = path.parent.value;

  switch (parent.type) {
    case "VariableDeclarator":
      return path.name === "init";

    case "MemberExpression":
      return (
        path.name === "object" || (parent.computed && path.name === "property")
      );

    case "FunctionExpression":
    case "FunctionDeclaration":
    case "ArrowFunctionExpression":
      if (path.name === "id") {
        return false;
      }

      if (
        path.parentPath &&
        path.parentPath.name === "params" &&
        (typeof path.name === "string" || typeof path.name === "number") &&
        parent.params === path.parentPath.value &&
        (parent.params as any)[path.name] === node
      ) {
        return false;
      }

      return true;

    case "ClassDeclaration":
    case "ClassExpression":
      return path.name !== "id";

    case "CatchClause":
      return path.name !== "param";

    case "Property":
    case "ObjectProperty":
    case "ObjectMethod":
    case "MethodDefinition":
      return path.name !== "key";

    case "ImportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "LabeledStatement":
      return false;

    default:
      return true;
  }
}

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
