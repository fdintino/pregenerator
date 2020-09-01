import type { Node, Immutable } from "../types";
import isType from "./isType";
import { isIdentifier } from "./generated";

/**
 * Check if the input `node` is definitely immutable.
 */
export default function isImmutable(node: Node): node is Immutable {
  if (isType(node.type, "Immutable")) return true;

  if (isIdentifier(node)) {
    if (node.name === "undefined") {
      // immutable!
      return true;
    } else {
      // no idea...
      return false;
    }
  }

  return false;
}
