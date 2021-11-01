import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { namedTypes as n } from "@pregenerator/ast-types";

export function isCompletionRecord(
  _path: NodePath,
  allowInsideFunction?: boolean
): boolean {
  let path: NodePath | null = _path;
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
    if (
      container &&
      Array.isArray(container.value) &&
      path.name !== container.value.length - 1
    ) {
      return false;
    }
  } while ((path = path.parentPath) && !n.Program.check(path.node));

  return true;
}
