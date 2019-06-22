import TraversalContext from "./context";
import * as visitors from "./visitors";
import * as messages from "./messages";
import { includes } from "../utils";
import { VISITOR_KEYS } from "../types";

export default function traverse(parent, opts, scope, state, parentPath) {
  if (!parent) return;
  if (!opts) opts = {};

  if (!opts.noScope && !scope) {
    if (parent.type !== "Program" && parent.type !== "File") {
      throw new Error(messages.get("traverseNeedsParent", parent.type));
    }
  }

  visitors.explode(opts);

  traverse.node(parent, opts, scope, state, parentPath);
}

traverse.node = function node_(node, opts, scope, state, parentPath, skipKeys) {
  let keys = VISITOR_KEYS[node.type];
  if (!keys) return;
  let context = new TraversalContext(scope, opts, state, parentPath);

  for (let key of keys) {
    if (skipKeys && skipKeys[key]) continue;
    if (context.visit(node, key)) return;
  }
};
