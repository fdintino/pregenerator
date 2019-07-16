export default function transformForOfPlugin({types: t}) {
  const memb = t.memberExpression;
  const ident = t.identifier;
  const c = t.cloneNode;

  function buildForOfLoose({loopObj, obj, isArr, index, intermediate, id}) {
    return t.forStatement(
      t.variableDeclaration('var', [
        t.variableDeclarator(c(loopObj), c(obj)),
        t.variableDeclarator(
          c(isArr),
          t.callExpression(memb(ident('Array'), ident('isArray')), [c(loopObj)])),
        t.variableDeclarator(c(index), t.numericLiteral(0)),
        t.variableDeclarator(
          c(loopObj),
          t.conditionalExpression(
            c(isArr),
            c(loopObj),
            t.callExpression(
              memb(c(loopObj), memb(ident('Symbol'), ident('iterator')), true),
              [])))
      ]),
      null,
      null,
      t.blockStatement([
        ...(intermediate ? [c(intermediate)] : []),
        t.ifStatement(
          isArr,
          t.blockStatement([
            t.ifStatement(
              t.binaryExpression('>=', c(index), memb(c(loopObj), ident('length'))),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                c(id),
                memb(
                  c(loopObj),
                  t.updateExpression('++', c(index), false),
                  true))
            )
          ], []),
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                c(index),
                t.callExpression(
                  memb(c(loopObj), ident('next')), []))
            ),
            t.ifStatement(
              memb(c(index), ident('done')),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression('=', c(id), memb(c(index), ident('value')))
            )
          ], []))
      ], []));
  }

  function pushComputedPropsLoose(path, file) {
    const { node, scope, parent } = path;
    const { left } = node;
    let declar, id, intermediate;

    /* istanbul ignore else */
    // TODO: Do we care about raising the exception in the else clause?
    // It's only possible if the AST is malformed.
    if (
      t.isIdentifier(left) ||
      t.isPattern(left) ||
      t.isMemberExpression(left)
    ) {
      // for (i of test), for ({ i } of test)
      id = left;
      intermediate = null;
    } else if (t.isVariableDeclaration(left)) {
      // for (let i of test)
      id = scope.generateUidIdentifier("ref");
      declar = t.variableDeclaration(left.kind, [
        t.variableDeclarator(left.declarations[0].id, t.identifier(id.name)),
      ]);
      intermediate = t.variableDeclaration("var", [
        t.variableDeclarator(t.identifier(id.name)),
      ]);
    } else {
      throw new Error(`Unknown node type ${left.type} in ForStatement`);
    }

    const iteratorKey = scope.generateUidIdentifier("iterator");
    const isArrayKey = scope.generateUidIdentifier("isArray");

    const loop = buildForOfLoose({
      loopObj: iteratorKey,
      isArr: isArrayKey,
      obj: node.right,
      index: scope.generateUidIdentifier("i"),
      id: id,
      intermediate: intermediate,
    });

    const isLabeledParent = t.isLabeledStatement(parent);
    let labeled;

    if (isLabeledParent) {
      labeled = t.labeledStatement(parent.label, loop);
    }

    return {
      replaceParent: isLabeledParent,
      declar: declar,
      node: labeled || loop,
      loop: loop,
    };
  }


  return {
    name: "transform-for-of",
    visitor: {
      ForOfStatement(path, state) {
        const { node } = path;
        const build = pushComputedPropsLoose(path, state);
        const declar = build.declar;
        const loop = build.loop;
        const block = loop.body;

        // ensure that it's a block so we can take all its statements
        path.ensureBlock();

        // add the value declaration to the new loop body
        if (declar) {
          block.body.push(declar);
        }

        // push the rest of the original loop body onto our new body
        block.body = block.body.concat(node.body.body);

        t.inherits(loop, node);
        t.inherits(loop.body, node.body);

        if (build.replaceParent) {
          path.parentPath.replaceWithMultiple(build.node);
          path.remove();
        } else {
          path.replaceWithMultiple(build.node);
        }
      },
    },
  };
}
