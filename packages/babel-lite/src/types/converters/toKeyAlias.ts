import type { Method, Property, Node } from "../types";
import { isIdentifier, isStringLiteral } from "../validators/generated";
import cloneNode from "../clone/cloneNode";
import removePropertiesDeep from "../modifications/removePropertiesDeep";
import has from "../utils/has";

export default function toKeyAlias(
  node: Method | Property,
  key?: Node
): string {
  let alias;

  if (has(node, "kind") && node.kind === "method") {
    return toKeyAlias.increment() + "";
  } else if (isIdentifier(key)) {
    alias = key.name;
  } else if (isStringLiteral(key)) {
    alias = JSON.stringify(key.value);
  } else {
    alias = JSON.stringify(removePropertiesDeep(cloneNode(key)));
  }

  if (has(node, "computed") && node.computed) {
    alias = `[${alias}]`;
  }

  if (has(node, "static") && node.static) {
    alias = `static:${alias}`;
  }

  return alias;
}

toKeyAlias.uid = 0;

toKeyAlias.increment = function () {
  if (toKeyAlias.uid >= Number.MAX_SAFE_INTEGER) {
    return (toKeyAlias.uid = 0);
  } else {
    return toKeyAlias.uid++;
  }
};
