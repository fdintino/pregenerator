import { namedTypes as n } from "@pregenerator/ast-types";

export function isConditional(node: n.ASTNode): boolean {
  return n.ConditionalExpression.check(node) || n.IfStatement.check(node);
}
