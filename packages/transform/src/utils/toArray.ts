import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import addHelper from "../utils/addHelper";

export default function toArray(
  node: n.Expression,
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

  const arrayFrom = b.callExpression(addHelper("arrayFrom"), [node]);

  if (typeof i === "number") {
    return b.callExpression(memb(arrayFrom, id("slice")), [
      b.numericLiteral(0),
      b.numericLiteral(i),
    ]);
  } else {
    return arrayFrom;
  }
}
