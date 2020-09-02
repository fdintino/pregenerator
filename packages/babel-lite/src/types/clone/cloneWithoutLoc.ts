import cloneNode from "./cloneNode";
import type { Node } from "../types";
/**
 * Create a shallow clone of a `node` excluding `_private` and location properties.
 */
export default function cloneWithoutLoc<T extends Node>(node: T): T {
  return cloneNode(node, /* deep */ false, /* withoutLoc */ true);
}
