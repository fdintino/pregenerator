import type { Node, LVal, Expression, SequenceExpression, UnaryExpression } from "../types";
import gatherSequenceExpressions from "./gatherSequenceExpressions";

/**
 * Turn an array of statement `nodes` into a `SequenceExpression`.
 *
 * Variable declarations are turned into simple assignments and their
 * declarations hoisted to the top of the current scope.
 *
 * Expression statements are just resolved to their expression.
 */
export default function toSequenceExpression(
  nodes: ReadonlyArray<Node>,
  scope: {
    push(value: { id: LVal; kind: "var"; init?: Expression }): void;
    buildUndefinedNode(): UnaryExpression;
  }
): SequenceExpression | undefined {
  if (!nodes?.length) return;

  const declars = [];
  const result = gatherSequenceExpressions(nodes, scope, declars);
  if (!result) return;

  for (const declar of declars) {
    scope.push(declar);
  }

  return result;
}
