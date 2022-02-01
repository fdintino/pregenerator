import { namedTypes } from "./gen/namedTypes";

import * as t from "./lib/types";
import traverse from "./lib/traverse";
import type {
  TraversalAncestors,
  TraversalHandler,
  TraversalHandlers,
} from "./lib/traverse";
import {
  Type,
  PredicateType,
  Field,
  ASTNode,
  Builder,
  shallowStringify,
  BuiltInTypes,
  builtInTypes,
  AnyType,
  defFromValue,
  getSupertypeNames,
  computeSupertypeLookupTable,
  builders,
  defineMethod,
  getBuilderName,
  getFieldNames,
  getFieldValue,
  eachField,
  someField,
  finalize,
} from "./lib/types";
import { PathVisitor } from "./lib/path-visitor";
import { NodePath } from "./lib/node-path";
import { Scope } from "./lib/scope";
import { Visitor } from "./gen/visitor";
import { astNodesAreEquivalent } from "./lib/equiv";

import "./def/core";
import "./def/es6";
import "./def/babel";
import "./def/typescript";
import "./def/es-proposals";

const visit = PathVisitor.visit;

// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes, t.namedTypes);

export {
  astNodesAreEquivalent,
  shallowStringify,
  builders,
  builtInTypes,
  BuiltInTypes,
  defineMethod,
  eachField,
  finalize,
  getBuilderName,
  getFieldNames,
  getFieldValue,
  defFromValue,
  getSupertypeNames,
  computeSupertypeLookupTable,
  namedTypes,
  NodePath,
  Scope,
  Visitor,
  PathVisitor,
  someField,
  Type,
  PredicateType,
  Field,
  ASTNode,
  Builder,
  AnyType,
  visit,
  traverse,
};

export type { TraversalAncestors, TraversalHandler, TraversalHandlers };
