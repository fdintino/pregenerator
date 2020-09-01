import type { Node, BlockStatement, Statement, Expression } from "../types";
import toBlock from "./toBlock";

export default function ensureBlock(
  node: Extract<Node, { body: BlockStatement | Statement | Expression }>
): BlockStatement;

export default function ensureBlock<
  K extends keyof Extract<
    Node,
    { body: BlockStatement | Statement | Expression }
  > = "body"
>(
  node: Extract<Node, Record<K, BlockStatement | Statement | Expression>>,
  key: K
): BlockStatement;

/**
 * Ensure the `key` (defaults to "body") of a `node` is a block.
 * Casting it to a block if it is not.
 *
 * Returns the BlockStatement
 */
export default function ensureBlock<
  K extends keyof Extract<
    Node,
    { body: BlockStatement | Statement | Expression }
  > = "body"
>(
  node: Extract<Node, Record<K, BlockStatement | Statement | Expression>>,
  key: K
): BlockStatement {
  return (node[key] = toBlock(node[key], node));
}
