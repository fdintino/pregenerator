import type { Node, Placeholder } from "../types";
import shallowEqual from "../utils/shallowEqual";
import isType from "./isType";
import isPlaceholderType from "./isPlaceholderType";
import { FLIPPED_ALIAS_KEYS } from "../definitions";

export default function is<T extends Node["type"]>(
  type: T,
  node: Node | null | undefined,
  opts?: undefined
): node is Extract<Node, { type: T }>;

export default function is<
  T extends Node["type"],
  P extends Extract<Node, { type: T }>
>(type: T, n: Node | null | undefined, opts: Partial<P>): n is P;

export default function is<P extends Node>(
  type: string,
  node: Node | null | undefined,
  opts: Partial<P>
): node is P;

export default function is(
  type: string,
  node: Node | { type: string }| null | undefined,
  opts?: Partial<Node>
): node is Node;

/**
 * Returns whether `node` is of given `type`.
 *
 * For better performance, use this instead of `is[Type]` when `type` is unknown.
 */
export default function is(
  type: Node["type"],
  node: Node | { type: string } | null | undefined,
  opts?: Partial<Node>
): boolean {
  if (!node) return false;

  const matches = isType(node.type, type);
  if (!matches) {
    if (!opts && node.type === "Placeholder" && type in FLIPPED_ALIAS_KEYS) {
      // We can only return true if the placeholder doesn't replace a real node,
      // but it replaces a category of nodes (an alias).
      //
      // t.is("Identifier", node) gives some guarantees about node's shape, so we
      // can't say that Placeholder(expectedNode: "Identifier") is an identifier
      // because it doesn't have the same properties.
      // On the other hand, t.is("Expression", node) doesn't say anything about
      // the shape of node because Expression can be many different nodes: we can,
      // and should, safely report expression placeholders as Expressions.
      return isPlaceholderType((node as Placeholder).expectedNode, type);
    }
    return false;
  }

  if (typeof opts === "undefined") {
    return true;
  } else {
    return shallowEqual(node, opts);
  }
}
