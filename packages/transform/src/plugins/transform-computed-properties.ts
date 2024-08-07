import type { NodePath, Scope } from "@pregenerator/ast-types";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  cloneNode,
} from "@pregenerator/ast-types";
import { maybeGenerateMemoised, generateUidBasedOnNode } from "../utils/scope";
import { nodeHasProp } from "../utils/util";
import addHelper from "../utils/addHelper";
import { replaceWithMultiple } from "../utils/modification";

type ObjectExpressionProperty = n.Property | n.ObjectMethod | n.ObjectProperty;

type ComputedPropInfo = {
  scope: Scope;
  objId: n.Identifier;
  body: (n.VariableDeclaration | n.ExpressionStatement)[];
  computedProps: ObjectExpressionProperty[];
  initPropExpression: n.ObjectExpression;
  getMutatorId: () => n.Identifier;
};

function buildMutatorMapAssign({
  mutatorMapRef,
  key,
  kind,
  value,
}: {
  mutatorMapRef: n.Identifier;
  key: n.Identifier | n.Literal | n.Expression;
  value: n.Expression | n.PatternLike;
  kind: n.Identifier;
}): n.ExpressionStatement[] {
  n.assertExpression(value);
  return [
    b.expressionStatement(
      b.assignmentExpression(
        "=",
        b.memberExpression(mutatorMapRef, key, true),
        b.logicalExpression(
          "||",
          b.memberExpression(mutatorMapRef, key, true),
          b.objectExpression([])
        )
      )
    ),
    b.expressionStatement(
      b.assignmentExpression(
        "=",
        b.memberExpression(b.memberExpression(mutatorMapRef, key, true), kind),
        value
      )
    ),
  ];
}

function getValue(prop: ObjectExpressionProperty): n.Expression {
  /* istanbul ignore else */
  if (n.Property.check(prop) || n.ObjectProperty.check(prop)) {
    n.assertExpression(prop.value);
    return prop.value;
  } else {
    // ObjectMethod
    return b.functionExpression(
      null,
      prop.params,
      prop.body,
      prop.generator,
      prop.async
    );
  }
}

function pushAssign(
  objId: n.Identifier,
  prop: ObjectExpressionProperty,
  body: (n.VariableDeclaration | n.ExpressionStatement)[]
) {
  body.push(
    b.expressionStatement(
      b.assignmentExpression(
        "=",
        b.memberExpression(
          cloneNode(objId),
          prop.key,
          (nodeHasProp(prop, "computed") && prop.computed) ||
            n.Literal.check(prop.key)
        ),
        getValue(prop)
      )
    )
  );
}

function pushMutatorDefine(
  { body, getMutatorId, scope }: ComputedPropInfo,
  prop: n.Property | n.ObjectMethod
) {
  let key: n.Literal | n.Identifier | n.Expression =
    (!nodeHasProp(prop, "computed") || !prop.computed) &&
    n.Identifier.check(prop.key)
      ? b.stringLiteral(prop.key.name)
      : prop.key;

  const maybeMemoise = maybeGenerateMemoised(key, scope);
  if (maybeMemoise) {
    body.push(
      b.expressionStatement(b.assignmentExpression("=", maybeMemoise, key))
    );
    key = maybeMemoise;
  }

  body.push(
    ...buildMutatorMapAssign({
      mutatorMapRef: getMutatorId(),
      key: cloneNode(key),
      value: getValue(prop),
      kind: b.identifier(prop.kind),
    })
  );
}

function pushComputedProps(info: ComputedPropInfo): void {
  for (const prop of info.computedProps) {
    if (
      nodeHasProp(prop, "kind") &&
      (prop.kind === "get" || prop.kind === "set")
    ) {
      pushMutatorDefine(info, prop);
    } else {
      pushAssign(cloneNode(info.objId), prop, info.body);
    }
  }
}

const plugin = {
  name: "transform-computed-properties",

  visitor: PathVisitor.fromMethodsObject({
    visitObjectExpression(path: NodePath<n.ObjectExpression>) {
      this.traverse(path);

      const { node, parent, scope } = path;
      let hasComputed = false;
      for (const prop of node.properties) {
        hasComputed = nodeHasProp(prop, "computed") && prop.computed === true;
        if (hasComputed) break;
      }
      if (!hasComputed) return;

      if (!parent || !scope) {
        throw new Error("TK1");
      }

      // put all getters/setters into the first object expression as well as all initialisers up
      // to the first computed property

      const initProps: ObjectExpressionProperty[] = [];
      const computedProps: ObjectExpressionProperty[] = [];
      let foundComputed = false;

      for (const prop of node.properties) {
        if (n.SpreadElement.check(prop)) {
          throw new Error("Unexpected SpreadElement");
        }
        if (nodeHasProp(prop, "computed") && prop.computed) {
          foundComputed = true;
        }

        if (foundComputed) {
          computedProps.push(prop);
        } else {
          initProps.push(prop);
        }
      }

      const objId = generateUidBasedOnNode(parent.node, scope);
      const initPropExpression = b.objectExpression(initProps);
      const body: (n.VariableDeclaration | n.ExpressionStatement)[] = [];

      body.push(
        b.variableDeclaration("var", [
          b.variableDeclarator(objId, initPropExpression),
        ])
      );

      let mutatorRef: n.Identifier | null = null;

      function getMutatorId(): n.Identifier {
        let ref;
        if (mutatorRef) {
          return cloneNode(mutatorRef);
        } else {
          if (!scope) {
            throw new Error("TK2");
          }
          ref = scope.declareTemporary("mutatorMap");

          body.push(
            b.variableDeclaration("var", [
              b.variableDeclarator(ref, b.objectExpression([])),
            ])
          );

          mutatorRef = ref;
          return ref;
        }
      }

      pushComputedProps({
        scope,
        objId,
        body,
        computedProps,
        initPropExpression,
        getMutatorId,
      });

      if (mutatorRef) {
        body.push(
          b.expressionStatement(
            b.callExpression(addHelper("defineEnumerableProperties"), [
              cloneNode(objId),
              cloneNode(mutatorRef),
            ])
          )
        );
      }

      body.push(b.expressionStatement(cloneNode(objId)));
      replaceWithMultiple(path, body);
    },
  }),
};

export default plugin;
