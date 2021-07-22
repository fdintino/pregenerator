import { namedTypes as n, builders as b, PathVisitor } from "@pregenerator/ast-types";
import type * as K from "@pregenerator/ast-types/gen/kinds";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import toSequenceExpression from "./toSequenceExpression";
import cloneDeep from "lodash.clonedeep";
import { isWhile, isFor, isLoop, isCompletionRecord } from "./virtual-types";
import { findParent } from "./util";
import { getData, setData } from "./data";
import { arrowFunctionToExpression } from "./conversion";
import { getBindingIdentifierPaths } from "./validation";

export function getCompletionRecords(
  path: NodePath<n.ASTNode>
): Array<NodePath<n.ASTNode>> {
  const paths: Array<NodePath<n.ASTNode>> = [];

  function add(p: NodePath<n.ASTNode>) {
    if (p) {
      paths.push(...getCompletionRecords(p));
    }
  }

  const { node } = path;

  if (n.IfStatement.check(node)) {
    add(path.get("consequent"));
    add(path.get("alternate"));
  } else if (n.DoExpression.check(node) || isFor(node) || isWhile(node)) {
    add(path.get("body"));
  } else if (n.Program.check(node) || n.BlockStatement.check(node)) {
    const bodyLen = node.body.length;
    add(path.get("body", bodyLen - 1));
  } else if (n.Function.check(node)) {
    return getCompletionRecords(path.get("body"));
  } else if (n.TryStatement.check(node)) {
    add(path.get("block"));
    add(path.get("handler"));
    add(path.get("finalizer"));
  } else {
    paths.push(path);
  }

  return paths;
}

// let hoistVariablesVisitor = {
//   Function(path) {
//     path.skip();
//   },
//
//   VariableDeclaration(path) {
//     if (path.node.kind !== "var") return;
//
//     let bindings = path.getBindingIdentifiers();
//     for (let key in bindings) {
//       path.scope.push({ id: bindings[key] });
//     }
//
//     let exprs = [];
//
//     for (let declar of path.node.declarations) {
//       if (declar.init) {
//         exprs.push(t.expressionStatement(
//           t.assignmentExpression("=", declar.id, declar.init)
//         ));
//       }
//     }
//
//     path.replaceWithMultiple(exprs);
//   }
// };

export function replaceExpressionWithStatements(
  path: NodePath<n.ASTNode>,
  nodes: K.StatementKind[]
): NodePath<n.ASTNode> {
  const sequenceExpression = toSequenceExpression(nodes, path.scope);

  if (sequenceExpression) {
    path.replace(sequenceExpression);
    return path.get("expressions");
  }

  const container = b.arrowFunctionExpression([], b.blockStatement(nodes));
  path.replace(b.callExpression(container, []));

  // add implicit returns to all ending expression statements
  PathVisitor.fromMethodsObject({
    visitFunction() {
      return false;
    },

    visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
      if (path.node.kind !== "var") return;

      const bindings = getBindingIdentifierPaths(path);
      for (const key in bindings) {
        path.scope.push(bindings[key]);
      }

      const exprs: n.ExpressionStatement[] = [];

      for (const declar of path.node.declarations) {
        if (n.VariableDeclarator.check(declar) && declar.init) {
          exprs.push(
            b.expressionStatement(
              b.assignmentExpression("=", declar.id, declar.init)
            )
          );
        }
      }

      replaceWithMultiple(path, exprs);
      this.traverse(path);
    },
  }).visit(path);

  const completionRecords = getCompletionRecords(path.get("callee"));

  for (const path of completionRecords) {
    if (!n.ExpressionStatement.check(path.node)) continue;
    const loop = findParent(path, (p) => isLoop(p.node));

    if (loop) {
      let uid = getData<n.Identifier>(
        loop.node,
        "expressionReplacementReturnUid"
      );

      if (!uid) {
        const callee = path.get("callee");
        uid = callee.scope.injectTemporary("ret");
        callee
          .get("body", "body")
          .push(b.returnStatement(cloneDeep(uid as n.Identifier)));
        setData(loop.node, "expressionReplacementReturnUid", uid);
      } else {
        uid = b.identifier(uid.name);
      }

      path
        .get("expression")
        .replace(
          b.assignmentExpression(
            "=",
            cloneDeep(uid as n.Identifier),
            path.node.expression
          )
        );
    } else {
      path.replace(b.returnStatement(path.node.expression));
    }
  }

  const callee = path.get("callee");
  arrowFunctionToExpression(callee);
  return callee.get("body", "body");
}

function _maybePopFromStatements(path: NodePath<n.ASTNode>, nodes: n.ASTNode[]): void {
  const last = nodes[nodes.length - 1];
  const isIdentifier =
    n.Identifier.check(last) ||
    (n.ExpressionStatement.check(last) && n.Identifier.check(last.expression));

  if (isIdentifier && !isCompletionRecord(path)) {
    nodes.pop();
  }
}

function isStatementOrBlock(path: NodePath<n.ASTNode>): boolean {
  if (
    n.LabeledStatement.check(path.parentPath.node) ||
    n.BlockStatement.check(path.parent.value)
  ) {
    return false;
  } else {
    return ["consequent", "body", "alternate"].indexOf(path.name) !== -1;
  }
}

export function insertBefore(
  path: NodePath<n.ASTNode>,
  nodes: n.ASTNode[]
): boolean {
  const parentNode = path.parentPath ? path.parentPath.node : undefined;
  const { node } = path;
  if (
    path.parentPath &&
    (n.ExpressionStatement.check(parentNode) ||
      n.LabeledStatement.check(parentNode))
  ) {
    return insertBefore(path.parentPath, nodes);
  } else if (
    n.Expression.check(node) ||
    (n.ForStatement.check(parentNode) && path.name === "init")
  ) {
    if (path.node) nodes.push(path.node);
    replaceExpressionWithStatements(path, nodes as K.StatementKind[]);
    return true;
  } else {
    _maybePopFromStatements(path, nodes);
    if (Array.isArray(path.parent.value)) {
      path.insertBefore(...nodes);
      return false;
    } else if (isStatementOrBlock(path)) {
      if (path.node) nodes.push(path.node);
      path.replace(b.blockStatement(nodes as K.StatementKind[]));
      return true;
    } else {
      throw new Error(
        "We don't know what to do with path node type. We were previously a Statement but we can't fit in here?"
      );
    }
  }
  return false;
}

export function insertAfter(
  path: NodePath<n.ASTNode>,
  nodes: n.ASTNode[]
): boolean {
  const parentNode = path.parentPath ? path.parentPath.node : undefined;
  const { node } = path;
  if (
    path.parentPath &&
    (n.ExpressionStatement.check(parentNode) ||
      n.LabeledStatement.check(parentNode))
  ) {
    insertAfter(path.parentPath, nodes);
    return false;
  } else if (
    n.Expression.check(node) ||
    (n.ForStatement.check(parentNode) && path.name === "init")
  ) {
    // if (path.node) {
    //   // if (n.AssignmentExpression.check(node) && n.Pattern.check(node.left)) {
    //   //   path.replace(
    //   //     b.callExpression(b.arrowFunctionExpression([], node), []),
    //   //   );
    //   //   insertAfter(path.get("callee", "body"), nodes);
    //   //   return true;
    //   //   // (this.get("callee.body") as NodePath).insertAfter(nodes);
    //   // }
    //   const temp = path.scope.injectTemporary();
    //   nodes.unshift(
    //     b.expressionStatement(b.assignmentExpression("=", temp, node as K.ExpressionKind))
    //   );
    //   nodes.push(b.expressionStatement(temp));
    // }
    replaceExpressionWithStatements(path, nodes as K.StatementKind[]);
    return true;
  } else {
    _maybePopFromStatements(path, nodes);
    if (Array.isArray(path.parentPath.value)) {
      path.insertAfter(...nodes);
      return false;
    } else if (isStatementOrBlock(path)) {
      // if (path.node) nodes.unshift(path.node);
      path.replace(b.blockStatement(nodes as K.StatementKind[]));
      return true;
    } else {
      throw new Error(
        "We don't know what to do with path node type. We were previously a Statement but we can't fit in here?"
      );
    }
  }
  return false;
}

function canHaveVariableDeclarationOrExpression(
  path: NodePath<n.ASTNode>
): boolean {
  return (
    (path.name === "init" || path.name === "left") &&
    isFor(path.parentPath.node)
  );
}

function canSwapBetweenExpressionAndStatement(
  path: NodePath<n.ASTNode>,
  replacement: n.ASTNode
): boolean {
  if (
    path.name !== "body" ||
    !n.ArrowFunctionExpression.check(path.parentPath.node)
  ) {
    return false;
  }

  if (n.Expression.check(path.node)) {
    return n.BlockStatement.check(replacement);
  } else if (n.BlockStatement.check(path.node)) {
    return n.Expression.check(replacement);
  }

  return false;
}

export function replaceWithMultiple(
  path: NodePath<n.ASTNode>,
  nodes: n.ASTNode[]
): void {
  // t.inheritLeadingComments(nodes[0], this.node);
  // t.inheritTrailingComments(nodes[nodes.length - 1], this.node);
  const didReplace = insertAfter(path, nodes);
  if (!didReplace) {
    path.replace();
  }
}

export function replaceWith(
  path: NodePath<n.ASTNode>,
  replacement: n.ASTNode
): void {
  if (n.Statement.check(path.node) && n.Expression.check(replacement)) {
    if (
      !canHaveVariableDeclarationOrExpression(path) &&
      !canSwapBetweenExpressionAndStatement(path, replacement) &&
      !n.ExportDefaultDeclaration.check(path.parentPath.node)
    ) {
      // replacing a statement with an expression so wrap it in an expression statement
      replacement = b.expressionStatement(replacement as K.ExpressionKind);
    }
  }

  if (n.Expression.check(path.node) && n.Statement.check(replacement)) {
    if (
      !canHaveVariableDeclarationOrExpression(path) &&
      !canSwapBetweenExpressionAndStatement(path, replacement)
    ) {
      // replacing an expression with a statement so let's explode it
      replaceExpressionWithStatements(path, [replacement as K.StatementKind]);
      return;
    }
  }

  // let oldNode = path.node;
  // if (oldNode) {
  //   t.inheritsComments(replacement, oldNode);
  //   t.removeComments(oldNode);
  // }

  // replace the node
  path.replace(replacement);
}
