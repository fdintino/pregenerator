import type { NodePath } from "@pregenerator/ast-types";
import { namedTypes as n, PathVisitor } from "@pregenerator/ast-types";
import { arrowFunctionToExpression } from "../utils/conversion";

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitArrowFunctionExpression(path: NodePath<n.ArrowFunctionExpression>) {
      arrowFunctionToExpression(path);
      this.traverse(path);
    },
  }),
};

export default plugin;

// export default () => ({
//   visitor: {
//     ArrowFunctionExpression(path) {
//       // In some conversion cases, it may have already been converted to a function while this callback
//       // was queued up.
//       if (!path.isArrowFunctionExpression()) return;
//
//       path.arrowFunctionToExpression({
//         // While other utils may be fine inserting other arrows to make more transforms possible,
//         // the arrow transform itself absolutely cannot insert new arrow functions.
//         allowInsertArrow: false,
//       });
//     }
//   },
// });
