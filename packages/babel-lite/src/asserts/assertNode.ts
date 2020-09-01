import isNode from "../validators/isNode";

type NodeLikeObject = {
  type: string;
};

function isNodeLikeObject(node: unknown): node is NodeLikeObject {
  return (
    node &&
    typeof node === "object" &&
    Object.prototype.hasOwnProperty.call(node, "type")
  );
}

export default function assertNode(node?: unknown): void {
  if (!isNode(node)) {
    const type: string = isNodeLikeObject(node)
      ? node.type
      : JSON.stringify(node);
    // const type: string =
    //   node && node instanceof Object && typeof node?.type === "string"
    //     ? node.type
    //     : JSON.stringify(node);
    throw new TypeError(`Not a valid node of type "${type}"`);
  }
}
