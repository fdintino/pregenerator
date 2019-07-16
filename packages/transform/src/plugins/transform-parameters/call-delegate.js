export default function transformParametersCallDelegate({types: t}) {
  const visitor = {
    enter(path, state) {
      if (path.isThisExpression()) {
        state.foundThis = true;
      }

      if (path.isReferencedIdentifier() && path.node.name === 'arguments') {
        state.foundArguments = true;
      }
    },

    /* istanbul ignore next */
    Function(path) {
      path.skip();
    },
  };

  return function callDelegate(path, scope) {
    const { node } = path;
    const container = t.functionExpression(
      null,
      [],
      node.body,
      node.generator,
      node.async,
    );

    let callee = container;
    let args = [];

    const state = {
      foundThis: false,
      foundArguments: false,
    };

    path.traverse(visitor, state);

    if (state.foundArguments || state.foundThis) {
      callee = t.memberExpression(container, t.identifier('apply'));
      args = [];

      if (state.foundThis) {
        args.push(t.thisExpression());
      }

      if (state.foundArguments) {
        /* istanbul ignore next */
        if (!state.foundThis) {
          args.push(t.nullLiteral());
        }
        args.push(t.identifier('arguments'));
      }
    }

    let call = t.callExpression(callee, args);
    /* istanbul ignore if */
    if (node.generator) call = t.yieldExpression(call, true);

    return t.returnStatement(call);
  };
};
