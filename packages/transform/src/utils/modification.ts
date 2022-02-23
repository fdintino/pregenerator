import {
  namedTypes as n,
  builders as b,
  PathVisitor,
} from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types";
import toSequenceExpression from "./toSequenceExpression";
import cloneDeep from "lodash.clonedeep";
import { isCompletionRecord } from "./virtual-types";
import { findParent } from "./util";
import { getData, setData } from "./data";
import { arrowFunctionToExpression } from "./conversion";
import { getBindingIdentifierPaths } from "./validation";

export function getCompletionRecords(
  path: NodePath<n.Node>
): Array<NodePath<n.Node>> {
  const paths: Array<NodePath<n.Node>> = [];

  function add(p: NodePath<n.Node>) {
    if (p) {
      paths.push(...getCompletionRecords(p));
    }
  }

  const { node } = path;

  if (n.IfStatement.check(node)) {
    add(path.get("consequent"));
    add(path.get("alternate"));
  } else if (
    n.DoExpression.check(node) ||
    n.For.check(node) ||
    n.While.check(node)
  ) {
    add(path.get("body"));
  } else if (n.Program.check(node) || n.BlockStatement.check(node)) {
    const bodyLen = node.body.length;
    add(path.get("body").get(bodyLen - 1));
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
  path: NodePath<n.Node>,
  nodes: n.Statement[]
): NodePath<n.Node> {
  if (!path.scope) {
    throw new Error("TK");
  }
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

      if (!path.scope) {
        throw new Error("TK10");
      }

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
    const loop = findParent(path, (p) => n.Loop.check(p.node));

    if (loop) {
      let uid = getData<n.Identifier>(
        loop.node,
        "expressionReplacementReturnUid"
      );

      if (!uid) {
        const callee = path.get("callee");
        if (!callee.scope) {
          throw new Error("TK7");
        }
        uid = callee.scope.injectTemporary("ret");
        callee
          .get("body")
          .get("body")
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
  return callee.get("body").get("body");
}

function _maybePopFromStatements(
  path: NodePath<n.Node>,
  nodes: n.Node[]
): void {
  const last = nodes[nodes.length - 1];
  const isIdentifier =
    n.Identifier.check(last) ||
    (n.ExpressionStatement.check(last) && n.Identifier.check(last.expression));

  if (isIdentifier && !isCompletionRecord(path)) {
    nodes.pop();
  }
}

function isStatementOrBlock(path: NodePath<n.Node>): boolean {
  if (
    n.LabeledStatement.check(path.parentPath?.node) ||
    n.BlockStatement.check(path.parent?.value)
  ) {
    return false;
  } else {
    return (
      path.name === "consequent" ||
      path.name === "body" ||
      path.name === "alternate"
    );
  }
}

export function insertBefore(
  path: NodePath<n.Node>,
  nodes: n.Node[]
): {
  newPaths: NodePath<n.Node>[];
  didReplace: boolean;
} {
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
    const newPath = replaceExpressionWithStatements(
      path,
      nodes as n.Statement[]
    );
    return { newPaths: [newPath], didReplace: true };
  } else {
    _maybePopFromStatements(path, nodes);
    if (Array.isArray(path.parent?.value)) {
      return { didReplace: false, newPaths: path.insertBefore(...nodes) };
    } else if (isStatementOrBlock(path)) {
      if (path.node) nodes.push(path.node);
      return {
        didReplace: true,
        newPaths: path.replace(b.blockStatement(nodes as n.Statement[])),
      };
    } else {
      throw new Error(
        "We don't know what to do with path node type. We were previously a Statement but we can't fit in here?"
      );
    }
  }
  return { newPaths: [], didReplace: false };
}

export function insertAfter(
  path: NodePath<n.Node>,
  nodes: n.Node[]
): {
  newPaths: NodePath<n.Node>[];
  didReplace: boolean;
} {
  const parentNode = path.parentPath ? path.parentPath.node : undefined;
  const { node } = path;
  if (
    path.parentPath &&
    (n.ExpressionStatement.check(parentNode) ||
      n.LabeledStatement.check(parentNode))
  ) {
    const { newPaths } = insertAfter(path.parentPath, nodes);
    return { newPaths, didReplace: false };
  } else if (
    n.Expression.check(node) ||
    (n.ForStatement.check(parentNode) && path.name === "init")
  ) {
    // if (path.node) {
    //   // if (n.AssignmentExpression.check(node) && n.Pattern.check(node.left)) {
    //   //   path.replace(
    //   //     b.callExpression(b.arrowFunctionExpression([], node), []),
    //   //   );
    //   //   insertAfter(path.get("callee").get("body"), nodes);
    //   //   return true;
    //   //   // (this.get("callee.body") as NodePath).insertAfter(nodes);
    //   // }
    //   const temp = path.scope.injectTemporary();
    //   nodes.unshift(
    //     b.expressionStatement(b.assignmentExpression("=", temp, node as n.Expression))
    //   );
    //   nodes.push(b.expressionStatement(temp));
    // }
    const newPath = replaceExpressionWithStatements(
      path,
      nodes as n.Statement[]
    );
    return { newPaths: [newPath], didReplace: true };
  } else {
    _maybePopFromStatements(path, nodes);
    if (Array.isArray(path.parentPath?.value)) {
      const newPaths = path.insertAfter(...nodes);
      return { newPaths, didReplace: false };
    } else if (isStatementOrBlock(path)) {
      // if (path.node) nodes.unshift(path.node);
      const newPaths = path.replace(b.blockStatement(nodes as n.Statement[]));
      return { newPaths, didReplace: true };
    } else {
      throw new Error(
        "We don't know what to do with path node type. We were previously a Statement but we can't fit in here?"
      );
    }
  }
  return { newPaths: [], didReplace: false };
}

function canHaveVariableDeclarationOrExpression(
  path: NodePath<n.Node>
): boolean {
  return (
    (path.name === "init" || path.name === "left") &&
    n.For.check(path.parentPath?.node)
  );
}

function canSwapBetweenExpressionAndStatement(
  path: NodePath<n.Node>,
  replacement: n.Node
): boolean {
  if (
    path.name !== "body" ||
    !n.ArrowFunctionExpression.check(path.parentPath?.node)
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
  path: NodePath<n.Node>,
  nodes: n.Node[]
): NodePath<n.Node>[] {
  // t.inheritLeadingComments(nodes[0], this.node);
  // t.inheritTrailingComments(nodes[nodes.length - 1], this.node);
  const { newPaths, didReplace } = insertAfter(path, nodes);
  if (!didReplace) {
    path.replace();
  }
  return newPaths;
}

export function replaceWith(
  path: NodePath<n.Node>,
  replacement: n.Node
): NodePath[] {
  if (n.Statement.check(path.node) && n.Expression.check(replacement)) {
    if (
      !canHaveVariableDeclarationOrExpression(path) &&
      !canSwapBetweenExpressionAndStatement(path, replacement) &&
      !n.ExportDefaultDeclaration.check(path.parentPath?.node)
    ) {
      // replacing a statement with an expression so wrap it in an expression statement
      replacement = b.expressionStatement(replacement as n.Expression);
    }
  }

  if (n.Expression.check(path.node) && n.Statement.check(replacement)) {
    if (
      !canHaveVariableDeclarationOrExpression(path) &&
      !canSwapBetweenExpressionAndStatement(path, replacement)
    ) {
      // replacing an expression with a statement so let's explode it
      const newPath = replaceExpressionWithStatements(path, [
        replacement as n.Statement,
      ]);
      return [newPath];
    }
  }

  // let oldNode = path.node;
  // if (oldNode) {
  //   t.inheritsComments(replacement, oldNode);
  //   t.removeComments(oldNode);
  // }

  // replace the node
  return path.replace(replacement);
}
