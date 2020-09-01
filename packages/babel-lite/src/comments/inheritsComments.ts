import type { Node } from "../types";

import inheritTrailingComments from "./inheritTrailingComments";
import inheritLeadingComments from "./inheritLeadingComments";
import inheritInnerComments from "./inheritInnerComments";

/**
 * Inherit all unique comments from `parent` node to `child` node.
 */
export default function inheritsComments<T extends Node>(
  child: T,
  parent: Node
): T {
  inheritTrailingComments(child, parent);
  inheritLeadingComments(child, parent);
  inheritInnerComments(child, parent);

  return child;
}
