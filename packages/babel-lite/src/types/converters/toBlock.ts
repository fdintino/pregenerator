import type { Statement, Expression, BlockStatement, Node } from "../types";
import {
  isBlockStatement,
  isFunction,
  isEmptyStatement,
  isStatement,
} from "../validators/generated";
import {
  returnStatement,
  expressionStatement,
  blockStatement,
} from "../builders/generated";

export default function toBlock(
  node: Statement | Expression,
  parent?: Node | null
): BlockStatement {
  if (isBlockStatement(node)) {
    return node;
  }

  let blockNodes: Array<Statement> = [];

  if (isEmptyStatement(node)) {
    blockNodes = [];
  } else if (isStatement(node)) {
    blockNodes = [node];
  } else if (isFunction(parent)) {
    blockNodes = [returnStatement(node)];
  } else {
    blockNodes = [expressionStatement(node)];
  }

  return blockStatement(blockNodes);
}
