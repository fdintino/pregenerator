export default function transformForOfPlugin({types: t}) {
  const memb = t.memberExpression;
  const ident = t.identifier;

  function buildForOfLoose({loopObj, obj, isArr, index, intermediate, id}) {
    return t.forStatement(
      t.variableDeclaration('var', [
        t.variableDeclarator(loopObj, obj),
        t.variableDeclarator(
          isArr,
          t.callExpression(memb(ident('Array'), ident('isArray')), [loopObj])),
        t.variableDeclarator(index, t.numericLiteral(0)),
        t.variableDeclarator(
          loopObj,
          t.conditionalExpression(
            isArr,
            loopObj,
            t.callExpression(
              memb(loopObj, memb(ident('Symbol'), ident('iterator')), true),
              [])))
      ]),
      null,
      null,
      t.blockStatement([
        ...(intermediate ? [intermediate] : []),
        t.ifStatement(
          isArr,
          t.blockStatement([
            t.ifStatement(
              t.binaryExpression('>=', index, memb(loopObj, ident('length'))),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                id,
                memb(
                  loopObj,
                  t.updateExpression('++', index, false),
                  true))
            )
          ], []),
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                index,
                t.callExpression(
                  memb(loopObj, ident('next')), []))
            ),
            t.ifStatement(
              memb(index, ident('done')),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression('=', id, memb(index, ident('value')))
            )
          ], []))
      ], []));
  }

  function pushComputedPropsLoose(path, file) {
    const { node, scope, parent } = path;
    const { left } = node;
    let declar, id, intermediate;

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
      throw file.buildCodeFrameError(
        left,
        `Unknown node type ${left.type} in ForStatement`,
      );
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
