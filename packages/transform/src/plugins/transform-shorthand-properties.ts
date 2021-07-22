import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { namedTypes as n, PathVisitor } from "@pregenerator/ast-types";

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitObjectProperty(path: NodePath<n.ObjectProperty>) {
      if (path.node.shorthand) {
        path.node.shorthand = false;
      }
      this.traverse(path);
    },
  }),
};

export default plugin;
