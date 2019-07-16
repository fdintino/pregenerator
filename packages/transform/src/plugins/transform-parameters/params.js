import _callDelegate from './call-delegate';

export default function transformParametersRest({types: t}) {
  const callDelegate = _callDelegate({types: t});

  function buildDefaultParam({varName, argKey, defaultValue}) {
    return t.variableDeclaration('let', [
      t.variableDeclarator(
        varName,
        t.conditionalExpression(
          t.logicalExpression(
            '&&',
            t.binaryExpression(
              '>',
              t.memberExpression(t.identifier('arguments'), t.identifier('length')),
              argKey),
            t.binaryExpression(
              '!==',
              t.memberExpression(t.identifier('arguments'), argKey, true),
              t.identifier('undefined')
            )),
          t.memberExpression(t.identifier('arguments'), argKey, true),
          defaultValue))
    ]);
  }

  function buildLooseDefaultParam({assignmentId, undef, defaultValue}) {
    return t.ifStatement(
      t.binaryExpression('===', assignmentId, undef),
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression('=', assignmentId, defaultValue))
      ], []));
  }

  function buildLooseDestructuredDefaultParam({assignmentId, paramName, defaultValue, undef}) {
    return t.variableDeclaration('let', [
      t.variableDeclarator(
        assignmentId,
        t.conditionalExpression(
          t.binaryExpression('===', paramName, undef),
          defaultValue,
          paramName))
    ]);
  }

  function buildSafeArgumentsAccess([$0, $1]) {
    return t.variableDeclaration('let', [
      t.variableDeclarator(
        $0,
        t.conditionalExpression(
          t.binaryExpression(
            '>',
            t.memberExpression(t.identifier('arguments'), t.identifier('length')),
            $1
          ),
          t.memberExpression(t.identifier('arguments'), $1, true),
          t.identifier('undefined')
        )
      )
    ]);
  }

  function isSafeBinding(scope, node) {
    if (!scope.hasOwnBinding(node.name)) return true;
    const { kind } = scope.getOwnBinding(node.name);
    return kind === 'param' || kind === 'local';
  }

  const iifeVisitor = {
    ReferencedIdentifier(path, state) {
      const { scope, node } = path;
      if (node.name === 'eval' || !isSafeBinding(scope, node)) {
        state.iife = true;
        path.stop();
      }
    },

    Scope(path) {
      // different bindings
      path.skip();
    },
  };

  return function convertFunctionParams(path) {
    const { node, scope } = path;

    const state = {
      iife: false,
      scope: scope,
    };

    const body = [];
    const params = path.get('params');

    let firstOptionalIndex = null;

    for (let i = 0; i < params.length; i++) {
      const param = params[i];

      const paramIsAssignmentPattern = param.isAssignmentPattern();
      if (paramIsAssignmentPattern && node.kind === 'set') {
        const left = param.get('left');
        const right = param.get('right');

        const undefinedNode = scope.buildUndefinedNode();

        /* istanbul ignore else */
        if (left.isIdentifier()) {
          /* istanbul ignore else */
          if (!state.iife) {
            if (right.isIdentifier() && !isSafeBinding(scope, right.node)) {
              // the right hand side references a parameter
              state.iife = true;
            } else {
              right.traverse(iifeVisitor, state);
            }
          }

          body.push(
            buildLooseDefaultParam({
              assignmentId: t.cloneNode(left.node),
              defaultValue: right.node,
              undef: undefinedNode,
            }),
          );
          param.replaceWith(left.node);
        } else if (left.isObjectPattern() || left.isArrayPattern()) {
          const paramName = scope.generateUidIdentifier();
          body.push(
            buildLooseDestructuredDefaultParam({
              assignmentId: left.node,
              defaultValue: right.node,
              paramName: t.cloneNode(paramName),
              undef: undefinedNode,
            }),
          );
          param.replaceWith(paramName);
        }
      } else if (paramIsAssignmentPattern) {
        if (firstOptionalIndex === null) firstOptionalIndex = i;

        const left = param.get('left');
        const right = param.get('right');

        /* istanbul ignore else */
        if (!state.iife) {
          if (right.isIdentifier() && !isSafeBinding(scope, right.node)) {
            // the right hand side references a parameter
            state.iife = true;
          } else {
            right.traverse(iifeVisitor, state);
          }
        }

        const defNode = buildDefaultParam({
          varName: left.node,
          defaultValue: right.node,
          argKey: t.numericLiteral(i),
        });
        body.push(defNode);
      } else if (firstOptionalIndex !== null) {
        const defNode = buildSafeArgumentsAccess([
          param.node,
          t.numericLiteral(i),
        ]);
        body.push(defNode);
      } else if (param.isObjectPattern() || param.isArrayPattern()) {
        const uid = path.scope.generateUidIdentifier('ref');

        const defNode = t.variableDeclaration('let', [
          t.variableDeclarator(param.node, uid),
        ]);
        body.push(defNode);

        param.replaceWith(t.cloneNode(uid));
      }

      if (!state.iife && !param.isIdentifier()) {
        param.traverse(iifeVisitor, state);
      }
    }

    if (body.length === 0) return false;

    // we need to cut off all trailing parameters
    if (firstOptionalIndex !== null) {
      node.params = node.params.slice(0, firstOptionalIndex);
    }

    // ensure it's a block, useful for arrow functions
    path.ensureBlock();

    if (state.iife) {
      body.push(callDelegate(path, scope));
      path.set('body', t.blockStatement(body));
    } else {
      path.get('body').unshiftContainer('body', body);
    }

    return true;
  };
};
