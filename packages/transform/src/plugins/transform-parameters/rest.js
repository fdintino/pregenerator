/* eslint-disable no-shadow */
export default function transformParametersRest({types: t}) {
  function buildRest({len, arr, arrKey, arrLen, key, start, args}) {
    return t.forStatement(
      t.variableDeclaration('var', [
        t.variableDeclarator(len, t.memberExpression(args, t.identifier('length'))),
        t.variableDeclarator(
          arr,
          t.newExpression(t.identifier('Array'), [arrLen])
        ),
        t.variableDeclarator(key, start)
      ]),
      t.binaryExpression('<', key, len),
      t.updateExpression('++', key, false),
      t.blockStatement(
        [
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(arr, arrKey, true),
              t.memberExpression(args, key, true)
            )
          )
        ],
        []));
  }

  function restIndex({index, offset, args}) {
    return t.expressionStatement(
      t.conditionalExpression(
        t.logicalExpression(
          '||',
          t.binaryExpression('<', index, offset),
          t.binaryExpression(
            '<=',
            t.memberExpression(args, t.identifier('length')),
            index)),
        t.identifier('undefined'),
        t.memberExpression(args, index, true)
      )
    );
  }

  function restLength({args, offset}) {
    return t.expressionStatement(
      t.conditionalExpression(
        t.binaryExpression(
          '<=',
          t.memberExpression(args, t.identifier('length')),
          offset),
        t.numericLiteral(0),
        t.binaryExpression(
          '-',
          t.memberExpression(args, t.identifier('length')),
          offset)));
  }

  function referencesRest(path, state) {
    if (path.node.name === state.name) {
      // Check rest parameter is not shadowed by a binding in another scope.
      return path.scope.bindingIdentifierEquals(state.name, state.outerBinding);
    }

    return false;
  }

  const memberExpressionOptimisationVisitor = {
    Scope(path, state) {
      // check if this scope has a local binding that will shadow the rest parameter
      if (!path.scope.bindingIdentifierEquals(state.name, state.outerBinding)) {
        path.skip();
      }
    },

    Function(path, state) {
      // Detect whether any reference to rest is contained in nested functions to
      // determine if deopt is necessary.
      const oldNoOptimise = state.noOptimise;
      state.noOptimise = true;
      path.traverse(memberExpressionOptimisationVisitor, state);
      state.noOptimise = oldNoOptimise;

      // Skip because optimizing references to rest would refer to the `arguments`
      // of the nested function.
      path.skip();
    },

    ReferencedIdentifier(path, state) {
      const { node } = path;

      // we can't guarantee the purity of arguments
      if (node.name === "arguments") {
        state.deopted = true;
      }

      // is this a referenced identifier and is it referencing the rest parameter?
      if (!referencesRest(path, state)) return;

      if (state.noOptimise) {
        state.deopted = true;
      } else {
        const { parentPath } = path;

        // Is this identifier the right hand side of a default parameter?
        if (parentPath.listKey === "params" && parentPath.key < state.offset) {
          return;
        }

        // ex: `args[0]`
        // ex: `args.whatever`
        if (parentPath.isMemberExpression({ object: node })) {
          const grandparentPath = parentPath.parentPath;

          const argsOptEligible =
            !state.deopted &&
            !( // ex: `args[0] = "whatever"`
              (grandparentPath.isAssignmentExpression() &&
                parentPath.node === grandparentPath.node.left) ||
              // ex: `[args[0]] = ["whatever"]`
              grandparentPath.isLVal() ||
              // ex: `for (rest[0] in this)`
              // ex: `for (rest[0] of this)`
              grandparentPath.isForXStatement() ||
              // ex: `++args[0]`
              // ex: `args[0]--`
              grandparentPath.isUpdateExpression() ||
              // ex: `delete args[0]`
              grandparentPath.isUnaryExpression({ operator: "delete" }) ||
              // ex: `args[0]()`
              // ex: `new args[0]()`
              // ex: `new args[0]`
              ((grandparentPath.isCallExpression() ||
                grandparentPath.isNewExpression()) &&
                parentPath.node === grandparentPath.node.callee)
            );

          if (argsOptEligible) {
            if (parentPath.node.computed) {
              // if we know that this member expression is referencing a number then
              // we can safely optimise it
              if (parentPath.get("property").isNumericLiteral()) {
                state.candidates.push({ cause: "indexGetter", path });
                return;
              }
            } else if (parentPath.node.property.name === "length") {
              // args.length
              state.candidates.push({ cause: "lengthGetter", path });
              return;
            }
          }
        }

        // we can only do these optimizations if the rest variable would match
        // the arguments exactly
        // optimise single spread args in calls
        // ex: fn(...args)
        if (state.offset === 0 && parentPath.isSpreadElement()) {
          const call = parentPath.parentPath;
          if (call.isCallExpression() && call.node.arguments.length === 1) {
            state.candidates.push({ cause: "argSpread", path });
            return;
          }
        }

        state.references.push(path);
      }
    },

    /**
     * Deopt on use of a binding identifier with the same name as our rest param.
     *
     * See https://github.com/babel/babel/issues/2091
     */

    BindingIdentifier(path, state) {
      if (referencesRest(path, state)) {
        state.deopted = true;
      }
    },
  };
  function hasRest(node) {
    const length = node.params.length;
    return length > 0 && t.isRestElement(node.params[length - 1]);
  }

  function optimiseIndexGetter(path, argsId, offset) {
    const parentPath = path.parentPath;
    parentPath.replaceWith(
      restIndex({
        args: argsId,
        offset: t.numericLiteral(offset),
        index: t.numericLiteral(path.parent.property.value + offset),
      }),
    );

    // See if we can statically evaluate the first test (i.e. index < offset)
    // and optimize the AST accordingly.
    const offsetTestPath = parentPath.get("test").get("left");
    const valRes = offsetTestPath.evaluate();
    /* istanbul ignore else */
    if (valRes.confident) {
      /* istanbul ignore if */
      if (valRes.value === true) {
        parentPath.replaceWith(parentPath.scope.buildUndefinedNode());
      } else {
        parentPath.get("test").replaceWith(parentPath.get("test").get("right"));
      }
    }
  }

  function optimiseLengthGetter(path, argsId, offset) {
    if (offset) {
      path.parentPath.replaceWith(
        restLength({
          args: argsId,
          offset: t.numericLiteral(offset),
        }),
      );
    } else {
      path.replaceWith(argsId);
    }
  }

  return function convertFunctionRest(path) {
    const { node, scope } = path;

    if (!hasRest(node)) return false;

    let rest = node.params.pop().argument;

    const argsId = t.identifier("arguments");

    if (t.isPattern(rest)) {
      const pattern = rest;
      rest = scope.generateUidIdentifier("ref");

      const declar = t.variableDeclaration("let", [
        t.variableDeclarator(pattern, rest),
      ]);
      node.body.body.unshift(declar);
    }

    // check and optimise for extremely common cases
    const state = {
      references: [],
      offset: node.params.length,

      argumentsNode: argsId,
      outerBinding: scope.getBindingIdentifier(rest.name),

      // candidate member expressions we could optimise if there are no other references
      candidates: [],

      // local rest binding name
      name: rest.name,

      /*
      It may be possible to optimize the output code in certain ways, such as
      not generating code to initialize an array (perhaps substituting direct
      references to arguments[i] or arguments.length for reads of the
      corresponding rest parameter property) or positioning the initialization
      code so that it may not have to execute depending on runtime conditions.

      This property tracks eligibility for optimization. 'deopted' means give up
      and don't perform optimization. For example, when any of rest's elements /
      properties is assigned to at the top level, or referenced at all in a
      nested function.
      */
      deopted: false,
    };

    path.traverse(memberExpressionOptimisationVisitor, state);

    // There are only 'shorthand' references
    if (!state.deopted && !state.references.length) {
      for (const { path, cause } of state.candidates) {
        const clonedArgsId = t.cloneNode(argsId);
        switch (cause) {
          case "indexGetter":
            optimiseIndexGetter(path, clonedArgsId, state.offset);
            break;
          case "lengthGetter":
            optimiseLengthGetter(path, clonedArgsId, state.offset);
            break;
          default:
            path.replaceWith(clonedArgsId);
        }
      }
      return true;
    }

    state.references = state.references.concat(
      state.candidates.map(({ path }) => path),
    );

    const start = t.numericLiteral(node.params.length);
    const key = scope.generateUidIdentifier("key");
    const len = scope.generateUidIdentifier("len");

    let arrKey, arrLen;
    if (node.params.length) {
      // this method has additional params, so we need to subtract
      // the index of the current argument position from the
      // position in the array that we want to populate
      arrKey = t.binaryExpression("-", t.cloneNode(key), t.cloneNode(start));

      // we need to work out the size of the array that we're
      // going to store all the rest parameters
      //
      // we need to add a check to avoid constructing the array
      // with <0 if there are less arguments than params as it'll
      // cause an error
      arrLen = t.conditionalExpression(
        t.binaryExpression(">", t.cloneNode(len), t.cloneNode(start)),
        t.binaryExpression("-", t.cloneNode(len), t.cloneNode(start)),
        t.numericLiteral(0),
      );
    } else {
      arrKey = t.identifier(key.name);
      arrLen = t.identifier(len.name);
    }

    const loop = buildRest({
      args: argsId,
      arrKey,
      arrLen,
      start,
      arr: rest,
      key,
      len,
    });

    if (state.deopted) {
      node.body.body.unshift(loop);
    } else {
      let target = path
        .getEarliestCommonAncestorFrom(state.references)
        .getStatementParent();

      // don't perform the allocation inside a loop
      target.findParent(path => {
        if (path.isLoop()) {
          target = path;
        } else {
          // Stop crawling up if this is a function.
          return path.isFunction();
        }
      });

      target.insertBefore(loop);
    }

    return true;
  };
}
