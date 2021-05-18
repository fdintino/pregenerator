import type { NodePath } from "ast-types/lib/node-path";
import { namedTypes as n, builders as b, visit } from "ast-types";
import { isReferencedIdentifier, isBindingIdentifier } from "./validation";
import { toBindingIdentifierName } from "./identifier";
import { getBindingIdentifier, getBinding, getOwnBinding } from "./scope";
import type { Scope } from "./scope";
import * as K from "ast-types/gen/kinds";
import cloneDeep from "lodash.clonedeep";

function getFunctionArity(node: K.FunctionKind): number {
  const params = node.params;
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    if (n.AssignmentPattern.check(param) || n.RestElement.check(param)) {
      return i;
    }
  }
  return params.length;
}

function buildPropertyMethodAssignmentWrapper({
  functionKey,
  functionId,
  func,
}: {
  functionKey: n.Identifier;
  functionId: n.Identifier;
  func: K.ExpressionKind & K.FunctionKind;
}): n.ExpressionStatement {
  return b.expressionStatement(
    b.callExpression(
      b.functionExpression(
        null,
        [functionKey],
        b.blockStatement([
          b.functionDeclaration(
            functionId,
            [],
            b.blockStatement([
              b.returnStatement(
                b.callExpression(
                  b.memberExpression(functionKey, b.identifier("apply")),
                  [b.thisExpression(), b.identifier("arguments")]
                )
              ),
            ]),
            false,
            false
          ),
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              b.memberExpression(functionId, b.identifier("toString")),
              b.functionExpression(
                null,
                [],
                b.blockStatement([
                  b.returnStatement(
                    b.callExpression(
                      b.memberExpression(functionKey, b.identifier("toString")),
                      []
                    )
                  ),
                ]),
                false,
                false
              )
            )
          ),
          b.returnStatement(functionId),
        ]),
        false,
        false
      ),
      [func]
    )
  );
}

function buildGeneratorPropertyMethodAssignmentWrapper({
  functionKey,
  functionId,
  func,
}: {
  functionKey: n.Identifier;
  functionId: n.Identifier;
  func: K.ExpressionKind & K.FunctionKind;
}): n.ExpressionStatement {
  return b.expressionStatement(
    b.callExpression(
      b.functionExpression(
        null,
        [functionKey],
        b.blockStatement([
          b.functionDeclaration(
            functionId,
            [],
            b.blockStatement([
              b.returnStatement(
                b.yieldExpression(
                  b.callExpression(
                    b.memberExpression(functionKey, b.identifier("apply")),
                    [b.thisExpression(), b.identifier("arguments")]
                  ),
                  true
                )
              ),
            ]),
            true,
            false
          ),
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              b.memberExpression(functionId, b.identifier("toString")),
              b.functionExpression(
                null,
                [],
                b.blockStatement([
                  b.returnStatement(
                    b.callExpression(
                      b.memberExpression(functionKey, b.identifier("toString")),
                      []
                    )
                  ),
                ]),
                false,
                false
              )
            )
          ),
          b.returnStatement(functionId),
        ]),
        false,
        false
      ),
      [func]
    )
  );
}

function getNameFromLiteralId(id: K.LiteralKind | n.TemplateLiteral): string {
  if (n.NullLiteral.check(id)) {
    return "null";
  }

  if (n.RegExpLiteral.check(id)) {
    return `_${id.pattern}_${id.flags}`;
  }

  if (n.TemplateLiteral.check(id)) {
    return id.quasis.map((quasi) => quasi.value.raw).join("");
  }

  if (id.value !== undefined) {
    return id.value + "";
  }

  return "";
}

type FunctionNameState = {
  selfAssignment: boolean;
  selfReference: boolean;
  outerDeclar: null | NodePath<n.ASTNode>;
  name: string;
  stopped: boolean;
};

function wrap(
  state: FunctionNameState,
  method: K.ExpressionKind & K.FunctionKind,
  id: n.Identifier,
  scope: Scope
): void | n.CallExpression | (K.ExpressionKind & K.FunctionKind) {
  if (state.selfReference) {
    // we don't currently support wrapping class expressions
    if (!n.Function.check(method)) return;

    // need to add a wrapper since we can't change the references
    let build = buildPropertyMethodAssignmentWrapper;
    if (method.generator) {
      build = buildGeneratorPropertyMethodAssignmentWrapper;
    }

    const template = (build({
      func: method,
      functionId: id,
      functionKey: scope.declareTemporary(id.name),
    }) as n.ExpressionStatement).expression as n.CallExpression;

    // shim in dummy params to retain function arity, if you try to read the
    // source then you'll get the original since it's proxied so it's all good
    const params = (((template.callee as n.FunctionExpression).body
      .body[0] as any) as n.FunctionExpression).params;

    for (let i = 0, len = getFunctionArity(method); i < len; i++) {
      params.push(scope.declareTemporary("x"));
    }

    return template;
  }

  method.id = id;
  // scope.getProgramParent().references[id.name] = true;
}

function getFunctionNameState(
  node: K.ExpressionKind,
  name: string,
  scope: Scope
): FunctionNameState {
  const state = {
    selfAssignment: false,
    selfReference: false,
    outerDeclar: getBindingIdentifier(scope, name),
    name: name,
    stopped: false,
  };

  // check to see if we have a local binding of the id we're setting inside of
  // the function, this is important as there are caveats associated

  const binding = getOwnBinding(scope, name);

  const visitor = {
    visitIdentifier(path: NodePath<n.Identifier>) {
      if (state.stopped) {
        return;
      }
      if (!isReferencedIdentifier(path) && !isBindingIdentifier(path)) {
        return;
      }
      // check if this node matches our function id
      if (path.node.name !== state.name) return;

      // check that we don't have a local variable declared as that removes the need
      // for the wrapper
      const localDeclar = getBindingIdentifier(path.scope, state.name);
      if (
        !localDeclar ||
        !state.outerDeclar ||
        localDeclar.node !== state.outerDeclar.node
      )
        return;

      state.selfReference = true;
      state.stopped = true;
    },
  };

  if (binding) {
    if (binding.parentPath && binding.parentPath.name === "params") {
      // safari will blow up in strict mode with code like:
      //
      //   let t = function t(t) {};
      //
      // with the error:
      //
      //   Cannot declare a parameter named 't' as it shadows the name of a
      //   strict mode function.
      //
      // this isn't to the spec and they've invented this behaviour which is
      // **extremely** annoying so we avoid setting the name if it has a param
      // with the same id
      state.selfReference = true;
    } else {
      // otherwise it's defined somewhere in scope like:
      //
      //   let t = function () {
      //     let t = 2;
      //   };
      //
      // so we can safely just set the id and move along as it shadows the
      // bound function id
    }
  } else if (state.outerDeclar || scope.getGlobalScope().declares(name)) {
    visit(node, visitor);
  }

  return state;
}

/**
 * @param {NodePath} param0
 * @param {Boolean} localBinding whether a name could shadow a self-reference (e.g. converting arrow function)
 */
export default function (
  {
    node,
    parent,
    scope,
    id,
  }: {
    node: K.ExpressionKind & K.FunctionKind;
    parent?: n.ASTNode;
    scope: Scope;
    id?: n.ASTNode;
  },
  localBinding = false
): void | n.CallExpression | (K.ExpressionKind & K.FunctionKind) {
  // has an `id` so we don't need to infer one
  if (node.id) return;

  if (
    (n.ObjectProperty.check(parent) ||
      (n.ObjectMethod.check(parent) && parent.kind === "method")) &&
    (!parent.computed || n.Literal.check(parent.key))
  ) {
    // { foo() {} };
    id = parent.key;
  } else if (n.VariableDeclarator.check(parent)) {
    // let foo = function () {};
    id = parent.id;

    // but not "let foo = () => {};" being converted to function expression
    if (n.Identifier.check(id) && !localBinding && scope.parent) {
      const binding = getBinding(scope.parent, id.name);
      if (binding && getBinding(scope, id.name) === binding) {
        // always going to reference this method
        node.id = cloneDeep(id);
        return;
      }
    }
  } else if (n.AssignmentExpression.check(parent) && parent.operator === "=") {
    // foo = function () {};
    id = parent.left;
  } else if (!id) {
    return;
  }

  let name;
  if (id && n.Literal.check(id)) {
    name = getNameFromLiteralId(id);
  } else if (id && n.Identifier.check(id)) {
    name = id.name;
  }

  if (name === undefined) {
    return;
  }

  name = toBindingIdentifierName(name);
  id = b.identifier(name);

  const state = getFunctionNameState(node, name, scope);
  return wrap(state, node, id, scope) || node;
}
