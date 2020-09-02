import type {
  JSXText,
  JSXExpressionContainer,
  JSXSpreadChild,
  JSXElement,
  JSXFragment,
  JSXEmptyExpression,
} from "../../types";
import {
  isJSXText,
  isJSXExpressionContainer,
  isJSXEmptyExpression,
} from "../../validators/generated";
import cleanJSXElementLiteralChild from "../../utils/react/cleanJSXElementLiteralChild";

export default function buildChildren(node: {
  children: ReadonlyArray<
    | JSXText
    | JSXExpressionContainer
    | JSXSpreadChild
    | JSXElement
    | JSXFragment
    | JSXEmptyExpression
  >;
}): JSXElement["children"] {
  const elements = [];

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    if (isJSXText(child)) {
      cleanJSXElementLiteralChild(child, elements);
      continue;
    }

    if (isJSXExpressionContainer(child)) {
      if (!isJSXEmptyExpression(child.expression)) {
        elements.push(child.expression);
      }
      continue;
    }

    if (isJSXEmptyExpression(child)) continue;

    elements.push(child);
  }

  return elements;
}
