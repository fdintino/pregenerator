import type { Node, Expression, Identifier } from "../types";
import { isIdentifier } from "../validators/generated";
import { stringLiteral } from "../builders/generated";

export default function toComputedKey<
  T extends Extract<Node, { computed: boolean | null }>
>(node: T, key?: Expression | Identifier): Expression {
  if (!node.computed && isIdentifier(key)) key = stringLiteral(key.name);

  return key;
}
