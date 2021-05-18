import { namedTypes as n } from "ast-types";

export function isConditional(node: n.ASTNode): boolean {
  return n.ConditionalExpression.check(node) || n.IfStatement.check(node);
}
