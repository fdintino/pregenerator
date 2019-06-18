import cloneNode from './cloneNode';

/**
 * Create a shallow clone of a `node`, including only
 * properties belonging to the node.
 * @deprecated Use t.cloneNode instead.
 */
export default function clone(node) {
  return cloneNode(node, /* deep */ false);
}
