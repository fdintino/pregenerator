import clone from './clone';

/**
 * Create a shallow clone of a `node` excluding `_private` and location properties.
 */
export default function cloneWithoutLoc(node) {
  const newNode = clone(node);
  newNode.loc = null;

  return newNode;
}
