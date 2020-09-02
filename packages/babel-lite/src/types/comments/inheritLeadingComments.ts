import type { Node } from "../types";
import inherit from "../utils/inherit";

export default function inheritLeadingComments(
  child: Node,
  parent: Node
): void {
  inherit("leadingComments", child, parent);
}
