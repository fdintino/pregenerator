import TraversalContext from "./context";
import * as visitors from "./visitors";
import * as messages from "./messages";
import { includes } from "../utils";
import * as t from "../types";
import { default as traverse } from "./traverse";
import { default as NodePath } from "./path";

export { NodePath };

import { default as Scope } from "./scope";
import { default as Hub } from "./hub";

export { Scope, Hub };

export { visitors };

export default traverse;

traverse.visitors = visitors;
traverse.verify = visitors.verify;
traverse.explode = visitors.explode;

traverse.NodePath = NodePath;
traverse.Scope = Scope;
traverse.Hub = Hub;

traverse.cheap = function cheap(node, enter) {
  if (!node) return;

  let keys = t.VISITOR_KEYS[node.type];
  if (!keys) return;

  enter(node);

  for (let key of keys) {
    let subNode = node[key];

    if (Array.isArray(subNode)) {
      for (let node of subNode) {
        traverse.cheap(node, enter);
      }
    } else {
      traverse.cheap(subNode, enter);
    }
  }
};

const CLEAR_KEYS = t.COMMENT_KEYS.concat(["tokens", "comments", "start", "end", "loc", "raw", "rawValue"]);

traverse.clearNode = function clearNode(node) {
  for (let key of CLEAR_KEYS) {
    if (node[key] != null) node[key] = undefined;
  }

  for (let key in node) {
    if (key[0] === "_" && node[key] != null) node[key] = undefined;
    if (key[0] === "@" && node[key] != null) node[key] = null;
  }
  if (typeof Object.getOwnPropertySymbols === 'function') {
    let syms = Object.getOwnPropertySymbols(node);
    for (let sym of syms) {
      node[sym] = null;
    }
  }
};

traverse.removeProperties = function removeProperties(tree) {
  traverse.cheap(tree, traverse.clearNode);
  return tree;
};

function hasBlacklistedType(path, state) {
  if (path.node.type === state.type) {
    state.has = true;
    path.skip();
  }
}

traverse.hasType = function hasType(tree, scope, type, blacklistTypes) {
  // the node we're searching in is blacklisted
  if (includes(blacklistTypes, tree.type)) return false;

  // the type we're looking for is the same as the passed node
  if (tree.type === type) return true;

  let state = {
    has: false,
    type: type
  };

  traverse(tree, {
    blacklist: blacklistTypes,
    enter: hasBlacklistedType
  }, scope, state);

  return state.has;
};
