/* eslint-disable quote-props */
import {types, traverse, File} from '@pregenerator/babel-lite';

import arrowFunctionsPlugin from './plugins/transform-arrow-functions';
import blockHoistPlugin from './plugins/block-hoist';
import blockScopedFunctionsPlugin from './plugins/transform-block-scoped-functions';
import blockScopingPlugin from './plugins/transform-block-scoping';
import forOfPlugin from './plugins/transform-for-of';
import destructuringPlugin from './plugins/transform-destructuring';
import spreadPlugin from './plugins/transform-spread';
import parametersPlugin from './plugins/transform-parameters';
import templateLiteralsPlugin from './plugins/transform-template-literals';
import shorthandPropertiesPlugin from './plugins/transform-shorthand-properties';
import computedPropertiesPlugin from './plugins/transform-computed-properties';
import {default as regeneratorPlugin} from 'regenerator-transform';

const pluginNames = {
  'arrow-functions': arrowFunctionsPlugin,
  'block-scoped-functions': blockScopedFunctionsPlugin,
  'block-scoping': blockScopingPlugin,
  'for-of': forOfPlugin,
  'destructuring': destructuringPlugin,
  'spread': spreadPlugin,
  'parameters': parametersPlugin,
  'template-literals': templateLiteralsPlugin,
  'shorthand-properties': shorthandPropertiesPlugin,
  'computed-properties': computedPropertiesPlugin,
  'regenerator': regeneratorPlugin,
};

const defaultPlugins = [
  'for-of',
  'parameters',
  'computed-properties',
  'destructuring',
  'arrow-functions',
  'block-scoping',
  'regenerator',
  'block-scoped-functions',
  'spread',
  'shorthand-properties',
  'template-literals',
];

function getPluginVisitor(plugin) {
  if (Object.prototype.hasOwnProperty.call(pluginNames, plugin)) {
    plugin = pluginNames[plugin];
  }
  if (typeof plugin === 'function') {
    return plugin({types, traverse}).visitor;
  } else if (plugin && typeof plugin === 'object' && plugin.visitor) {
    return plugin.visitor;
  } else {
    throw new Error(`Invalid plugin ${plugin ? plugin.name : plugin}`);
  }
}

export default function transform(ast, {noClone, plugins = defaultPlugins} = {}) {
  const file = new File();

  if (!noClone) {
    ast = types.cloneDeep(ast);
  }

  plugins.push(blockHoistPlugin);

  const state = {file, opts: {generators: true, async: true}};

  const visitors = plugins.map(getPluginVisitor);

  const visitor = traverse.visitors.merge(visitors);
  traverse(ast, visitor, undefined, state);

  traverse(ast, {
    ExpressionStatement(path) {
      if (!path.node.expression) {
        path.remove();
      }
    },
    UnaryExpression(path) {
      const {node} = path;
      // Fix weird issue where we get `if (arg!)` from regenerator-transform
      if (node.operator === '!' && path.parentPath.isConditional()) {
        node.prefix = true;
      }
    },
    // Change 'void 0' to 'undefined'
    Identifier(path) {
      const {node} = path;
      if (node.name === 'undefined') {
        path.replaceWith(types.unaryExpression('void', types.numericLiteral(0), true));
      }
    },
    // Hoist 'use strict' out of regeneratorRuntime functions / statements
    Literal: {
      exit(path) {
        const {node, parentPath: pp} = path;
        if (pp.isExpressionStatement() && node.value === 'use strict') {
          if (pp.parentPath.isProgram() || pp.parentPath.isBlockStatement()) {
            return;
          }
          const blockPath = path.findParent(
            p => p.isProgram() || (p.isBlockStatement() && !(p.parentPath && p.parentPath.parentPath && p.parentPath.parentPath.isCallExpression() && p.parentPath.parentPath.get('callee.object.name').node === 'regeneratorRuntime')));
          if (!blockPath || !blockPath.node) {
            return;
          }
          path.remove();
          blockPath.unshiftContainer('body', node);
        }
      }
    },
  });
  return ast;
}
