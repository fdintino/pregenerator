/* eslint-disable quote-props */
import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import cloneDeep from "lodash.clonedeep";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
} from "@pregenerator/ast-types";
import { isConditional } from "./validators";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";
import { findParent } from "./plugins/transform-regenerator/util";
import { transform as regeneratorTransform } from "./plugins/transform-regenerator/visit";
import blockScopingPlugin from "./plugins/transform-block-scoping";

// import { types, traverse, File } from "@pregenerator/babel-lite";
//
import arrowFunctionsPlugin from "./plugins/transform-arrow-functions";
import blockHoistPlugin from "./plugins/block-hoist";
import blockScopedFunctionsPlugin from "./plugins/transform-block-scoped-functions";
// import blockScopingPlugin from "./plugins/transform-block-scoping";
import forOfPlugin from "./plugins/transform-for-of";
// import destructuringPlugin from "./plugins/transform-destructuring";
// import spreadPlugin from "./plugins/transform-spread";
// import parametersPlugin from "./plugins/transform-parameters";
// import templateLiteralsPlugin from "./plugins/transform-template-literals";
// import shorthandPropertiesPlugin from "./plugins/transform-shorthand-properties";
// import computedPropertiesPlugin from "./plugins/transform-computed-properties";
// import { default as regeneratorPlugin } from "regenerator-transform";
//
// const pluginNames = {
//   "arrow-functions": arrowFunctionsPlugin,
//   "block-scoped-functions": blockScopedFunctionsPlugin,
//   "block-scoping": blockScopingPlugin,
//   "for-of": forOfPlugin,
//   destructuring: destructuringPlugin,
//   spread: spreadPlugin,
//   parameters: parametersPlugin,
//   "template-literals": templateLiteralsPlugin,
//   "shorthand-properties": shorthandPropertiesPlugin,
//   "computed-properties": computedPropertiesPlugin,
//   regenerator: regeneratorPlugin,
// };
//
// const defaultPlugins = [
//   "for-of",
//   "parameters",
//   "computed-properties",
//   "destructuring",
//   "arrow-functions",
//   "block-scoping",
//   "regenerator",
//   "block-scoped-functions",
//   "spread",
//   "shorthand-properties",
//   "template-literals",
// ];
//
// function getPluginVisitor(plugin) {
//   if (Object.prototype.hasOwnProperty.call(pluginNames, plugin)) {
//     plugin = pluginNames[plugin];
//   }
//   if (typeof plugin === "function") {
//     return plugin({ types, traverse }).visitor;
//   } else if (plugin && typeof plugin === "object" && plugin.visitor) {
//     return plugin.visitor;
//   } else {
//     throw new Error(`Invalid plugin ${plugin ? plugin.name : plugin}`);
//   }
// }

export default function transform(
  ast: n.ASTNode,
  { noClone }: { noClone?: boolean } = {}
): n.ASTNode {
  // const file = new File();

  if (!noClone) {
    ast = cloneDeep(ast);
  }

  // plugins.push(blockHoistPlugin);

  // const state = { file, opts: { generators: true, async: true } };
  //
  // const visitors = plugins.map(getPluginVisitor);
  //
  // const visitor = traverse.visitors.merge(visitors);
  // traverse(ast, visitor, undefined, state);
  forOfPlugin.visitor.visit(ast);
  blockScopingPlugin.visitor.visit(ast);
  arrowFunctionsPlugin.visitor.visit(ast);
  regeneratorTransform(ast);
  blockScopedFunctionsPlugin.visitor.visit(ast);
  blockHoistPlugin.visitor.visit(ast);

  const cleanupVisitor = PathVisitor.fromMethodsObject({
    visitExpressionStatement(path: NodePath<K.ExpressionStatementKind>) {
      if (!path.node.expression) {
        path.replace();
        return false;
      } else {
        this.traverse(path);
      }
    },
    visitUnaryExpression(path: NodePath<K.UnaryExpressionKind>) {
      const { node } = path;
      // Fix weird issue where we get `if (arg!)` from regenerator-transform
      if (node.operator === "!" && isConditional(path.parentPath.node)) {
        node.prefix = true;
      }
      this.traverse(path);
    },
    // Change 'void 0' to 'undefined'
    visitIdentifier(path: NodePath<K.IdentifierKind>) {
      const { node } = path;
      if (node.name === "undefined") {
        path.replace(b.unaryExpression("void", b.literal(0), true));
        return false;
      } else {
        this.traverse(path);
      }
    },
    // Hoist 'use strict' out of regeneratorRuntime functions / statements
    visitLiteral(path: NodePath<K.LiteralKind>) {
      this.traverse(path);
      const { node, parentPath: pp } = path;
      if (n.ExpressionStatement.check(pp.node) && node.value === "use strict") {
        if (
          n.Program.check(pp.parentPath.node) ||
          n.BlockStatement.check(pp.parentPath.node)
        ) {
          return;
        }
        const blockPath = findParent(
          path,
          (p) =>
            n.Program.check(p) ||
            (n.BlockStatement.check(p) &&
              !(
                p.parentPath &&
                p.parentPath.parentPath &&
                n.CallExpression.check(p.parentPath.parentPath.node) &&
                p.parentPath.parentPath.get("callee", "object", "name")
                  .value === "regeneratorRuntime"
              ))
        );
        if (!blockPath || !blockPath.node) {
          return;
        }
        path.replace();
        blockPath.unshift(node);
      }
    },
  });
  cleanupVisitor.visit(ast);
  return ast;
}
