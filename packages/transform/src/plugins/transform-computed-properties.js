export default function transformComputedPropertiesPlugin({types: t}) {
  function buildMutatorMapAssign({ mutatorMapRef, key, kind, value }) {
    return [t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(mutatorMapRef, key, true),
        t.logicalExpression(
          '||',
          t.memberExpression(mutatorMapRef, key, true),
          t.objectExpression([])
        )
      )
    ),
    t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(t.memberExpression(mutatorMapRef, key, true), kind),
        value
      )
    )];
  }

  function getValue(prop) {
    /* istanbul ignore else */
    if (t.isObjectProperty(prop)) {
      return prop.value;
    } else if (t.isObjectMethod(prop)) {
      return t.functionExpression(
        null,
        prop.params,
        prop.body,
        prop.generator,
        prop.async,
      );
    }
  }

  function pushAssign(objId, prop, body) {
    body.push(
      t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.cloneNode(objId),
            prop.key,
            prop.computed || t.isLiteral(prop.key),
          ),
          getValue(prop),
        ),
      ),
    );
  }

  function pushMutatorDefine({ body, getMutatorId, scope }, prop) {
    let key =
      !prop.computed && t.isIdentifier(prop.key)
        ? t.stringLiteral(prop.key.name)
        : prop.key;

    const maybeMemoise = scope.maybeGenerateMemoised(key);
    if (maybeMemoise) {
      body.push(
        t.expressionStatement(t.assignmentExpression("=", maybeMemoise, key)),
      );
      key = maybeMemoise;
    }

    body.push(
      ...buildMutatorMapAssign({
        mutatorMapRef: getMutatorId(),
        key: t.cloneNode(key),
        value: getValue(prop),
        kind: t.identifier(prop.kind),
      }),
    );
  }

  function pushComputedProps(info) {
    for (const prop of info.computedProps) {
      if (prop.kind === "get" || prop.kind === "set") {
        pushMutatorDefine(info, prop);
      } else {
        pushAssign(t.cloneNode(info.objId), prop, info.body);
      }
    }
  }

  return {
    name: "transform-computed-properties",

    visitor: {
      ObjectExpression: {
        exit(path, state) {
          const { node, parent, scope } = path;
          let hasComputed = false;
          for (const prop of node.properties) {
            hasComputed = prop.computed === true;
            if (hasComputed) break;
          }
          if (!hasComputed) return;

          // put all getters/setters into the first object expression as well as all initialisers up
          // to the first computed property

          const initProps = [];
          const computedProps = [];
          let foundComputed = false;

          for (const prop of node.properties) {
            if (prop.computed) {
              foundComputed = true;
            }

            if (foundComputed) {
              computedProps.push(prop);
            } else {
              initProps.push(prop);
            }
          }

          const objId = scope.generateUidIdentifierBasedOnNode(parent);
          const initPropExpression = t.objectExpression(initProps);
          const body = [];

          body.push(
            t.variableDeclaration("var", [
              t.variableDeclarator(objId, initPropExpression),
            ]),
          );

          let mutatorRef;

          function getMutatorId() {
            if (!mutatorRef) {
              mutatorRef = scope.generateUidIdentifier("mutatorMap");

              body.push(
                t.variableDeclaration("var", [
                  t.variableDeclarator(mutatorRef, t.objectExpression([])),
                ]),
              );
            }

            return t.cloneNode(mutatorRef);
          }

          pushComputedProps({
            scope,
            objId,
            body,
            computedProps,
            initPropExpression,
            getMutatorId,
            state,
          });

          if (mutatorRef) {
            body.push(
              t.expressionStatement(
                t.callExpression(
                  state.file.addHelper("defineEnumerableProperties"),
                  [t.cloneNode(objId), t.cloneNode(mutatorRef)],
                ),
              ),
            );
          }

          body.push(t.expressionStatement(t.cloneNode(objId)));
          path.replaceWithMultiple(body);
        },
      },
    },
  };
}
