import * as virtualTypes from "./lib/virtual-types";
import { PATH_CACHE_KEY } from "./constants";
import traverse from "../traverse";
import { assign } from "../../utils";
import Scope from "../scope";
import * as t from "../../types";
import { validate, TYPES } from '../../types';

export default class NodePath {
  constructor(hub, parent) {
    this.parent = parent;
    this.hub = hub;
    this.contexts = [];
    this.data = {};
    this.shouldSkip = false;
    this.shouldStop = false;
    this.removed = false;
    this.state = null;
    this.opts = null;
    this.skipKeys = null;
    this.parentPath = null;
    this.context = null;
    this.container = null;
    this.listKey = null;
    this.inList = false;
    this.parentKey = null;
    this.key = null;
    this.node = null;
    this.scope = null;
    this.type = null;
    this.typeAnnotation = null;
  }

  static get({ hub, parentPath, parent, container, listKey, key }) {
    if (!hub && parentPath) {
      hub = parentPath.hub;
    }

    let targetNode = container[key];

    let paths = parent[PATH_CACHE_KEY] = parent[PATH_CACHE_KEY] || [];
    let path;

    for (let i = 0; i < paths.length; i++) {
      let pathCheck = paths[i];
      if (pathCheck.node === targetNode) {
        path = pathCheck;
        break;
      }
    }

    if (path && !(path instanceof NodePath)) {
      if (path.constructor.name === "NodePath") {
        // we're going to absolutley thrash the tree and allocate way too many node paths
        // than is necessary but there's no way around this as the node module resolution
        // algorithm is ridiculous
        path = null;
      } else {
        // badly deserialised probably
        throw new Error("We found a path that isn't a NodePath instance. Possiblly due to bad serialisation.");
      }
    }

    if (!path) {
      path = new NodePath(hub, parent);
      paths.push(path);
    }

    path.setup(parentPath, container, listKey, key);

    return path;
  }

  getScope(scope) {
    let ourScope = scope;

    // we're entering a new scope so let's construct it!
    if (this.isScope()) {
      ourScope = new Scope(this, scope);
    }

    return ourScope;
  }

  setData(key, val) {
    return this.data[key] = val;
  }

  getData(key, def) {
    let val = this.data[key];
    if (!val && def) val = this.data[key] = def;
    return val;
  }

  traverse(visitor, state) {
    traverse(this.node, visitor, this.scope, state, this);
  }

  mark(type, message) {
    this.hub.file.metadata.marked.push({
      type,
      message,
      loc: this.node.loc
    });
  }

  set(key, node) {
    validate(this.node, key, node);
    this.node[key] = node;
  }

  debug() {
    /* no-op */
  }
}

import * as ancestryMethods from './ancestry';
assign(NodePath.prototype, ancestryMethods);

import * as replacementMethods from './replacement';
assign(NodePath.prototype, replacementMethods);

import * as evaluationMethods from './evaluation';
assign(NodePath.prototype, evaluationMethods);

import * as conversionMethods from './conversion';
assign(NodePath.prototype, conversionMethods);

import * as introspectionMethods from './introspection';
assign(NodePath.prototype, introspectionMethods);

import * as contextMethods from './context';
assign(NodePath.prototype, contextMethods);

import * as removalMethods from './removal';
assign(NodePath.prototype, removalMethods);

import * as modificationMethods from './modification';
assign(NodePath.prototype, modificationMethods);

import * as familyMethods from './family';
assign(NodePath.prototype, familyMethods);

import * as commentsMethods from './comments';
assign(NodePath.prototype, commentsMethods);


for (let type of TYPES) {
  let typeKey = `is${type}`;
  NodePath.prototype[typeKey] = function (opts) {
    return t[typeKey](this.node, opts);
  };

  NodePath.prototype[`assert${type}`] = function (opts) {
    if (!this[typeKey](opts)) {
      throw new TypeError(`Expected node path of type ${type}`);
    }
  };
}

for (let type in virtualTypes) {
  if (type[0] === "_") continue;
  if (TYPES.indexOf(type) < 0) TYPES.push(type);

  let virtualType = virtualTypes[type];

  NodePath.prototype[`is${type}`] = function (opts) {
    return virtualType.checkPath(this, opts);
  };
}
