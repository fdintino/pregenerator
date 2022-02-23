import {
  NodePath,
  namedTypes as n,
  builders as t,
  visit,
} from "@pregenerator/ast-types";
import type { Visitor } from "@pregenerator/ast-types";
import { isReferencedIdentifier } from "../../utils/validation";

type CallDelegateVisitorState = {
  foundThis: boolean;
  foundArguments: boolean;
};

const visitor: Visitor<CallDelegateVisitorState> = {
  visitNode(path, state) {
    if (n.ThisExpression.check(path.node)) {
      state.foundThis = true;
    }
    if (isReferencedIdentifier(path) && path.node.name === "arguments") {
      state.foundArguments = true;
    }
    if (n.Function.check(path.node)) {
      return false;
    }
    this.traverse(path);
  },
};

export default function callDelegate(
  path: NodePath<n.Function, n.Function>
): n.ReturnStatement {
  const { node } = path;
  n.assertBlockStatement(node.body);
  const container = t.functionExpression(
    null,
    [],
    node.body,
    node.generator,
    node.async
  );

  let callee: n.Expression = container;
  let args: n.Expression[] = [];

  const state = {
    foundThis: false,
    foundArguments: false,
  };

  for (const child of path.iterChildren()) {
    visit(child, visitor, state);
  }

  if (state.foundArguments || state.foundThis) {
    callee = t.memberExpression(container, t.identifier("apply"));
    args = [];

    if (state.foundThis) {
      args.push(t.thisExpression());
    }

    if (state.foundArguments) {
      /* istanbul ignore next */
      if (!state.foundThis) {
        args.push(t.nullLiteral());
      }
      args.push(t.identifier("arguments"));
    }
  }

  let call: n.Expression = t.callExpression(callee, args);
  /* istanbul ignore if */
  if (node.generator) call = t.yieldExpression(call, true);

  return t.returnStatement(call);
}
