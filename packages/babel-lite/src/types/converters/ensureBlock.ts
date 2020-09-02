import type { Node, BlockStatement, Statement, Expression } from "../types";
import toBlock from "./toBlock";

/**
 * Ensure the `key` (defaults to "body") of a `node` is a block.
 * Casting it to a block if it is not.
 *
 * Returns the BlockStatement
 */
export default function ensureBlock(
  node: Extract<Node, { body: Statement | Expression }>
): BlockStatement {
  const blockNode = toBlock(node.body, node);
  node.body = blockNode;
  return blockNode;
}
