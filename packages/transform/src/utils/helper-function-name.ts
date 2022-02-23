import type { NodePath } from "@pregenerator/ast-types";
import { namedTypes as n, builders as b, visit } from "@pregenerator/ast-types";
import { isReferencedIdentifier, isBindingIdentifier } from "./validation";
import { toBindingIdentifierName } from "./identifier";
import { getBindingIdentifier, getBinding, getOwnBinding } from "./scope";
import type { Scope } from "@pregenerator/ast-types";
import cloneDeep from "lodash.clonedeep";

function getBindingIdentifierNode(
  scope: Scope,
  name: string
): n.Identifier | null {
  const bindingId = getBindingIdentifier(scope, name);
  return bindingId ? bindingId.node : null;
}

function getFunctionArity(node: n.Function): number {
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
  func: n.Expression & n.Function;
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
  func: n.Expression & n.Function;
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

function getNameFromLiteralId(id: n.Literal | n.TemplateLiteral): string {
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
  outerDeclar: null | n.Identifier;
  name: string;
  stopped: boolean;
};

function wrap(
  state: FunctionNameState,
  method: n.Expression & n.Function,
  id: n.Identifier,
  scope: Scope
): void | n.CallExpression | (n.Expression & n.Function) {
  if (state.selfReference) {
    // we don't currently support wrapping class expressions
    if (!n.Function.check(method)) return;

    // need to add a wrapper since we can't change the references
    let build = buildPropertyMethodAssignmentWrapper;
    if (method.generator) {
      build = buildGeneratorPropertyMethodAssignmentWrapper;
    }

    const template = (
      build({
        func: method,
        functionId: id,
        functionKey: scope.declareTemporary(id.name),
      }) as n.ExpressionStatement
    ).expression as n.CallExpression;

    // shim in dummy params to retain function arity, if you try to read the
    // source then you'll get the original since it's proxied so it's all good
    const params = (
      (template.callee as n.FunctionExpression).body
        .body[0] as any as n.FunctionExpression
    ).params;

    for (let i = 0, len = getFunctionArity(method); i < len; i++) {
      params.push(scope.declareTemporary("x"));
    }

    return template;
  }

  method.id = id;
  // scope.getProgramParent().references[id.name] = true;
}

function getFunctionNameState(
  node: n.Expression,
  name: string,
  scope: Scope
): FunctionNameState {
  const state = {
    selfAssignment: false,
    selfReference: false,
    outerDeclar: getBindingIdentifierNode(scope, name),
    name: name,
    stopped: false,
  };

  // check to see if we have a local binding of the id we're setting inside of
  // the function, this is important as there are caveats associated

  const bindingPath = getOwnBinding(scope, name);

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
      if (!path.scope) return;

      // check that we don't have a local variable declared as that removes the need
      // for the wrapper
      const localDeclar = getBindingIdentifierNode(path.scope, state.name);
      if (localDeclar !== state.outerDeclar) return;

      state.selfReference = true;
      state.stopped = true;
    },
  };

  if (bindingPath) {
    if (bindingPath.parentPath && bindingPath.parentPath.name === "params") {
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
  } else if (state.outerDeclar || scope.getGlobalScope()?.declares(name)) {
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
    node: n.Expression & n.Function;
    parent?: n.Node;
    scope: Scope;
    id?: n.Node;
  },
  localBinding = false
): void | n.CallExpression | (n.Expression & n.Function) {
  // has an `id` so we don't need to infer one
  if (node.id) return;

  if (
    (n.ObjectProperty.check(parent) ||
      (n.Property.check(parent) && parent.kind === "init") ||
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
      const parentBinding = getBinding(scope.parent, id.name);
      const binding = getBinding(scope, id.name);
      if (binding && parentBinding && binding.node === parentBinding.node) {
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
