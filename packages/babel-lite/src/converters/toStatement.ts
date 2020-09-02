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
  isClassDeclaration,
  isClassExpression,
  isFunctionDeclaration,
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
  if (isAssignmentExpression(node)) {
    return expressionStatement(node);
  }

  if (isClass(node) && has(node, "id") && node.id) {
    if (isClassDeclaration(node)) {
      return node;
    } else if (isClassExpression(node)) {
      const newNode = (node as unknown) as ClassDeclaration;
      Object.assign(newNode, {
        type: "ClassDeclaration",
        declare: false,
        abstract: false,
      });
      return newNode;
    }
  } else if (isFunction(node) && has(node, "id")) {
    if (isFunctionDeclaration(node)) {
      return node;
    } else {
      const newNode = (node as unknown) as FunctionDeclaration;
      newNode.type = "FunctionDeclaration";
      newNode.declare = false;
      return newNode;
    }
  }

  if (!ignore) {
    throw new Error(`cannot turn ${node.type} to a statement`);
  }
}
