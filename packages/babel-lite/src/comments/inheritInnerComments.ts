import inherit from "../utils/inherit";

export default function inheritInnerComments(child: Node, parent: Node): void {
  inherit("innerComments", child, parent);
}
