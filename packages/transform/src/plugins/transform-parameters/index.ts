import convertFunctionParams from "./params";
import convertFunctionRest from "./rest";
import { arrowFunctionToExpression } from "../../utils/conversion";

import { namedTypes as n, PathVisitor } from "@pregenerator/ast-types";

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitFunction(path) {
      const { node } = path;
      if (
        n.ArrowFunctionExpression.check(node) &&
        path
          .get("params")
          .value.some(
            (param) =>
              n.RestElement.check(param) || n.AssignmentPattern.check(param)
          )
      ) {
        // default/rest visitors require access to `arguments`, so it cannot be an arrow
        arrowFunctionToExpression(path);
      }

      const convertedRest = convertFunctionRest(this, path);
      const convertedParams = convertFunctionParams(path);

      if (convertedRest || convertedParams) {
        // Manually reprocess this scope to ensure that the moved params are updated.
        path.scope?.scan(true);
      }
      this.traverse(path);
    },
  }),
};

export default plugin;
