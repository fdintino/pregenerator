import type { NodePath } from "ast-types/lib/node-path";
import { namedTypes as n } from "ast-types";
import { isBindingIdentifier } from "./validation";

export type Scope = NodePath["scope"];

type ScopeBindings = Record<string, Array<NodePath<n.ASTNode>>>;

export function getOwnBinding(
  scope: Scope,
  name: string
): NodePath<n.ASTNode> | null {
  const bindings = scope.getBindings() as ScopeBindings;
  if (
    name in bindings &&
    Array.isArray(bindings[name]) &&
    bindings[name].length > 0
  ) {
    return bindings[name][0];
  } else {
    return null;
  }
}

export function getBinding(
  scope: Scope,
  name: string
): NodePath<n.ASTNode> | null {
  const lookupScope = scope.lookup(name);
  if (!lookupScope) {
    return null;
  }
  return getOwnBinding(lookupScope, name);
}

export function getBindingIdentifier(
  scope: Scope,
  name: string
): NodePath<n.ASTNode> | null {
  const binding = getBinding(scope, name);
  if (binding && isBindingIdentifier(binding)) {
    return binding;
  } else {
    return null;
  }
}
