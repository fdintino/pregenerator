# pregenerator

`pregenerator` is a lighter-weight, more narrowly focused package that aims to accomplish some of the goals of [regenerator](https://github.com/facebook/regenerator), while remaining small enough that it won’t (completely) break a website’s performance budget if run in the browser. It may not be able to boast as impressive size reductions as preact has compared to react, but it is 25% smaller (minified and gzipped) than regenerator, while supporting most of the same features.

This library does not aim to support the full set of ES6 to ES5 transforms.
It explicitly supports:

- destructuring assignment
- block scoping (`let` and `const`) to `var`
- arrow functions
- async / await
- generators (sync and async)
- for ... of loops
- function parameter destructuring
- function parameter defaults
- rest / spread syntax
- simple template literals
- shorthand object properties
- computed object properties

Features that are intentionally not supported:

- classes
- import / export
- react, jsx, flow, or typescript syntax
- tagged template literals

## API

### pregenerator.compile

This function accepts a javascript string and returns ES5-compatible
javascript. If generators are involved, it assumes `regeneratorRuntime`
is available in the global scope.

It 

```javascript
// input
import { compile } from 'pregenerator';

console.log(compile('function *gen() { yield 1; }'));

// output
var _marked = /* #__PURE__ */ regeneratorRuntime.mark(gen);
function gen() {
  return regeneratorRuntime.wrap(function gen$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 1;
      case 2:
      case "end":
        return _context.stop();
    }
  }, _marked);
}
```

### pregenerator.transform

Also importable from `@pregenerator/transform`; performs an AST transform
(conforming to the [ESTree Spec](https://github.com/estree/estree)) to
ES5-compatible AST.

```javascript
import {types as t} from '@pregenerator/babel-lite';
import transform from '@pregenerator/transform';

// input: AST for `let {x} = y`
var ast = transform({
  type: 'File',
  program: {
    type: 'Program',
    body: [{
      type: 'VariableDeclaration',
      kind: 'let',
      declarations: [{
        type: 'VariableDeclarator',
        id: {
          type: 'ObjectPattern',
          properties: [
            {
              type: 'ObjectProperty',
              key: {type: 'Identifier', name: 'x'},
              value: {type: 'Identifier', name: 'x'},
              shorthand: true
            }
          ]
        },
        init: {type: 'Identifier', name: 'y'}
      }]
    }]
  }
});
t.cloneDeep(ast);

// result: AST for `var _y = y; var x = _y.x`
{
  type: 'File',
  program: {
    type: 'Program',
    body: [{
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: [{
        type: 'VariableDeclarator',
        id:   {type: 'Identifier', name: '_y'},
        init: {type: 'Identifier', name: 'y'}
      }]
    }, {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations: [{
        type: 'VariableDeclarator',
        id: {type: 'Identifier', name: 'x'},
        init: {
          type: 'MemberExpression',
          object:   {type: 'Identifier', name: '_y'},
          property: {type: 'Identifier', name: 'x'},
          computed: false
        }
      }]
    }]
  }
}
```

### pregenerator.generate

Stringifies AST (using [astring](https://github.com/davidbonnet/astring)),
papering over some of the differences between the ESTree implementation of
babylon, acorn, and astring.

### `@pregenerator/babel-lite`

Exports `types` and `traverse`, light-weight interfaces corresponding loosely
to [@babel/types](https://babeljs.io/docs/en/babel-types) and
[@babel/traverse](https://babeljs.io/docs/en/babel-traverse). Also exported by
the core `pregenerator` package.
