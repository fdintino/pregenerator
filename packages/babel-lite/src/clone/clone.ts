import cloneNode from "./cloneNode";
import type { Node } from "../types";

/**
 * Create a shallow clone of a `node`, including only
 * properties belonging to the node.
 * @deprecated Use t.cloneNode instead.
 */
export default function clone<T extends Node>(node: T): T {
  return cloneNode(node, /* deep */ false);
}
