import type { FlowType, UnionTypeAnnotation } from "../../types";
import { unionTypeAnnotation } from "../generated";
import removeTypeDuplicates from "../../modifications/flow/removeTypeDuplicates";

/**
 * Takes an array of `types` and flattens them, removing duplicates and
 * returns a `UnionTypeAnnotation` node containing them.
 */
export default function createFlowUnionType<T extends FlowType>(
  types: [T]
): T | UnionTypeAnnotation {
  const flattened = removeTypeDuplicates(types);

  if (flattened.length === 1) {
    return flattened[0];
  } else {
    return unionTypeAnnotation(flattened);
  }
}
