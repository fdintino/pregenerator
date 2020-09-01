import type { Node, Identifier } from "../types";
import getBindingIdentifiers from "./getBindingIdentifiers";

export default function getOuterBindingIdentifiers(
  node: Node,
  duplicates: true
): Record<string, Array<Identifier>>;

export default function getOuterBindingIdentifiers(
  node: Node,
  duplicates?: false
): Record<string, Identifier>;

export default function getOuterBindingIdentifiers(
  node: Node,
  duplicates?: boolean
): Record<string, Identifier | Array<Identifier>> {
  return getBindingIdentifiers(node, duplicates, true);
}
