import callDelegate from "./call-delegate";
import type { NodePath, Scope, Visitor } from "@pregenerator/ast-types";
import {
  builders as t,
  namedTypes as n,
  visit,
  cloneNode,
} from "@pregenerator/ast-types";
import {
  isReferencedIdentifier,
  isBindingIdentifier,
} from "../../utils/validation";
import { ensureBlock } from "../../utils/conversion";
import { replaceWith } from "../../utils/modification";
import {
  buildUndefinedNode,
  getOwnBinding,
  getBinding,
  getBindingKind,
} from "../../utils/scope";

function buildDefaultParam({
  varName,
  argKey,
  defaultValue,
}: {
  varName: n.LVal;
  argKey: n.NumericLiteral;
  defaultValue: n.Expression;
}) {
  return t.variableDeclaration("let", [
    t.variableDeclarator(
      varName,
      t.conditionalExpression(
        t.logicalExpression(
          "&&",
          t.binaryExpression(
            ">",
            t.memberExpression(
              t.identifier("arguments"),
              t.identifier("length")
            ),
            argKey
          ),
          t.binaryExpression(
            "!==",
            t.memberExpression(t.identifier("arguments"), argKey, true),
            t.identifier("undefined")
          )
        ),
        t.memberExpression(t.identifier("arguments"), argKey, true),
        defaultValue
      )
    ),
  ]);
}

function buildLooseDefaultParam({
  assignmentId,
  undef,
  defaultValue,
}: {
  assignmentId: n.Identifier;
  undef: n.UnaryExpression;
  defaultValue: n.Expression;
}) {
  return t.ifStatement(
    t.binaryExpression("===", assignmentId, undef),
    t.blockStatement([
      t.expressionStatement(
        t.assignmentExpression("=", assignmentId, defaultValue)
      ),
    ])
  );
}

function buildLooseDestructuredDefaultParam({
  assignmentId,
  paramName,
  defaultValue,
  undef,
}: {
  assignmentId: n.Identifier;
  paramName: n.Identifier;
  defaultValue: n.Expression;
  undef: n.UnaryExpression;
}) {
  return t.variableDeclaration("let", [
    t.variableDeclarator(
      assignmentId,
      t.conditionalExpression(
        t.binaryExpression("===", paramName, undef),
        defaultValue,
        paramName
      )
    ),
  ]);
}

function buildSafeArgumentsAccess([$0, $1]: [
  n.Pattern | n.PatternLike,
  n.NumericLiteral
]) {
  return t.variableDeclaration("let", [
    t.variableDeclarator(
      $0,
      t.conditionalExpression(
        t.binaryExpression(
          ">",
          t.memberExpression(t.identifier("arguments"), t.identifier("length")),
          $1
        ),
        t.memberExpression(t.identifier("arguments"), $1, true),
        t.identifier("undefined")
      )
    ),
  ]);
}

function isSafeBinding(scope: Scope | null, node: n.Identifier) {
  const binding = scope ? getOwnBinding(scope, node.name) : null;
  if (!binding) return true;
  const kind = getBindingKind(binding);
  return kind === "param" || kind === "local";
}

type IIFEVisitorState = {
  iife: boolean;
  scope: Scope;
};

const iifeVisitor: Visitor<IIFEVisitorState> = {
  reset(path) {
    let scope: Scope | null | undefined = path.scope;
    scope?.scan(true);
    while ((scope = scope?.parent)) {
      scope.scan(true);
    }
  },
  visitIdentifier(path, state) {
    if (isReferencedIdentifier(path) || isBindingIdentifier(path)) {
      const { scope, node } = path;
      const { name } = node;
      if (name === "eval") {
        state.iife = true;
        this.abort();
      }
      if (!scope || !state.scope.parent) return false;
      const binding = getBinding(scope, name);
      const parentBinding = getBinding(state.scope.parent, name);
      const parentHasOwnBinding = !!getOwnBinding(state.scope, name);
      if (
        binding?.node &&
        parentBinding?.node &&
        binding.node === parentBinding.node &&
        !parentHasOwnBinding
      ) {
        state.iife = true;
        this.abort();
      }
    }
    return false;
  },
};

export default function convertFunctionParams(
  path: NodePath<n.Function, n.Function>
): boolean {
  const { node, scope } = path;

  if (!scope) return false;

  const state = {
    iife: false,
    scope: scope,
  };

  const body = [];
  const params = path.get("params");

  let firstOptionalIndex = null;
  for (let i = 0; i < params.value.length; i++) {
    const param = params.get(i);
    visit(param, iifeVisitor, state);

    const paramIsAssignmentPattern = param.check(n.AssignmentPattern);
    if (paramIsAssignmentPattern) {
      const left = param.get("left");
      const right = param.get("right");

      const undefinedNode = buildUndefinedNode();

      /* istanbul ignore else */
      if (left.check(n.Identifier)) {
        /* istanbul ignore else */
        if (!state.iife) {
          if (right.check(n.Identifier) && !isSafeBinding(scope, right.node)) {
            // the right hand side references a parameter
            state.iife = true;
          } else {
            visit(right, iifeVisitor, state);
          }
        }

        body.push(
          buildLooseDefaultParam({
            assignmentId: cloneNode(left.node),
            defaultValue: right.node,
            undef: undefinedNode,
          })
        );
        replaceWith(param, left.node);
      } else if (left.check(n.ObjectPattern) || left.check(n.ArrayPattern)) {
        const paramName = scope.declareTemporary();
        body.push(
          buildLooseDestructuredDefaultParam({
            assignmentId: left.node,
            defaultValue: right.node,
            paramName: cloneNode(paramName),
            undef: undefinedNode,
          })
        );
        replaceWith(param, paramName);
      }
    } else if (param.checkValue(n.AssignmentPattern)) {
      if (firstOptionalIndex === null) firstOptionalIndex = i;

      const left = param.get("left");
      const right = param.get("right");

      /* istanbul ignore else */
      if (!state.iife) {
        if (right.check(n.Identifier) && !isSafeBinding(scope, right.node)) {
          // the right hand side references a parameter
          state.iife = true;
        } else {
          visit(right, iifeVisitor, state);
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
    } else if (param.check(n.ObjectPattern) || param.check(n.ArrayPattern)) {
      const uid = scope.injectTemporary("ref");

      const defNode = t.variableDeclaration("let", [
        t.variableDeclarator(param.node, uid),
      ]);
      body.push(defNode);

      replaceWith(param, cloneNode(uid));
    }

    if (!state.iife && !param.check(n.Identifier)) {
      visit(param, iifeVisitor, state);
    }
  }

  if (body.length === 0) return false;

  // we need to cut off all trailing parameters
  if (firstOptionalIndex !== null) {
    node.params = node.params.slice(0, firstOptionalIndex);
  }

  // ensure it's a block, useful for arrow functions
  ensureBlock(path);

  if (state.iife) {
    body.push(callDelegate(path));
    replaceWith(path.get("body"), t.blockStatement(body));
  } else {
    path
      .get("body")
      .get("body")
      .insertAt(0, ...body);
  }

  return true;
}
