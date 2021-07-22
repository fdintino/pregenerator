import { namedTypes as n, builders as b } from "@pregenerator/ast-types";

export default function addHelper(name: string): n.MemberExpression {
  return b.memberExpression(
    b.identifier("pregeneratorHelpers"),
    b.identifier(name)
  );
}
