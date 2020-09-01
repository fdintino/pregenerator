import type { Statement, Expression, Function, BlockStatement } from "../types";
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
  parent?: Function | null
): BlockStatement {
  if (isBlockStatement(node)) {
    return node;
  }

  let blockNodes = [];

  if (isEmptyStatement(node)) {
    blockNodes = [];
  } else {
    if (!isStatement(node)) {
      if (isFunction(parent)) {
        node = returnStatement(node);
      } else {
        node = expressionStatement(node);
      }
    }

    blockNodes = [node];
  }

  return blockStatement(blockNodes);
}
