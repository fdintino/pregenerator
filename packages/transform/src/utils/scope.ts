import type { NodePath } from "@pregenerator/ast-types";
import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import { isBindingIdentifier } from "./validation";
import { toIdentifier } from "./identifier";
import { getData } from "./data";
import type { Scope } from "@pregenerator/ast-types";

export type { Scope };

export type BindingKind =
  | "var" /* var declarator */
  | "let" /* let declarator, class declaration id, catch clause parameters */
  | "const" /* const declarator */
  | "module" /* import specifiers */
  | "hoisted" /* function declaration id */
  | "param" /* function declaration parameters */
  | "local" /* function expression id, class expression id */
  | "unknown"; /* export specifiers */

export type ScopeBindings = Record<
  string,
  Array<NodePath<n.Node>> | NodePath<n.Node>
>;

export function getOwnBinding(
  scope: Scope,
  name: string
): NodePath<n.Node> | null {
  const bindings = scope.getBindings() as ScopeBindings;
  if (name in bindings) {
    if (name in bindings && Array.isArray(bindings[name])) {
      const binding = bindings[name] as Array<NodePath<n.Node>>;
      if (binding.length > 0) {
        return binding[0];
      }
    } else {
      return bindings[name] as NodePath<n.Node>;
    }
  }
  return null;
}

export function getBinding(
  scope: Scope,
  name: string
): NodePath<n.Node> | null {
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
  node: n.Node | null | undefined,
  parts: string[]
): void {
  if (!node) {
    return;
  }
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BigIntLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
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
  node: n.Node | null | undefined,
  scope: Scope,
  defaultName?: string
): n.Identifier {
  const parts: string[] = [];
  gatherNodeParts(node, parts);

  let id = toIdentifier(parts.join("$"));
  id = id.replace(/^_/, "").replace(/[0-9]+$/g, "") || defaultName || "ref";

  return scope.declareTemporary(id.slice(0, 20));
}

export function maybeGenerateMemoised(
  node: n.Node,
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

export function isStatic(node: n.Node | null, scope: Scope): boolean {
  if (n.ThisExpression.check(node) || n.Super.check(node)) {
    return true;
  }

  if (n.Identifier.check(node)) {
    // let binding = this.getBinding(node.name);
    if (scope.declares(node.name)) {
      const binding = getBinding(scope, node.name);
      if (binding) {
        return getData<boolean>(binding.node, "constant") || false;
      }
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
  return b.unaryExpression("void", b.numericLiteral(0), true);
}

n.CatchClause;

export function getBindingKind(path: NodePath): BindingKind | null {
  if (!path.parentPath || !path.parent || !path.parentPath.parent) return null;
  const parent = path.parent;
  if (
    path.parentPath.name === "declarations" &&
    parent.check(n.VariableDeclaration)
  ) {
    return parent.node.kind;
  }
  if (path.name === "id" && parent.check(n.FunctionExpression)) {
    return "local";
  }
  if (path.parentPath.name === "params" && path.parent.check(n.Function)) {
    return "param";
  }
  if (path.name === "id" && path.parent.check(n.FunctionDeclaration)) {
    return "hoisted";
  }
  if (path.name === "param" && parent.check(n.CatchClause)) {
    return "let";
  }
  return "unknown";
}
