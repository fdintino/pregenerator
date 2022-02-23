import type { NodePath, Scope } from "@pregenerator/ast-types";
import { getBindingIdentifier } from "./scope";
import { namedTypes as n, PathVisitor } from "@pregenerator/ast-types";
import { getBindingIdentifiers, isReferencedIdentifier } from "./validation";

function getBindingIdentifierNode(
  scope: Scope,
  name: string
): n.Identifier | null {
  const bindingId = getBindingIdentifier(scope, name);
  return bindingId ? bindingId.node : null;
}

export type Scopeable =
  | n.BlockStatement
  | n.CatchClause
  | n.DoWhileStatement
  | n.ForInStatement
  | n.ForStatement
  | n.FunctionDeclaration
  | n.FunctionExpression
  | n.Program
  | n.ObjectMethod
  | n.SwitchStatement
  | n.WhileStatement
  | n.ArrowFunctionExpression
  | n.ClassExpression
  | n.ClassDeclaration
  | n.ForOfStatement
  | n.ClassMethod
  | n.ClassPrivateMethod;

export type Method = n.ObjectMethod | n.ClassMethod | n.ClassPrivateMethod;

export function isMethod(node: n.Node): node is Method {
  const nodeType = node.type;
  return (
    "ObjectMethod" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType
  );
}

function isScopeable(node: n.Node): node is Scopeable {
  const nodeType = node.type;
  return (
    "BlockStatement" === nodeType ||
    "CatchClause" === nodeType ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "Program" === nodeType ||
    "ObjectMethod" === nodeType ||
    "SwitchStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ClassExpression" === nodeType ||
    "ClassDeclaration" === nodeType ||
    "ForOfStatement" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType
  );
}

export function isScope(
  path: NodePath
): path is NodePath<n.BlockStatement | n.Pattern | Scopeable> {
  const { node, parent } = path;
  // If a BlockStatement is an immediate descendent of a Function/CatchClause, it must be in the body.
  // Hence we skipped the parentKey === "params" check
  if (
    n.BlockStatement.check(node) &&
    parent &&
    (n.Function.check(parent.node) || n.CatchClause.check(parent.node))
  ) {
    return false;
  }

  // If a Pattern is an immediate descendent of a Function/CatchClause, it must be in the params.
  // Hence we skipped the parentKey === "params" check
  if (
    n.Pattern.check(node) &&
    parent &&
    (n.Function.check(parent.node) || n.CatchClause.check(parent.node))
  ) {
    return true;
  }

  return isScopeable(node);
}

const renameVisitor = PathVisitor.fromMethodsObject<Renamer>({
  // reset(path: NodePath<n.Node>, state: Renamer) {
  //   this.state = state;
  // },
  visitNode(path: NodePath<n.Node>, state: Renamer) {
    const { node } = path;
    // const state = this.state as Renamer;
    if (n.Identifier.check(node)) {
      if (isReferencedIdentifier(path) && node.name === state.oldName) {
        node.name = state.newName;
        path.scope?.scan(true);
      }
      return false;
    } else if (
      n.Declaration.check(node) ||
      n.AssignmentExpression.check(node) ||
      n.VariableDeclarator.check(node)
    ) {
      if (n.VariableDeclaration.check(path.node)) {
        this.traverse(path);
        return false;
      }
      const ids = getBindingIdentifiers(path.node, false, true) as Record<
        string,
        n.Identifier
      >;

      let changed = false;
      for (const name in ids) {
        if (name === state.oldName) {
          ids[name].name = state.newName;
          changed = true;
        }
      }
      if (changed) {
        path.scope?.scan(true);
      }
    }
    if (isScope(path)) {
      if (
        getBindingIdentifierNode(path.scope as Scope, state.oldName) ===
        state.binding.node
      ) {
        if (isMethod(node) && node.computed) {
          this.traverse(path.get("key"));
          return false;
        }
      }
    }
    this.traverse(path);
  },
});

export default class Renamer {
  constructor(
    scope: Scope,
    binding: NodePath<n.Identifier>,
    oldName: string,
    newName: string
  ) {
    this.scope = scope;
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }

  declare scope: Scope;
  declare oldName: string;
  declare newName: string;
  declare binding: NodePath<n.Identifier>;

  rename(block?: NodePath<n.Node>): void {
    const { scope } = this;

    const blockToTraverse = block || scope.path;
    const { node } = blockToTraverse;
    if (node.type === "SwitchStatement") {
      for (let i = 0; i < node.cases.length; i++) {
        renameVisitor.visit(blockToTraverse.get("cases").get(i), this);
      }
    } else {
      renameVisitor.visit(blockToTraverse, this);
    }

    if (!block) {
      // const oldBindingId = getBindingIdentifierNode(scope, oldName);
      // const newBindingId = getBindingIdentifierNode(scope, newName);
      // const bindings1 = scope.getBindings();
      // scope.scan(true);
      //
      // const bindings = scope.getBindings();
      // const binding = bindings[newName] as Array<NodePath<n.Identifier>>;
      // if (!binding.length || !binding[0] || !binding[0].node) {
      //   throw new Error("heyo");
      // }
      // assert.ok((scope as any).ref === binding[0].node);
      // assert.ok(binding[0].node.name === newName);
      // if (bindings[oldName] && bindings[oldName].length) {
      //   bindings[oldName][0].value = binding.node;
      // }
      // bindings[newName] = bindings[oldName];
      // delete bindings[oldName];
      // // binding.forEach((path: NodePath<n.Identifier>) => {
      // //   path.node.name = newName;
      // // });
      // // this.id.name = newName;
      // binding.node.name = newName;
      // // binding.name = newName;
      // // scope.removeOwnBinding(oldName);
      // // scope.bindings[newName] = binding;
      // // this.binding.identifier.name = newName;
    }
  }
}

export function rename(
  scope: Scope,
  oldName: string,
  newName?: string,
  block?: NodePath<n.Node>
): void {
  const binding = getBindingIdentifier(scope, oldName);
  if (binding) {
    if (!newName) {
      newName = scope.declareTemporary(oldName).name as string;
      delete scope.bindings[newName];
      binding.node.name = newName;
    }
    const renamer = new Renamer(scope, binding, oldName, newName as string);
    renamer.rename(block);
  }
}
