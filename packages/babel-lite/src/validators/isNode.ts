import type { Node } from "../types";
import { VISITOR_KEYS } from "../definitions";

function has<K extends PropertyKey>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export default function isNode(node?: unknown): node is Node {
  if (!node || typeof node !== "object") {
    return false;
  }
  if (has(node, "type") && typeof node.type === "string") {
    // if (node && typeof node === "object" && typeof node.type === "string") {
    return !!VISITOR_KEYS[node.type];
  } else {
    return false;
  }
}
