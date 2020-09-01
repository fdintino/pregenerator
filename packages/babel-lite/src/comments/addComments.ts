import type { Node, Comment, CommentTypeShorthand } from "../types";

/**
 * Add comments of certain type to a node.
 */
export default function addComments<T extends Node>(
  node: T,
  type: CommentTypeShorthand,
  comments: ReadonlyArray<Comment>
): T {
  if (!comments || !node) return node;

  const key = `${type}Comments`;

  if (node[key]) {
    if (type === "leading") {
      node[key] = comments.concat(node[key]);
    } else {
      node[key] = node[key].concat(comments);
    }
  } else {
    node[key] = comments;
  }

  return node;
}
