import { namedTypes as n } from "@pregenerator/ast-types";
import type { Scope } from "./scope";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";

type Pureish =
  | n.FunctionDeclaration
  | n.FunctionExpression
  | n.ArrowFunctionExpression
  | K.LiteralKind;
  // | (n.Placeholder & {
  //     expectedNode: K.LiteralKind & {
  //       value: string;
  //     };
  //   });

function isPureish(node: unknown): node is Pureish {
  if (!node) return false;

  return (
    n.FunctionDeclaration.check(node) ||
    n.FunctionExpression.check(node) ||
    n.ArrowFunctionExpression.check(node) ||
    n.Literal.check(node)); // ||
    // (n.Placeholder.check(node) &&
    //   n.Literal.check(node.expectedNode) &&
    //   typeof node.expectedNode.value === "string")
}

function matchesPattern(
  member: n.ASTNode | null | undefined,
  match: string | string[],
  allowPartial?: boolean
): boolean {
  // not a member expression
  if (!n.MemberExpression.check(member)) return false;

  const parts = Array.isArray(match) ? match : match.split(".");
  const nodes: n.ASTNode[] = [];

  let node: n.ASTNode;
  for (node = member; n.MemberExpression.check(node); node = node.object) {
    nodes.push(node.property);
  }
  nodes.push(node);

  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;

  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;
    if (n.Identifier.check(node)) {
      value = node.name;
    } else if (n.Literal.check(node) && typeof node.value === "string") {
      value = node.value;
    } else if (n.ThisExpression.check(node)) {
      value = "this";
    } else {
      return false;
    }

    if (parts[i] !== value) return false;
  }

  return true;
}

export default function isPure(
  node: n.ASTNode | null,
  scope: Scope,
  constantsOnly?: boolean
): boolean {
  if (n.Identifier.check(node)) {
    const binding = scope.lookup(node.name);
    if (!binding || constantsOnly) return false;
    return true;
  } else if (n.ClassExpression.check(node) || n.ClassDeclaration.check(node)) {
    if (node.superClass && !isPure(node.superClass, scope, constantsOnly)) {
      return false;
    }
    return isPure(node.body, scope, constantsOnly);
  } else if (n.ClassBody.check(node)) {
    for (const method of node.body) {
      if (!isPure(method, scope, constantsOnly)) return false;
    }
    return true;
  } else if (
    n.BinaryExpression.check(node) ||
    n.LogicalExpression.check(node)
  ) {
    return (
      isPure(node.left, scope, constantsOnly) &&
      isPure(node.right, scope, constantsOnly)
    );
  } else if (n.ArrayExpression.check(node)) {
    for (const elem of node.elements) {
      if (!isPure(elem, scope, constantsOnly)) return false;
    }
    return true;
  } else if (n.ObjectExpression.check(node)) {
    for (const prop of node.properties) {
      if (!isPure(prop, scope, constantsOnly)) return false;
    }
    return true;
  } else if (n.ObjectMethod.check(node) || n.ClassMethod.check(node)) {
    if (node.computed && !isPure(node.key, scope, constantsOnly)) return false;
    if (node.kind === "get" || node.kind === "set") return false;
    return true;
  } else if (n.Property.check(node)) {
    if (node.computed && !isPure(node.key, scope, constantsOnly)) return false;
    return isPure(node.value, scope, constantsOnly);
  } else if (n.UnaryExpression.check(node)) {
    return isPure(node.argument, scope, constantsOnly);
  } else if (n.TaggedTemplateExpression.check(node)) {
    return (
      matchesPattern(node.tag, "String.raw") &&
      !scope.lookup("String") &&
      isPure(node.quasi, scope, constantsOnly)
    );
  } else if (n.TemplateLiteral.check(node)) {
    for (const expression of node.expressions) {
      if (!isPure(expression, scope, constantsOnly)) return false;
    }
    return true;
  } else {
    return isPureish(node);
  }
}
