import {types, traverse, File} from '@pregenerator/babel-lite';

import arrowFunctionPlugin from './plugins/transform-arrow-functions';
import blockHoistPlugin from './plugins/block-hoist';
import blockScopedFunctionPlugin from './plugins/transform-block-scoped-functions';
import blockScopingPlugin from './plugins/transform-block-scoping';
import forOfPlugin from './plugins/transform-for-of';
import destructuringPlugin from './plugins/transform-destructuring';
import spreadPlugin from './plugins/transform-spread';
import parametersPlugin from './plugins/transform-parameters';
import templateLiteralsPlugin from './plugins/transform-template-literals';
import {default as regeneratorPlugin} from 'regenerator-transform';

const plugins = [
  forOfPlugin,
  parametersPlugin,
  arrowFunctionPlugin,
  destructuringPlugin,
  blockScopingPlugin,
  regeneratorPlugin,
  blockScopedFunctionPlugin,
  spreadPlugin,
  templateLiteralsPlugin,
  blockHoistPlugin,
];

export default function transform(ast, noClone) {
  const file = new File();

  if (!noClone) {
    ast = types.cloneDeep(ast);
  }

  plugins.forEach(plugin => {
    const {visitor} = plugin({types, traverse});
    traverse(ast, visitor, undefined, {file, opts: {generators: true, async: true}});
  });

  traverse(ast, {
    UnaryExpression(path) {
      const {node} = path;
      // Fix weird issue where we get `if (arg!)` from regenerator-transform
      if (node.operator === '!' && path.parentPath.isConditional()) {
        node.prefix = true;
      }
    }
  });

  traverse(ast, {
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
        if (path.parentPath.isExpressionStatement() && path.node.value === 'use strict') {
          if (path.parentPath.parentPath.isProgram() || path.parentPath.parentPath.isBlockStatement()) {
            return;
          }
          const blockPath = path.findParent(
            p => p.isProgram() || (p.isBlockStatement() && !(p.parentPath && p.parentPath.parentPath && p.parentPath.parentPath.isCallExpression() && p.parentPath.parentPath.get('callee.object.name').node === 'regeneratorRuntime')));
          if (!blockPath || !blockPath.node) {
            return;
          }
          const {node} = path;
          path.remove();
          blockPath.unshiftContainer('body', node);
        }
      }
    },
  });
  return ast;
}
