import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";

export default function toArray(
  node: K.ExpressionKind,
  i?: number | boolean
): n.ArrayExpression | n.CallExpression {
  if (n.ArrayExpression.check(node)) {
    return node;
  }

  const id = b.identifier;
  const memb = b.memberExpression;

  if (n.Identifier.check(node) && node.name === "arguments") {
    return b.callExpression(
      memb(memb(memb(id("Array"), id("prototype")), id("slice")), id("call")),
      [node]
    );
  }

  const arrayFrom = b.callExpression(memb(id("Array"), id("from")), [node]);

  if (typeof i === "number") {
    return b.callExpression(memb(arrayFrom, id("slice")), [
      b.literal(0),
      b.literal(i),
    ]);
  } else {
    return arrayFrom;
  }
}
