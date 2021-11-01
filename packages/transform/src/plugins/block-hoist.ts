import stableSort from "stable";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { namedTypes as n, PathVisitor } from "@pregenerator/ast-types";
import { getData } from "../utils/data";

function getHoistPriority(node: n.Node): number {
  let priority = getData<number>(node, "_blockHoist");
  if (priority === undefined) priority = 1;

  // Higher priorities should move toward the top.
  return -1 * priority;
}

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitNode(path: NodePath<n.Node>) {
      this.traverse(path);
      const node = path.node;
      if (!n.Program.check(node) && !n.BlockStatement.check(node)) {
        return;
      }
      let hasChange = false;
      for (let i = 0; i < node.body.length; i++) {
        const bodyNode = node.body[i];
        if (
          bodyNode &&
          getData<number>(bodyNode, "_blockHoist") !== undefined
        ) {
          hasChange = true;
          break;
        }
      }
      if (!hasChange) return;

      node.body = stableSort(
        node.body,
        (a, b) =>
          getHoistPriority(a as n.Node) - getHoistPriority(b as n.Node)
      );
    },
  }),
};

export default plugin;
