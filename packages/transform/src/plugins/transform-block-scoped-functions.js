import blockScopingPlugin from './transform-block-scoping';

export default ({types: t, traverse}) => {
  const blockScopingVisitor = blockScopingPlugin({types: t}).visitor;

  function statementList(key, path) {
    let hasChanges = false;

    const paths = path.get(key);

    for (const p of paths) {
      const func = p.node;
      if (!p.isFunctionDeclaration()) continue;

      const declar = t.variableDeclaration("let", [
        t.variableDeclarator(func.id, t.toExpression(func)),
      ]);

      // hoist it up above everything else
      declar._blockHoist = 2;

      // todo: name this
      func.id = null;

      p.replaceWith(declar);
      hasChanges = true;
    }

    return hasChanges;
  }

  return {
    visitor: {
      BlockStatement(path, file) {
        const { node, parent } = path;
        if (t.isFunction(parent, { body: node })) {
          return;
        }

        if (statementList("body", path)) {
          const {parentPath} = path;
          traverse(parentPath.node, blockScopingVisitor, parentPath.scope, {file}, parentPath);
        }
      },

      SwitchCase(path, file) {
        if (statementList("consequent", path)) {
          const {parentPath} = path;
          traverse(parentPath.node, blockScopingVisitor, parentPath.scope, {file}, parentPath);
        }
      },
    },
  };
};
