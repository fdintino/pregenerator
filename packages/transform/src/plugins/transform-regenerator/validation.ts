import { namedTypes as n } from "ast-types";
import type { NodePath } from "ast-types/lib/node-path";

export function isReferenced(
  node: n.ASTNode,
  parent: n.ASTNode,
  grandparent?: n.ASTNode
): boolean {
  if (
    n.MemberExpression.check(parent) ||
    n.OptionalMemberExpression.check(parent) ||
    n.JSXMemberExpression.check(parent)
  ) {
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.NODE
    if (parent.property === node) {
      return parent.type === "JSXMemberExpression" || !!parent.computed;
    }
  } else if (n.VariableDeclarator.check(parent)) {
    // no: let NODE = init;
    // yes: let id = NODE;
    return parent.init === node;
  } else if (n.ArrowFunctionExpression.check(parent)) {
    // yes: () => NODE
    // no: (NODE) => {}
    return (parent as n.ArrowFunctionExpression).body === node;
  } else if (n.PrivateName.check(parent)) {
    // no: class { #NODE; }
    // no: class { get #NODE() {} }
    // no: class { #NODE() {} }
    // no: class { fn() { return this.#NODE; } }
    return false;
  } else if (
    n.ClassMethod.check(parent) ||
    n.ClassPrivateMethod.check(parent) ||
    n.ObjectMethod.check(parent)
  ) {
    // no: class { NODE() {} }
    // yes: class { [NODE]() {} }
    // no: class { foo(NODE) {} }
    if ((parent.params as n.ASTNode[]).includes(node)) {
      return false;
    }
  }
  if (
    n.ClassMethod.check(parent) ||
    n.ClassPrivateMethod.check(parent) ||
    n.ObjectMethod.check(parent) ||
    n.ObjectProperty.check(parent) ||
    n.ClassProperty.check(parent) ||
    n.ClassPrivateProperty.check(parent)
  ) {
    // yes: { [NODE]: "" }
    // no: { NODE: "" }
    // depends: { NODE }
    // depends: { key: NODE }
    // no: class { NODE = value; }
    // yes: class { [NODE] = value; }
    // yes: class { key = NODE; }
    if (parent.key === node) {
      return (
        parent.type === "ClassPrivateMethod" ||
        parent.type === "ClassPrivateProperty" ||
        !!parent.computed
      );
    }
    if (
      parent.type !== "ObjectMethod" &&
      parent.type !== "ClassMethod" &&
      parent.type !== "ClassPrivateMethod" &&
      parent.value === node
    ) {
      return !grandparent || grandparent.type !== "ObjectPattern";
    }
    return true;
  } else if (
    n.ClassDeclaration.check(parent) ||
    n.ClassExpression.check(parent)
  ) {
    // no: class NODE {}
    // yes: class Foo extends NODE {}
    return parent.superClass === node;
  } else if (
    n.AssignmentExpression.check(parent) ||
    n.AssignmentPattern.check(parent)
  ) {
    // yes: left = NODE;
    // no: NODE = right;
    // yes: [foo = NODE] = [];
    // no: [NODE = foo] = [];
    return parent.right === node;
  } else if (n.LabeledStatement.check(parent)) {
    // no: NODE: for (;;) {}
    return false;
  } else if (n.CatchClause.check(parent)) {
    // no: try {} catch (NODE) {}
    return false;
  } else if (n.RestElement.check(parent)) {
    // no: function foo(...NODE) {}
    return false;
  } else if (
    n.BreakStatement.check(parent) ||
    n.ContinueStatement.check(parent)
  ) {
    return false;
  } else if (
    n.FunctionDeclaration.check(parent) ||
    n.FunctionExpression.check(parent)
  ) {
    // no: function NODE() {}
    // no: function foo(NODE) {}
    return false;
  } else if (
    n.ExportNamespaceSpecifier.check(parent) ||
    n.ExportDefaultSpecifier.check(parent)
  ) {
    // no: export NODE from "foo";
    // no: export * as NODE from "foo";
    return false;
  } else if (n.ExportSpecifier.check(parent)) {
    // no: export { foo as NODE };
    // yes: export { NODE as foo };
    // no: export { NODE as foo } from "foo";
    if (
      (n.ExportNamedDeclaration.check(grandparent) ||
        n.ExportAllDeclaration.check(grandparent)) &&
      grandparent.source
    ) {
      return false;
    }
    return parent.local === node;
  } else if (
    n.ImportDefaultSpecifier.check(parent) ||
    n.ImportNamespaceSpecifier.check(parent) ||
    n.ImportSpecifier.check(parent)
  ) {
    // no: import NODE from "foo";
    // no: import * as NODE from "foo";
    // no: import { NODE as foo } from "foo";
    // no: import { foo as NODE } from "foo";
    // no: import NODE from "bar";
    return false;
  } else if (n.JSXAttribute.check(parent)) {
    // no: <div NODE="foo" />
    return false;
  } else if (n.ObjectPattern.check(parent) || n.ArrayPattern.check(parent)) {
    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    return false;
  } else if (n.MetaProperty.check(parent)) {
    // no: new.NODE
    // no: NODE.target
    return false;
  } else if (n.ObjectTypeProperty.check(parent)) {
    // yes: type X = { somePropert: NODE }
    // no: type X = { NODE: OtherType }
    return parent.key !== node;
  } else if (n.TSEnumMember.check(parent)) {
    // yes: enum X { Foo = NODE }
    // no: enum X { NODE }
    return parent.id !== node;
  } else if (n.TSPropertySignature.check(parent)) {
    // yes: { [NODE]: value }
    // no: { NODE: value }
    if (parent.key === node) {
      return !!parent.computed;
    }
    return true;
  }
  return true;
}

export function isReferencedIdentifier(path: NodePath): boolean {
  const { node, parent } = path;
  if (!n.Identifier.check(node)) {
    return false;
  }
  if (!parent.node) {
    return false;
  }
  const grandparent = parent.parent ? parent.parent.node : undefined;
  return isReferenced(node, parent.node, grandparent);
}

// interface IdentifierKeyValue<T> = Array<

export type BindingIdentifiers = Partial<
  {
    [P in n.ASTNode["type"]]: ReadonlyArray<
      keyof Extract<n.ASTNode, { type: P }>
    >;
  }
>;

export const bindingIdentifierKeys: BindingIdentifiers = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],

  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],

  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],

  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],

  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],

  ForInStatement: ["left"],
  ForOfStatement: ["left"],

  ClassDeclaration: ["id"],
  ClassExpression: ["id"],

  RestElement: ["argument"],
  UpdateExpression: ["argument"],

  ObjectProperty: ["value"],

  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],

  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"],
} as const;

export function isBinding(
  node: n.ASTNode,
  parent: n.ASTNode,
  grandparent?: n.ASTNode
): boolean {
  if (
    grandparent &&
    node.type === "Identifier" &&
    parent.type === "ObjectProperty" &&
    grandparent.type === "ObjectExpression"
  ) {
    // We need to special-case this, because getBindingIdentifiers
    // has an ObjectProperty->value entry for destructuring patterns.
    return false;
  }

  const keys = bindingIdentifierKeys[parent.type];
  if (keys) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Element implicitly has an 'any' type
      const val = parent[key];
      if (Array.isArray(val)) {
        if (val.indexOf(node) >= 0) return true;
      } else {
        if (val === node) return true;
      }
    }
  }

  return false;
}

export function isBindingIdentifier(path: NodePath): boolean {
  const { node } = path;
  const parent = path.parent.node;
  if (!parent) {
    return false;
  }
  const grandparent =
    path.parent && path.parent.parent ? path.parent.parent.node : undefined;
  return isBinding(node, parent, grandparent);
}
