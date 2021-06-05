import blockScopingPlugin from "./transform-block-scoping";
import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  builtInTypes,
} from "@pregenerator/ast-types";
import { setData } from "../utils/data";
import { toExpression } from "../utils/conversion";

const blockScopingVisitor = blockScopingPlugin.visitor;

function statementList<T extends n.ASTNode>(
  path: NodePath<T, T>,
  key: keyof T
): boolean {
  let hasChanges = false;

  const { node } = path;

  const child = node[key];
  builtInTypes.array.assert(child);
  for (let i = 0; i < child.length; i++) {
    const p = path.get(key, i);
    const func = p.node;
    if (!n.FunctionDeclaration.check(func)) continue;

    const declar = b.variableDeclaration("let", [
      b.variableDeclarator(func.id, toExpression(func)),
    ]);

    // hoist it up above everything else
    setData(declar, "_blockHoist", 2);

    // todo: name this
    func.id = null;

    p.replace(declar);
    hasChanges = true;
  }

  return hasChanges;
}

const plugin = {
  visitor: PathVisitor.fromMethodsObject({
    visitBlockStatement(path: NodePath<n.BlockStatement, n.BlockStatement>) {
      const { node, parent } = path;
      if (n.Function.check(parent) && parent.body == node) {
        this.traverse(path);
        return;
      }

      if (statementList("body", path)) {
        const { parentPath } = path;
        blockScopingVisitor.visit(parentPath);
      }

      this.traverse(path);
    },

    visitSwitchCase(path: NodePath<n.SwitchCase, n.SwitchCase>) {
      if (statementList("consequent", path)) {
        const { parentPath } = path;
        blockScopingVisitor.visit(parentPath);
      }

      this.traverse(path);
    },
  }),
};

export default plugin;