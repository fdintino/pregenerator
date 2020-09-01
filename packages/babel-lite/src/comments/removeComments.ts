import type { Node } from "../types";
import { COMMENT_KEYS } from "../constants";

/**
 * Remove comment properties from a node.
 */
export default function removeComments<T extends Node>(node: T): T {
  COMMENT_KEYS.forEach((key) => {
    node[key] = null;
  });

  return node;
}
