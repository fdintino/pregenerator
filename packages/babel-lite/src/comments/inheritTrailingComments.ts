import type { Node } from "../types";
import inherit from "../utils/inherit";

export default function inheritTrailingComments(
  child: Node,
  parent: Node
): void {
  inherit("trailingComments", child, parent);
}
