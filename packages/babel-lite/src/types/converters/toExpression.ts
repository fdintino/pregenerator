import type {
  Function,
  FunctionExpression,
  Class,
  ClassExpression,
  Expression,
  ExpressionStatement,
} from "../types";
import {
  isExpression,
  isFunction,
  isClass,
  isExpressionStatement,
} from "../validators/generated";

type FunctionWithId = Extract<Function, Record<"id", unknown>>;

export default function toExpression(node: FunctionWithId): FunctionExpression;

export default function toExpression(node: Class): ClassExpression;

export default function toExpression(
  node: ExpressionStatement | Expression | Class | FunctionWithId
): Expression {
  if (isExpressionStatement(node)) {
    return node.expression;
  }

  // return unmodified node
  // important for things like ArrowFunctions where
  // type change from ArrowFunction to FunctionExpression
  // produces bugs like -> `()=>a` to `function () a`
  // without generating a BlockStatement for it
  // ref: https://github.com/babel/babili/issues/130
  if (isExpression(node)) {
    return node;
  }

  // convert all classes and functions
  // ClassDeclaration -> ClassExpression
  // FunctionDeclaration, ObjectMethod, ClassMethod -> FunctionExpression
  if (isClass(node)) {
    const newNode = (node as unknown) as ClassExpression;
    newNode.type = "ClassExpression";
    return newNode;
  } else if (isFunction(node)) {
    const newNode = (node as unknown) as FunctionExpression;
    newNode.type = "FunctionExpression";
    return newNode;
  }
}
