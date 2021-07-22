import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import { isBindingIdentifier } from "./validation";

export type Scope = NodePath["scope"];

export type ScopeBindings = Record<string, Array<NodePath<n.ASTNode>> | NodePath<n.ASTNode>>;

export function getOwnBinding(
  scope: Scope,
  name: string
): NodePath<n.ASTNode> | null {
  const bindings = scope.getBindings() as ScopeBindings;
  if (name in bindings) {
    if (name in bindings && Array.isArray(bindings[name])) {
      const binding = bindings[name] as Array<NodePath<n.ASTNode>>;
      if (binding.length > 0) {
        return binding[0];
      }
    } else {
      return bindings[name] as NodePath<n.ASTNode>;
    }
  }
  return null;
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
): NodePath<n.Identifier> | null {
  const lookupScope = scope.lookup(name);
  if (!lookupScope) {
    return null;
  }
  const binding = getBinding(scope, name);
  if (binding && isBindingIdentifier(binding)) {
    return binding as NodePath<n.Identifier>;
  }
  return null;
}

function gatherNodeParts(
  node: n.ASTNode | null | undefined,
  parts: string[]
): void {
  if (!node) {
    return;
  }
  switch (node.type) {
    case "Literal":
      parts.push(`${node.value}`);
      break;

    case "MemberExpression":
      gatherNodeParts(node.object, parts);
      gatherNodeParts(node.property, parts);
      break;

    case "Identifier":
      parts.push(node.name);
      break;

    case "CallExpression":
    case "NewExpression":
      gatherNodeParts(node.callee, parts);
      break;

    case "ObjectExpression":
    case "ObjectPattern":
      for (const e of node.properties) {
        gatherNodeParts(e, parts);
      }
      break;

    case "SpreadElement":
    case "RestElement":
      gatherNodeParts(node.argument, parts);
      break;

    case "ObjectProperty":
    case "ObjectMethod":
    case "ClassProperty":
    case "ClassMethod":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
      gatherNodeParts(node.key, parts);
      break;

    case "ThisExpression":
      parts.push("this");
      break;

    case "Super":
      parts.push("super");
      break;

    case "Import":
      parts.push("import");
      break;

    case "DoExpression":
      parts.push("do");
      break;

    case "YieldExpression":
      parts.push("yield");
      gatherNodeParts(node.argument, parts);
      break;

    case "AwaitExpression":
      parts.push("await");
      gatherNodeParts(node.argument, parts);
      break;

    case "AssignmentExpression":
      gatherNodeParts(node.left, parts);
      break;

    case "VariableDeclarator":
      gatherNodeParts(node.id, parts);
      break;

    case "FunctionExpression":
    case "FunctionDeclaration":
    case "ClassExpression":
    case "ClassDeclaration":
      gatherNodeParts(node.id, parts);
      break;

    case "PrivateName":
      gatherNodeParts(node.id, parts);
      break;

    case "ParenthesizedExpression":
      gatherNodeParts(node.expression, parts);
      break;

    case "UnaryExpression":
    case "UpdateExpression":
      gatherNodeParts(node.argument, parts);
      break;
  }
}

export function generateUidBasedOnNode(
  node: n.ASTNode | null | undefined,
  scope: Scope,
  defaultName?: string
): n.Identifier {
  const parts: string[] = [];
  gatherNodeParts(node, parts);

  let id = parts.join("$");
  id = id.replace(/^_/, "") || defaultName || "ref";

  return scope.declareTemporary(id.slice(0, 20));
}

export function maybeGenerateMemoised(
  node: n.ASTNode,
  scope: Scope,
  dontPush?: boolean
): null | n.Identifier {
  if (isStatic(node, scope)) {
    return null;
  } else {
    const temp = generateUidBasedOnNode(node, scope);
    if (!dontPush) {
      scope.injectTemporary(temp);
    }
    return temp;
  }
}

export function isStatic(node: n.ASTNode | null, scope: Scope): boolean {
  if (n.ThisExpression.check(node) || n.Super.check(node)) {
    return true;
  }

  if (n.Identifier.check(node)) {
    // let binding = this.getBinding(node.name);
    if (scope.declares(node.name)) {
      // return binding.constant;
      // TODO: determine constancy
      return false;
    } else {
      return !!scope.lookup(node.name);
    }
  }

  return false;
}

export function buildUndefinedNode(): n.UnaryExpression {
  return b.unaryExpression("void", b.literal(0), true);
}
