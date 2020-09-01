import type {
  AssignmentExpression,
  ExpressionStatement,
  Statement,
  Class,
  ClassDeclaration,
  Function,
  FunctionDeclaration,
} from "../types";
import {
  isStatement,
  isFunction,
  isClass,
  isAssignmentExpression,
} from "../validators/generated";
import { expressionStatement } from "../builders/generated";
import has from "../utils/has";

export default function toStatement(
  node: AssignmentExpression,
  ignore?: boolean
): ExpressionStatement;

export default function toStatement(
  node: Statement | AssignmentExpression,
  ignore?: boolean
): Statement;

export default function toStatement(
  node: Class,
  ignore: true
): ClassDeclaration | undefined;

export default function toStatement(
  node: Class,
  ignore?: boolean
): ClassDeclaration;

export default function toStatement(
  node: Function,
  ignore: true
): FunctionDeclaration | undefined;

export default function toStatement(
  node: Function,
  ignore?: boolean
): FunctionDeclaration;

export default function toStatement(
  node: Statement | Class | Function | AssignmentExpression,
  ignore: true
): Statement | undefined;

export default function toStatement(
  node: Statement | Class | Function | AssignmentExpression,
  ignore?: boolean
): Statement;

export default function toStatement(
  node: Statement | Class | Function | AssignmentExpression,
  ignore?: boolean
): Statement | undefined {
  if (isStatement(node)) {
    return node;
  }

  let mustHaveId = false;
  let newType;

  if (isClass(node)) {
    mustHaveId = true;
    newType = "ClassDeclaration";
  } else if (isFunction(node)) {
    mustHaveId = true;
    newType = "FunctionDeclaration";
  } else if (isAssignmentExpression(node)) {
    return expressionStatement(node);
  }

  if (mustHaveId && !(has(node, "id") && node.id)) {
    newType = false;
  }

  if (!newType) {
    if (ignore) {
      return;
    } else {
      throw new Error(`cannot turn ${node.type} to a statement`);
    }
  }

  node.type = newType;

  return node;
}
