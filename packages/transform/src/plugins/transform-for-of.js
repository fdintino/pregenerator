export default function transformForOfPlugin({types: t}) {
  function buildForOfArray({KEY, ARR, BODY}) {
    return t.forStatement(
      t.variableDeclaration('var', [t.variableDeclarator(KEY, t.numericLiteral(0))]),
      t.binaryExpression('<', KEY, t.memberExpression(ARR, t.identifier('length'))),
      t.updateExpression('++', KEY, false),
      (t.isStatement(BODY)) ? BODY : t.expressionStatement(BODY)
    );
  }

  function buildForOfLoose({LOOP_OBJECT, IS_ARRAY, OBJECT, INDEX, ID}) {
    return t.forStatement(
      t.variableDeclaration('var', [
        t.variableDeclarator(LOOP_OBJECT, OBJECT),
        t.variableDeclarator(
          IS_ARRAY,
          t.callExpression(
            t.memberExpression(t.identifier('Array'), t.identifier('isArray')),
            [LOOP_OBJECT])),
        t.variableDeclarator(INDEX, t.numericLiteral(0)),
        t.variableDeclarator(
          LOOP_OBJECT,
          t.conditionalExpression(
            IS_ARRAY,
            LOOP_OBJECT,
            t.callExpression(
              t.memberExpression(
                LOOP_OBJECT,
                t.memberExpression(t.identifier('Symbol'), t.identifier('iterator')),
                true),
              []))),
      ]),
      null,
      null,
      t.blockStatement([
        t.variableDeclaration('var', [t.variableDeclarator(ID, null)]),
        t.ifStatement(
          IS_ARRAY,
          t.blockStatement([
            t.ifStatement(
              t.binaryExpression('>=', INDEX,
                t.memberExpression(LOOP_OBJECT, t.identifier('length'))),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression('=', ID,
                t.memberExpression(
                  LOOP_OBJECT,
                  t.updateExpression('++', INDEX, false),
                  true))),
          ], []),
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression('=', INDEX,
                t.callExpression(
                  t.memberExpression(LOOP_OBJECT, t.identifier('next')),
                  [])
              )),
            t.ifStatement(
              t.memberExpression(INDEX, t.identifier('done')),
              t.breakStatement()),
            t.expressionStatement(
              t.assignmentExpression('=', ID,
                t.memberExpression(INDEX, t.identifier('value'))
              )),
          ], [])),
      ], []));
  }

  function _ForOfStatementArray(path) {
    let { node, scope } = path;
    let nodes = [];
    let right = node.right;

    if (!t.isIdentifier(right) || !scope.hasBinding(right.name)) {
      let uid = scope.generateUidIdentifier('arr');
      nodes.push(t.variableDeclaration('var', [
        t.variableDeclarator(uid, right)
      ]));
      right = uid;
    }

    let iterationKey = scope.generateUidIdentifier('i');

    let loop = buildForOfArray({
      BODY: node.body,
      KEY:  iterationKey,
      ARR:  right
    });

    t.inherits(loop, node);
    t.ensureBlock(loop);

    let iterationValue = t.memberExpression(right, iterationKey, true);

    let left = node.left;
    if (t.isVariableDeclaration(left)) {
      left.declarations[0].init = iterationValue;
      loop.body.body.unshift(left);
    } else {
      loop.body.body.unshift(t.expressionStatement(t.assignmentExpression('=', left, iterationValue)));
    }

    if (path.parentPath.isLabeledStatement()) {
      loop = t.labeledStatement(path.parentPath.node.label, loop);
    }

    nodes.push(loop);

    return nodes;
  }

  return {
    visitor: {
      ForOfStatement(path, state) {
        if (path.get('right').isArrayExpression()) {
          return path.replaceWithMultiple(_ForOfStatementArray.call(this, path, state));
        }

        let { node, scope } = path;

        let left = node.left;
        let declar, id;

        if (t.isIdentifier(left) || t.isPattern(left) || t.isMemberExpression(left)) {
          // for (i of test), for ({ i } of test)
          id = left;
        } else if (t.isVariableDeclaration(left)) {
          // for (let i of test)
          id = scope.generateUidIdentifier('ref');
          declar = t.variableDeclaration(left.kind, [
            t.variableDeclarator(left.declarations[0].id, id)
          ]);
        } else {
          throw new Error(`Unknown node type ${left.type} in ForStatement`);
        }

        let iteratorKey = scope.generateUidIdentifier('iterator');
        let isArrayKey  = scope.generateUidIdentifier('isArray');

        let loop = buildForOfLoose({
          LOOP_OBJECT:  iteratorKey,
          IS_ARRAY:     isArrayKey,
          OBJECT:       node.right,
          INDEX:        scope.generateUidIdentifier('i'),
          ID:           id
        });

        if (!declar) {
          // no declaration so we need to remove the variable declaration at the top of
          // the for-of-loose template
          loop.body.body.shift();
        }

        let block  = loop.body;

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

        path.replaceWithMultiple(loop);
      }
    }
  };
}
