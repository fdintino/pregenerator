import type { Node, CommentTypeShorthand } from "../types";
import addComments from "./addComments";

/**
 * Add comment of certain type to a node.
 */
export default function addComment<T extends Node>(
  node: T,
  type: CommentTypeShorthand,
  content: string,
  line?: boolean
): T {
  return addComments(node, type, [
    {
      type: line ? "CommentLine" : "CommentBlock",
      value: content,
      loc: null,
    },
  ]);
}
