import { namedTypes as n } from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";

export function isReferenced(
  node: n.Node,
  parent: n.Node,
  grandparent?: n.Node
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
    if ((parent.params as n.Node[]).includes(node)) {
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
  if (!parent?.node) {
    return false;
  }
  const grandparent = parent?.parent ? parent.parent?.node : undefined;
  return isReferenced(node, parent.node, grandparent);
}

// interface IdentifierKeyValue<T> = Array<

export type BindingIdentifiers = Partial<
  {
    [P in n.Node["type"]]: ReadonlyArray<
      keyof Extract<n.Node, { type: P }>
    >;
  }
>;

export const bindingIdentifierKeys: BindingIdentifiers = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
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
  node: n.Node,
  parent: n.Node,
  grandparent?: n.Node
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

export function isBindingIdentifier(
  path: NodePath | null | undefined
): path is NodePath<n.Identifier> {
  if (!path) {
    return false;
  }
  const { node } = path;
  const parent = path.parent?.node;
  if (!parent) {
    return false;
  }
  const grandparent =
    path.parent && path.parent.parent ? path.parent.parent.node : undefined;
  return isBinding(node, parent, grandparent);
}

type Loop =
  | n.DoWhileStatement
  | n.ForInStatement
  | n.ForStatement
  | n.WhileStatement
  | n.ForOfStatement;

export function isLoop(node: n.Node | null | undefined): node is Loop {
  if (!node) return false;

  const nodeType = node.type;
  return (
    // nodeType === "Loop" ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ForOfStatement" === nodeType
  );
}

export function getBindingIdentifiers(
  node: n.Node,
  duplicates: true,
  outerOnly?: boolean
): Record<string, Array<n.Identifier>>;

export function getBindingIdentifiers(
  node: n.Node,
  duplicates?: false,
  outerOnly?: boolean
): Record<string, n.Identifier>;

export function getBindingIdentifiers(
  node: n.Node,
  duplicates?: boolean,
  outerOnly?: boolean
): Record<string, n.Identifier> | Record<string, Array<n.Identifier>>;

/**
 * Return a list of binding identifiers associated with the input `node`.
 */
export function getBindingIdentifiers(
  node: n.Node,
  duplicates?: boolean,
  outerOnly?: boolean
): Record<string, n.Identifier> | Record<string, Array<n.Identifier>> {
  const search: Array<n.Node> = [node];
  const ids: Record<string, n.Identifier | Array<n.Identifier>> = {};

  while (search.length) {
    const id = search.shift();
    if (!id) continue;

    if (n.Identifier.check(id)) {
      if (duplicates) {
        const _ids = (ids[id.name] = ids[id.name] || []) as n.Identifier[];
        _ids.push(id);
      } else {
        ids[id.name] = id;
      }
      continue;
    }

    if (n.ExportDeclaration.check(id) && !n.ExportAllDeclaration.check(id)) {
      if (n.Declaration.check(id.declaration)) {
        search.push(id.declaration);
      }
      continue;
    }

    if (outerOnly) {
      if (n.FunctionDeclaration.check(id)) {
        if (id.id) {
          search.push(id.id);
        }
        continue;
      }

      if (n.FunctionExpression.check(id)) {
        continue;
      }
    }

    const keys = bindingIdentifierKeys[id.type];
    if (Array.isArray(keys)) {
      const keysSet = new Set(keys);
      for (const k in id) {
        if (!keysSet.has(k as string)) continue;
        const v = (id as Record<string, any>)[k] as any;
        if (Array.isArray(v)) {
          v.forEach((idNode: n.Node) => {
            // n.Identifier.assert(idNode);
            search.push(idNode);
          });
        } else {
          // n.Identifier.assert(v);
          search.push(v);
        }
      }
      // Object.entries(id).forEach(([k, v]) => {
      //   if (!keysSet.has(k as string)) return;
      //   if (Array.isArray(v)) {
      //     v.forEach((idNode: n.Node) => {
      //       // n.Identifier.assert(idNode);
      //       search.push(idNode);
      //     });
      //   } else {
      //     // n.Identifier.assert(v);
      //     search.push(v);
      //   }
      // });
    }
  }

  // $FlowIssue Object.create() seems broken
  if (duplicates) {
    return ids as Record<string, Array<n.Identifier>>;
  } else {
    return ids as Record<string, n.Identifier>;
  }
}

export function getBindingIdentifierPaths(
  path: NodePath<n.Node>,
  duplicates: true,
  outerOnly?: boolean
): Record<string, Array<NodePath<n.Identifier>>>;

export function getBindingIdentifierPaths(
  path: NodePath<n.Node>,
  duplicates?: false,
  outerOnly?: boolean
): Record<string, NodePath<n.Identifier>>;

export function getBindingIdentifierPaths(
  path: NodePath<n.Node>,
  duplicates?: boolean,
  outerOnly?: boolean
):
  | Record<string, NodePath<n.Identifier>>
  | Record<string, Array<NodePath<n.Identifier>>>;

/**
 * Return a list of binding identifiers associated with the input `node`.
 */
export function getBindingIdentifierPaths(
  path: NodePath<n.Node>,
  duplicates?: boolean,
  outerOnly?: boolean
):
  | Record<string, NodePath<n.Identifier>>
  | Record<string, Array<NodePath<n.Identifier>>> {
  const search: Array<NodePath<n.Node>> = [path];
  const ids: Record<
    string,
    NodePath<n.Identifier> | Array<NodePath<n.Identifier>>
  > = {};

  while (search.length) {
    const idPath = search.shift();
    if (!idPath || !idPath.node) continue;
    const id = idPath.node;

    if (n.Identifier.check(id)) {
      if (duplicates) {
        const _ids = (ids[id.name] = ids[id.name] || []) as Array<
          NodePath<n.Identifier>
        >;
        _ids.push(idPath as NodePath<n.Identifier>);
      } else {
        ids[id.name] = idPath as NodePath<n.Identifier>;
      }
      continue;
    }

    if (n.ExportDeclaration.check(id) && !n.ExportAllDeclaration.check(id)) {
      if (n.Declaration.check(id.declaration)) {
        search.push(idPath.get("declaration"));
      }
      continue;
    }

    if (outerOnly) {
      if (n.FunctionDeclaration.check(id)) {
        if (id.id) {
          search.push(idPath.get("id"));
        }
        continue;
      }

      if (n.FunctionExpression.check(id)) {
        continue;
      }
    }

    const keys = bindingIdentifierKeys[id.type];
    if (Array.isArray(keys)) {
      const keysSet = new Set(keys);
      for (const k in id) {
        if (!keysSet.has(k as string)) continue;
        const v = (id as Record<string, any>)[k] as any;
        if (Array.isArray(v)) {
          v.forEach((idNode: n.Node, i) => {
            // n.Identifier.assert(idNode);
            search.push(idPath.get(k, i));
          });
        } else {
          // n.Identifier.assert(v);
          search.push(idPath.get(k));
        }
      }
      // Object.entries(id).forEach(([k, v]) => {
      //   if (!keysSet.has(k as string)) return;
      //   if (Array.isArray(v)) {
      //     v.forEach((idNode: n.Node) => {
      //       // n.Identifier.assert(idNode);
      //       search.push(idNode);
      //     });
      //   } else {
      //     // n.Identifier.assert(v);
      //     search.push(v);
      //   }
      // });
    }
  }

  // $FlowIssue Object.create() seems broken
  if (duplicates) {
    return ids as Record<string, Array<NodePath<n.Identifier>>>;
  } else {
    return ids as Record<string, NodePath<n.Identifier>>;
  }
}

// type IGetOuterBindingIdentifersFn = {
//   (node: n.Node, duplicates: true): Record<string, Array<n.Identifier>>;
//   (node: n.Node, duplicates?: false): Record<string, n.Identifier>;
//   (node: n.Node, duplicates?: boolean):
//     | Record<string, n.Identifier>
//     | Record<string, Array<n.Identifier>>;
// };
//
// export default getOuterBindingIdentifiers as {
//   (node: n.Node, duplicates: true): Record<string, Array<n.Identifier>>;
//   (node: n.Node, duplicates?: false): Record<string, n.Identifier>;
//   (node: n.Node, duplicates?: boolean):
//     | Record<string, n.Identifier>
//     | Record<string, Array<n.Identifier>>;
// };

// export function getOuterBidingIdentifiers as IGetOuterBindingIdentifersFn(): (node: n.Node, duplicates?: boolean):
//   | Record<string, n.Identifier>
//   | Record<string, Array<n.Identifier>> {
//     return getBindingIdentifiers(node, duplicates, true);
//   }
//
// export function getOuterBindingIdentifiers(
// (node: n.Node, duplicates: true): Record<string, Array<n.Identifier>>;
// (node: n.Node, duplicates?: false): Record<string, n.Identifier>;
// (node: n.Node, duplicates?: boolean):
//   | Record<string, n.Identifier>
//   | Record<string, Array<n.Identifier>>;
// ): Record<string, n.Identifier> | Record<string, Array<n.Identifier>> {
//   return getBindingIdentifiers(node, duplicates, true);
// }
