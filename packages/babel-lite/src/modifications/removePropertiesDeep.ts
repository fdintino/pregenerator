import type { Node } from "../types";
import traverseFast from "../traverse/traverseFast";
import removeProperties from "./removeProperties";

export default function removePropertiesDeep<T extends Node>(
  tree: T,
  opts?: { preserveComments: boolean } | null
): T {
  traverseFast(tree, removeProperties, opts);

  return tree;
}
