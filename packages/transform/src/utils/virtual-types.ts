import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { namedTypes as n } from "@pregenerator/ast-types";

export type While = n.DoWhileStatement | n.WhileStatement;
export type ForX = n.ForInStatement | n.ForOfStatement;
export type For = n.ForStatement | ForX;

export type Loop = While | For;

export function isForX(node: n.ASTNode | null | undefined): node is ForX {
  return n.ForInStatement.check(node) || n.ForOfStatement.check(node);
}

export function isFor(node: n.ASTNode | null | undefined): node is For {
  return isForX(node) || n.ForStatement.check(node);
}

export function isWhile(node: n.ASTNode | null | undefined): node is While {
  return n.DoWhileStatement.check(node) || n.WhileStatement.check(node);
}

export function isLoop(node: n.ASTNode | null | undefined): node is Loop {
  if (!node) return false;

  return isWhile(node) || isFor(node);
}

export function isCompletionRecord(
  _path: NodePath,
  allowInsideFunction?: boolean
): boolean {
  let path: NodePath = _path;
  let first = true;

  do {
    const container = path.parentPath;

    // we're in a function so can't be a completion record
    if (n.Function.check(path.node) && !first) {
      return !!allowInsideFunction;
    }

    first = false;

    // check to see if we're the last item in the container and if we are
    // we're a completion record!
    if (Array.isArray(container.value) && path.name !== container.value.length - 1) {
      return false;
    }
  } while ((path = path.parentPath) && !n.Program.check(path.node));

  return true;
}
