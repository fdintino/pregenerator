import type {
  Node,
  ArrowFunctionExpression,
  ClassMethod,
  ExportSpecifier,
  ClassPrivateMethod,
  ObjectMethod,
  VariableDeclarator,
  ClassProperty,
  ClassPrivateProperty,
  ObjectProperty,
  ClassDeclaration,
  ClassExpression,
  AssignmentExpression,
  AssignmentPattern,
  ObjectTypeProperty,
  TSEnumMember,
  TSPropertySignature,
  MemberExpression,
  JSXMemberExpression,
  OptionalMemberExpression,
  ExportNamedDeclaration,
} from "../types";
import has from "../utils/has";

/**
 * Check if the input `node` is a reference to a bound variable.
 */
export default function isReferenced(
  node: Node,
  parent: Node,
  grandparent?: Node
): boolean {
  switch (parent.type) {
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.NODE
    case "MemberExpression":
    case "JSXMemberExpression":
    case "OptionalMemberExpression":
      if (
        (parent as
          | MemberExpression
          | JSXMemberExpression
          | OptionalMemberExpression).property === node
      ) {
        return !has(parent, "computed") || !!parent.computed;
      }
      return has(parent, "object") && parent.object === node;

    // no: let NODE = init;
    // yes: let id = NODE;
    case "VariableDeclarator":
      return (parent as VariableDeclarator).init === node;

    // yes: () => NODE
    // no: (NODE) => {}
    case "ArrowFunctionExpression":
      return (parent as ArrowFunctionExpression).body === node;

    // no: export { foo as NODE };
    // yes: export { NODE as foo };
    // no: export { NODE as foo } from "foo";
    case "ExportSpecifier":
      if (grandparent && (grandparent as ExportNamedDeclaration).source) {
        return false;
      }
      return (parent as ExportSpecifier).local === node;

    // no: class { #NODE; }
    // no: class { get #NODE() {} }
    // no: class { #NODE() {} }
    // no: class { fn() { return this.#NODE; } }
    case "PrivateName":
      return false;

    // no: class { NODE() {} }
    // yes: class { [NODE]() {} }
    // no: class { foo(NODE) {} }
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "ObjectMethod":
      if (
        (parent as
          | ClassMethod
          | ClassPrivateMethod
          | ObjectMethod).params.includes(node)
      ) {
        return false;
      }
    // fall through

    // yes: { [NODE]: "" }
    // no: { NODE: "" }
    // depends: { NODE }
    // depends: { key: NODE }
    // fall through
    case "ObjectProperty":
    // no: class { NODE = value; }
    // yes: class { [NODE] = value; }
    // yes: class { key = NODE; }
    // fall through
    case "ClassProperty":
    case "ClassPrivateProperty":
      if (
        (parent as ObjectProperty | ClassProperty | ClassPrivateProperty)
          .key === node
      ) {
        return !has(parent, "computed") || !!parent.computed;
      }
      if (
        (parent as ObjectProperty | ClassProperty | ClassPrivateProperty)
          .value === node
      ) {
        return !grandparent || grandparent.type !== "ObjectPattern";
      }
      return true;

    // no: class NODE {}
    // yes: class Foo extends NODE {}
    case "ClassDeclaration":
    case "ClassExpression":
      return (parent as ClassDeclaration | ClassExpression).superClass === node;

    // yes: left = NODE;
    // no: NODE = right;
    case "AssignmentExpression":
      return (parent as AssignmentExpression).right === node;

    // no: [NODE = foo] = [];
    // yes: [foo = NODE] = [];
    case "AssignmentPattern":
      return (parent as AssignmentPattern).right === node;

    // no: NODE: for (;;) {}
    case "LabeledStatement":
      return false;

    // no: try {} catch (NODE) {}
    case "CatchClause":
      return false;

    // no: function foo(...NODE) {}
    case "RestElement":
      return false;

    case "BreakStatement":
    case "ContinueStatement":
      return false;

    // no: function NODE() {}
    // no: function foo(NODE) {}
    case "FunctionDeclaration":
    case "FunctionExpression":
      return false;

    // no: export NODE from "foo";
    // no: export * as NODE from "foo";
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return false;

    // no: import NODE from "foo";
    // no: import * as NODE from "foo";
    // no: import { NODE as foo } from "foo";
    // no: import { foo as NODE } from "foo";
    // no: import NODE from "bar";
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
      return false;

    // no: <div NODE="foo" />
    case "JSXAttribute":
      return false;

    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    case "ObjectPattern":
    case "ArrayPattern":
      return false;

    // no: new.NODE
    // no: NODE.target
    case "MetaProperty":
      return false;

    // yes: type X = { somePropert: NODE }
    // no: type X = { NODE: OtherType }
    case "ObjectTypeProperty":
      return (parent as ObjectTypeProperty).key !== node;

    // yes: enum X { Foo = NODE }
    // no: enum X { NODE }
    case "TSEnumMember":
      return (parent as TSEnumMember).id !== node;

    // yes: { [NODE]: value }
    // no: { NODE: value }
    case "TSPropertySignature":
      if ((parent as TSPropertySignature).key === node) {
        return !!(parent as TSPropertySignature).computed;
      }

      return true;
  }

  return true;
}
