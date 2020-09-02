import type { Node, CommentPropertyKeys } from "../types";

export default function inherit(
  key: CommentPropertyKeys,
  child: Node,
  parent: Node
): void {
  if (child && parent) {
    child[key] = Array.from(
      new Set([].concat(child[key], parent[key]).filter(Boolean))
    );
  }
}
