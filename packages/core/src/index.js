import * as acorn from 'acorn';
import * as astring from 'astring';

import {types, traverse} from '@pregenerator/babel-lite';
import transform from '@pregenerator/transform';

import * as pregeneratorHelpers from '@pregenerator/helpers';

global.pregeneratorHelpers = pregeneratorHelpers;

function parse(src, opts) {
  var ast = {
    type: 'File',
    program: acorn.parse(src, opts),
  };

  traverse(ast, {
    enter(path) {
      const {node} = path;
      if (node.type === 'Property') {
        if (node.kind === 'init') {
          node.type = 'ObjectProperty';
          delete node.kind;
        } else {
          // kind === 'get' or 'set'
          const {value} = node;
          delete node.value;
          Object.assign(node, {
            type: 'ObjectMethod',
            async: false,
            generator: !!value.generator,
            async: !!value.async,
            body: value.body,
            params: value.params,
          });
        }
      }
      if (node.type === 'Literal') {
        if (node.value === null) {
          node.type = 'NullLiteral';
        } else if (typeof node.value === 'boolean') {
          node.type = 'BooleanLiteral';
        } else if (typeof node.value === 'string') {
          node.type = 'StringLiteral';
        } else if (typeof node.value === 'number') {
          node.type = 'NumericLiteral';
        }
      }
    }
  });

  return ast;
}

function generate(ast) {
  const customGenerator = Object.assign({}, astring.baseGenerator, {
    StringLiteral(node, state) {
      state.write(JSON.stringify(node.value), node);
    },
    NullLiteral(node, state) {
      state.write('null', node);
    },
    BooleanLiteral(node, state) {
      state.write(JSON.stringify(node.value), node);
    },
    NumericLiteral(node, state) {
      state.write(JSON.stringify(node.value), node);
    },
    ObjectProperty(node, state) {
      if (node.computed) {
        state.write('[', node);
        this[node.key.type](node.key, state);
        state.write(']', node);
      } else {
        this[node.key.type](node.key, state);
      }
      state.write(': ', node);
      this[node.value.type](node.value, state);
    },
    RegExpLiteral(node, state) {
      state.write(`/${node.pattern}/${node.flags}`, node);
    },
    CallExpression(node, state) {
      if (node.leadingComments) {
        for (let i = 0; i < node.leadingComments.length; i++) {
          const comment = node.leadingComments[i];
          if (comment.type === 'CommentBlock') {
            state.write('/* ' + comment.value + ' */ ');
          }
        }
      }
      astring.baseGenerator.CallExpression.call(this, node, state);
    },
    UnaryExpression(node, state) {
      if (node.operator === 'void' && node.argument.value === 0) {
        state.write('undefined', node);
      } else {
        astring.baseGenerator.UnaryExpression.call(this, node, state);
      }
    },
  });
  if (types.isFile(ast)) {
    ast = ast.program;
  }
  return astring.generate(ast, {
    generator: customGenerator,
  });
}

function compile(src, opts) {
  let ast = parse(src, opts);
  ast = transform(ast, true);
  return generate(ast);
}

export {transform, compile, parse, generate, types};
