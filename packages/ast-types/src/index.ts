import { namedTypes } from "./gen/namedTypes";

import * as t from "./lib/types";
import {
  // namedTypes as n,
  Type,
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
import { Path } from "./lib/path";
import { NodePath } from "./lib/node-path";
// import { namedTypes } from "./gen/namedTypes";
// import { builders } from "./gen/builders";
import { Visitor } from "./gen/visitor";
import { astNodesAreEquivalent } from "./lib/equiv";

import "./def/core";
import "./def/es6";
import "./def/es2016";
import "./def/es2017";
import "./def/es2018";
import "./def/es2019";
import "./def/es2020";
import "./def/jsx";
import "./def/flow";
import "./def/esprima";
import "./def/babel";
import "./def/typescript";
import "./def/es-proposals";

// Object.assign(n, namedTypes);

const visit = PathVisitor.visit;

// Populate the exported fields of the namedTypes namespace, while still
// retaining its member types.
Object.assign(namedTypes, t.namedTypes);
namedTypes.ASTNode = namedTypes.Node;
// const { namedTypes } = N;

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
  Path,
  Visitor,
  PathVisitor,
  someField,
  Type,
  Field,
  ASTNode,
  Builder,
  AnyType,
  visit,
};
