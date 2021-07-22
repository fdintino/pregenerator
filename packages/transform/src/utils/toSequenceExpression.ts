import { namedTypes as n, builders as b } from "@pregenerator/ast-types";
import type { Scope } from "./scope";
import { buildUndefinedNode } from "./scope";
import { getBindingIdentifiers } from "./validation";
import type * as K from "@pregenerator/ast-types/gen/kinds";

type Declar = {
  key: string;
  id: n.Identifier;
};

const hasOwn = Object.prototype.hasOwnProperty;

export default function toSequenceExpression(
  nodes: n.ASTNode[] | null | undefined,
  scope: Scope
): K.ExpressionKind | undefined {
  if (!nodes || !nodes.length) return;

  const declars: Declar[] = [];
  let bailed = false;

  function convert(_nodes: n.ASTNode[]): boolean | K.ExpressionKind {
    let ensureLastUndefined = false;
    const exprs: K.ExpressionKind[] = [];

    for (const node of _nodes) {
      if (n.Expression.check(node)) {
        exprs.push(node);
      } else if (n.ExpressionStatement.check(node)) {
        exprs.push(node.expression);
      } else if (n.VariableDeclaration.check(node)) {
        if (node.kind !== "var") return (bailed = true); // bailed

        for (const declar of node.declarations) {
          const bindings = getBindingIdentifiers(declar);
          for (const key in bindings) {
            declars.push({
              key,
              id: bindings[key],
            });
          }

          if (n.VariableDeclarator.check(declar) && declar.init) {
            exprs.push(b.assignmentExpression("=", declar.id, declar.init));
          }
        }

        ensureLastUndefined = true;
        continue;
      } else if (n.IfStatement.check(node)) {
        const consequent = node.consequent
          ? (convert([node.consequent]) as K.ExpressionKind)
          : buildUndefinedNode();
        const alternate = node.alternate
          ? (convert([node.alternate]) as K.ExpressionKind)
          : buildUndefinedNode();
        if (!consequent || !alternate) return (bailed = true);

        exprs.push(b.conditionalExpression(node.test, consequent, alternate));
      } else if (n.BlockStatement.check(node)) {
        exprs.push(convert(node.body) as K.ExpressionKind);
      } else if (n.EmptyStatement.check(node)) {
        // empty statement so ensure the last item is undefined if we're last
        ensureLastUndefined = true;
        continue;
      } else {
        // bailed, we can't turn this statement into an expression
        return (bailed = true);
      }

      ensureLastUndefined = false;
    }

    if (ensureLastUndefined || exprs.length === 0) {
      exprs.push(buildUndefinedNode());
    }

    //

    if (exprs.length === 1) {
      return exprs[0];
    } else {
      return b.sequenceExpression(exprs);
    }
  }

  const result = convert(nodes);
  if (bailed && typeof result === "boolean") return;

  const decls: n.VariableDeclarator[] = [];

  scope.scan(true);

  for (let i = 0; i < declars.length; i++) {
    const { key, id } = declars[i];
    if (!scope.lookup(key)) {
      decls.push(b.variableDeclarator(id, null));
    }
    // if (scope.bindings) {
    //   if (hasOwn.call(scope.bindings, key)) {
    //     if (Array.isArray(scope.bindings[key])) {
    //       scope.bindings[key].push(id);
    //     } else {
    //       const existingId = scope.bindings[key];
    //       scope.bindings[key] = [existingId, id];
    //     }
    //   } else {
    //     scope.bindings[key] = id;
    //   }
    // }
  }
  if (decls.length) {
    let bodyPath = scope.hoistScope.path.get("body");
    if (n.BlockStatement.check(bodyPath.value)) {
      bodyPath = bodyPath.get("body");
    }

    bodyPath.unshift(b.variableDeclaration("var", decls));
    scope.hoistScope.scan(true);
  }

  return result as K.ExpressionKind;
}
