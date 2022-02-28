import type { NodePath, Visitor, Context } from "@pregenerator/ast-types";
import {
  visit,
  builders as t,
  namedTypes as n,
  cloneNode,
} from "@pregenerator/ast-types";
import {
  isBindingIdentifier,
  isReferencedIdentifier,
} from "../../utils/validation";
import { replaceWith } from "../../utils/modification";
import { getBindingIdentifier } from "../../utils/scope";
import {
  getEarliestCommonAncestorFrom,
  getStatementParent,
} from "../../utils/ancestry";
import { findParent } from "../transform-regenerator/util";
import { ensureBlock } from "../../utils/conversion";

function hasOwn<K extends PropertyKey>(
  obj: Record<string, any>,
  prop: K
): obj is Record<K, any> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

type MemberExpressionOptimisationVisitorState = {
  references: NodePath<n.Identifier, n.Identifier>[];
  offset: number;

  argumentsNode: n.Identifier;
  outerBinding: n.Identifier | null;

  // candidate member expressions we could optimise if there are no other references
  candidates: Array<{
    cause: "indexGetter" | "lengthGetter" | "argSpread";
    path: NodePath<n.Identifier, n.Identifier>;
  }>;

  // local rest binding name
  name: string;

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
  deopted: boolean;
  noOptimise?: boolean;
};

/* eslint-disable no-shadow */
function buildRest({
  len,
  arr,
  arrKey,
  arrLen,
  key,
  start,
  args,
}: {
  len: n.Identifier;
  arr: n.Identifier;
  arrKey: n.Expression;
  arrLen: n.Expression;
  key: n.Identifier;
  start: n.NumericLiteral;
  args: n.Identifier;
}) {
  return [
    t.forStatement(
      t.variableDeclaration("var", [
        t.variableDeclarator(
          len,
          t.memberExpression(args, t.identifier("length"))
        ),
        t.variableDeclarator(
          arr,
          t.newExpression(t.identifier("Array"), [arrLen])
        ),
        t.variableDeclarator(key, start),
      ]),
      t.binaryExpression("<", key, len),
      t.updateExpression("++", key, false),
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(arr, arrKey, true),
            t.memberExpression(args, key, true)
          )
        ),
      ])
    ),
  ];
}

function restIndex({
  index,
  offset,
  args,
}: {
  index: n.NumericLiteral;
  offset: n.NumericLiteral;
  args: n.Identifier;
}) {
  return t.expressionStatement(
    t.conditionalExpression(
      t.logicalExpression(
        "||",
        t.binaryExpression("<", index, offset),
        t.binaryExpression(
          "<=",
          t.memberExpression(args, t.identifier("length")),
          index
        )
      ),
      t.identifier("undefined"),
      t.memberExpression(args, index, true)
    )
  );
}

function restLength({
  args,
  offset,
}: {
  args: n.Identifier;
  offset: n.NumericLiteral;
}) {
  return t.expressionStatement(
    t.conditionalExpression(
      t.binaryExpression(
        "<=",
        t.memberExpression(args, t.identifier("length")),
        offset
      ),
      t.numericLiteral(0),
      t.binaryExpression(
        "-",
        t.memberExpression(args, t.identifier("length")),
        offset
      )
    )
  );
}

function referencesRest(
  path: NodePath<n.Identifier>,
  state: MemberExpressionOptimisationVisitorState
): boolean {
  if (path.scope && path.node.name === state.name) {
    // Check rest parameter is not shadowed by a binding in another scope.
    const bindingIdentNode =
      getBindingIdentifier(path.scope, state.name)?.node || null;
    return bindingIdentNode === state.outerBinding;
    // return path.scope.bindingIdentifierEquals(state.name, state.outerBinding);
  }

  return false;
}

const memberExpressionOptimisationVisitor: Visitor<MemberExpressionOptimisationVisitorState> =
  {
    visitScopable(path, state) {
      // check if this scope has a local binding that will shadow the rest parameter
      if (!path.scope) return false;
      const bindingIdentNode =
        getBindingIdentifier(path.scope, state.name)?.node || null;
      if (bindingIdentNode !== state.outerBinding) return false;
      if (path.checkValue(n.Function)) {
        (this as any).visitFunction(path, state);
        return false;
      }
      this.traverse(path);
    },

    visitFunction(path, state) {
      // Detect whether any reference to rest is contained in nested functions to
      // determine if deopt is necessary.
      const oldNoOptimise = state.noOptimise;
      state.noOptimise = true;
      this.traverse(path, state);
      state.noOptimise = oldNoOptimise;

      // Skip because optimizing references to rest would refer to the `arguments`
      // of the nested function.
      return false;
    },

    visitIdentifier(path, state) {
      const { node } = path;
      /**
       * Deopt on use of a binding identifier with the same name as our rest param.
       *
       * See https://github.com/babel/babel/issues/2091
       */
      if (isBindingIdentifier(path)) {
        if (referencesRest(path, state)) {
          state.deopted = true;
        }
      }

      if (!isReferencedIdentifier(path)) return false;

      // we can't guarantee the purity of arguments
      if (node.name === "arguments") {
        state.deopted = true;
      }

      // is this a referenced identifier and is it referencing the rest parameter?
      if (!referencesRest(path, state)) return false;

      if (state.noOptimise) {
        state.deopted = true;
      } else {
        const parentPath = path.parentPath;

        if (!parentPath) return false;

        // Is this identifier the right hand side of a default parameter?
        if (
          path.parent?.name === "params" &&
          typeof parentPath?.name === "number" &&
          parentPath.name < state.offset
        ) {
          return false;
        }

        const parentNode = path.parent?.node;
        // ex: `args[0]`
        // ex: `args.whatever`
        if (
          n.MemberExpression.check(parentNode) &&
          parentNode.object === node
        ) {
          const grandparentPath = path.parent?.parent;
          const grandparentNode = grandparentPath?.node;

          const argsOptEligible =
            !state.deopted &&
            !(
              // ex: `args[0] = "whatever"`
              (
                (n.AssignmentExpression.check(grandparentNode) &&
                  parentPath.node === grandparentNode.left) ||
                // ex: `[args[0]] = ["whatever"]`
                n.LVal.check(grandparentNode) ||
                // ex: `for (rest[0] in this)`
                // ex: `for (rest[0] of this)`
                n.ForX.check(grandparentNode) ||
                // ex: `++args[0]`
                // ex: `args[0]--`
                n.UpdateExpression.check(grandparentNode) ||
                // ex: `delete args[0]`
                (n.UnaryExpression.check(grandparentNode) &&
                  grandparentNode.operator === "delete") ||
                // ex: `args[0]()`
                // ex: `new args[0]()`
                // ex: `new args[0]`
                ((n.CallExpression.check(grandparentNode) ||
                  n.NewExpression.check(grandparentNode)) &&
                  parentPath.node === grandparentNode.callee)
              )
            );

          if (argsOptEligible) {
            if (parentNode.computed) {
              // if we know that this member expression is referencing a number then
              // we can safely optimise it
              if (n.NumericLiteral.check(parentPath.get("property").node)) {
                state.candidates.push({ cause: "indexGetter", path });
                return false;
              }
            } else if (
              n.Identifier.check(parentNode.property) &&
              parentNode.property.name === "length"
            ) {
              // args.length
              state.candidates.push({ cause: "lengthGetter", path });
              return false;
            }
          }
        }

        // we can only do these optimizations if the rest variable would match
        // the arguments exactly
        // optimise single spread args in calls
        // ex: fn(...args)
        if (state.offset === 0 && path.parent?.check(n.SpreadElement)) {
          const call = path.parent?.parent?.node;
          if (n.CallExpression.check(call) && call.arguments.length === 1) {
            state.candidates.push({ cause: "argSpread", path });
            return false;
          }
        }

        state.references.push(path);
      }
      return false;
    },
  };
function hasRest(node: n.Function) {
  const length = node.params.length;
  return length > 0 && n.RestElement.check(node.params[length - 1]);
}

function optimiseIndexGetter(
  path: NodePath,
  argsId: n.Identifier,
  offset: number
) {
  const parentPath = path.parentPath;
  if (!parentPath) return;
  replaceWith(
    parentPath,
    restIndex({
      args: argsId,
      offset: t.numericLiteral(offset),
      index: t.numericLiteral(
        (path.parent?.node as any).property.value + offset
      ),
    })
  );

  // See if we can statically evaluate the first test (i.e. index < offset)
  // and optimize the AST accordingly.
  const offsetTest = parentPath.get("test").get("left").value;
  if (n.BinaryExpression.check(offsetTest)) {
    const { operator, left, right } = offsetTest;
    if (
      n.NumericLiteral.check(left) &&
      n.NumericLiteral.check(right) &&
      operator === "<"
    ) {
      const offsetTestVal = left.value < right.value;
      if (offsetTestVal) {
        replaceWith(
          parentPath,
          t.unaryExpression("void", t.numericLiteral(0), true)
        );
      } else {
        replaceWith(
          parentPath.get("test"),
          parentPath.get("test").get("right").node
        );
      }
    }
  }
}

function optimiseLengthGetter(
  path: NodePath,
  argsId: n.Identifier,
  offset: number
) {
  if (!path.parentPath) return;
  if (offset) {
    replaceWith(
      path.parentPath,
      restLength({
        args: argsId,
        offset: t.numericLiteral(offset),
      })
    );
  } else {
    replaceWith(path, argsId);
  }
}
export default function convertFunctionRest(
  ctx: Context,
  path: NodePath<n.Function, n.Function>
): boolean {
  const { node, scope } = path;

  if (!hasRest(node)) return false;
  if (!scope || !path.parentPath) return false;

  const restElement = node.params.pop();
  n.assertRestElement(restElement);
  let rest: n.LVal | n.Identifier = restElement.argument;

  const argsId = t.identifier("arguments");

  n.assertLVal(restElement.argument);
  if (n.Pattern.check(rest)) {
    const pattern = rest;
    rest = scope.declareTemporary("ref");

    const declar = t.variableDeclaration("let", [
      t.variableDeclarator(pattern, rest),
    ]);

    (path.get("body") as NodePath<n.BlockStatement, n.BlockStatement>)
      .get("body")
      .unshift(declar);
  }

  if (!hasOwn(rest, "name")) return false;

  const outerBinding = getBindingIdentifier(scope, (rest as any).name);

  // check and optimise for extremely common cases
  const state: MemberExpressionOptimisationVisitorState = {
    references: [],
    offset: node.params.length,

    argumentsNode: argsId,
    outerBinding: outerBinding?.node || null,

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
  for (const child of path.iterChildren()) {
    if (Array.isArray(child.value) || n.Node.check(child.value)) {
      visit(child, memberExpressionOptimisationVisitor, state);
    }
  }

  // There are only 'shorthand' references
  if (!state.deopted && !state.references.length) {
    for (const { path, cause } of state.candidates) {
      const clonedArgsId = cloneNode(argsId);
      switch (cause) {
        case "indexGetter":
          optimiseIndexGetter(path, clonedArgsId, state.offset);
          break;
        case "lengthGetter":
          optimiseLengthGetter(path, clonedArgsId, state.offset);
          break;
        default:
          replaceWith(path, clonedArgsId);
      }
    }
    return true;
  }

  state.references = state.references.concat(
    state.candidates.map(({ path }) => path)
  );

  const start = t.numericLiteral(node.params.length);
  const key = scope.declareTemporary("key");
  const len = scope.declareTemporary("len");

  let arrKey, arrLen;
  if (node.params.length) {
    // this method has additional params, so we need to subtract
    // the index of the current argument position from the
    // position in the array that we want to populate
    arrKey = t.binaryExpression("-", cloneNode(key), cloneNode(start));

    // we need to work out the size of the array that we're
    // going to store all the rest parameters
    //
    // we need to add a check to avoid constructing the array
    // with <0 if there are less arguments than params as it'll
    // cause an error
    arrLen = t.conditionalExpression(
      t.binaryExpression(">", cloneNode(len), cloneNode(start)),
      t.binaryExpression("-", cloneNode(len), cloneNode(start)),
      t.numericLiteral(0)
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
    (node.body as n.BlockStatement).body.unshift(...loop);
  } else {
    const earliestCommonAncestor = getEarliestCommonAncestorFrom(
      path,
      state.references
    );
    let target = getStatementParent(earliestCommonAncestor);

    // don't perform the allocation inside a loop
    findParent(target, (path) => {
      if (path.check(n.Loop)) {
        target = path;
        return false;
      } else {
        // Stop crawling up if this is a function.
        return path.check(n.Function);
      }
    });

    if (target.node === path.node) {
      ensureBlock(path);
      const pathBody = path.get("body");
      if (pathBody.check(n.BlockStatement)) {
        const pathBodyStatements = pathBody.get("body");
        pathBodyStatements.insertAt(0, ...loop);
        return true;
      }
    }
    target.insertBefore(...loop);
  }

  return true;
}
