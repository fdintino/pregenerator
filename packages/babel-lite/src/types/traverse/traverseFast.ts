import type { Node, FastTraversalHandler } from "../types";
import { VISITOR_KEYS } from "../definitions";

const EmptyObject = {} as const;

/**
 * A prefix AST traversal implementation meant for simple searching
 * and processing.
 */
export default function traverseFast<T>(
  node: Node,
  enter: FastTraversalHandler<T>,
  opts?: T
): void {
  if (!node) return;

  const keys = VISITOR_KEYS[node.type];
  if (!keys) return;

  opts = opts || {} as T;
  enter(node, opts);

  for (const key of keys) {
    const subNode = node[key];

    if (Array.isArray(subNode)) {
      for (const node of subNode) {
        traverseFast(node, enter, opts);
      }
    } else {
      traverseFast(subNode, enter, opts);
    }
  }
}
