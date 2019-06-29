/* eslint-disable quotes */
var compile;

if (typeof window === 'object') {
  compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
} else {
  compile = require('pregenerator/test').compile;
  global.assert = require('chai').assert;
}

function compile(src) {
  return _compile(src, {allowReturnOutsideFunction: true});
}

describe('block scoping', function() {
  it('update', function() {
    eval(compile([
      'let a = 1;',
      'a++;',
      'assert.equal(a, 2);',
      ''
    ].join('\n')))
  });

  it('call', function() {
    eval(compile([
      'let a = 1;',
      '',
      'function b() {',
      '  return a + 1;',
      '}',
      '',
      'assert.equal(b(), 2);',
      ''
    ].join('\n')))
  });

  // parameter destructuring TK
  // it('destructuring', function() {
  //   eval(compile([
  //     'function foo(',
  //     '   { x: { y: { z: a = 10 } = {}, w: b = 20 }, a: c = 30 }',
  //     ') {',
  //     '  assert.equal(a, 10);',
  //     '  assert.equal(b, 20);',
  //     '  assert.equal(c, 30);',
  //     '}',
  //     '',
  //     'foo({ x: {} });',
  //     ''
  //   ].join('\n')))
  // });

  // defaults TK
  // it('defaults', function() {
  //   eval(compile([
  //     'function foo(bar, bar2 = bar) {}',
  //     '',
  //     'foo();',
  //     ''
  //   ].join('\n')))
  // });

  it('assignment', function() {
    eval(compile([
      'let a = 1;',
      'a = 2;',
      'assert.equal(a, 2);',
      ''
    ].join('\n')))
  });

  it('for-loop-head', function() {
    eval(compile([
      'assert.equal((function(){',
      '  let a = 1;',
      '  for (let a = 0; a < 8; a++) {}',
      '  return a;',
      '}()), 1);',
      ''
    ].join('\n')))
  });

  it('nested-labels-4', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '',
      '  loop1:',
      '  for (let j = 0; j < 10; j++) {',
      '    for (let i = 0; i < 10; i++) {',
      '      stack.push(() => [i, j]);',
      '      break loop1;',
      '    }',
      '  }',
      '',
      '  assert.deepEqual(stack.length, 1);',
      '  assert.deepEqual(stack[0](), [0, 0]);',
      '})();',
      ''
    ].join('\n')))
  });

  it('block-scoped-2', function() {
    eval(compile([
      'assert.equal((() => {',
      '  let sum = 0;',
      '  let a = 0;',
      '  {',
      '    let a = 10;',
      '    for (let i = 0; i < a; i++) {',
      '      let a = 1;',
      '      sum += (() => a)();',
      '    }',
      '  }',
      '  return sum;',
      '})(), 10);',
      ''
    ].join('\n')))
  });

  it('multiple', function() {
    eval(compile([
      'for (let i = 0, x = 2; i < 5; i++);',
      '',
      'assert.ok(typeof i === "undefined");',
      'assert.ok(typeof x === "undefined");',
      ''
    ].join('\n')))
  });

  it('for-continuation', function() {
    eval(compile([
      'var fns = [];',
      '',
      'for (let i = 0; i < 10; i++) {',
      '  fns.push(function () { return i; });',
      '  i += 1;',
      '}',
      '',
      'assert.equal(fns[0](), 1);',
      'assert.equal(fns[1](), 3);',
      'assert.equal(fns[2](), 5);',
      'assert.equal(fns[3](), 7);',
      'assert.equal(fns[4](), 9);',
      ''
    ].join('\n')))
  });

  it('block-scoped', function() {
    eval(compile([
      'let x = 1;',
      '{',
      '  let x = 2;',
      '  assert.equal(x, 2);',
      '  {',
      '    let x = 3;',
      '    assert.equal(x, 3);',
      '',
      '    x++;',
      '    assert.equal(x, 4);',
      '  }',
      '}',
      'assert.equal(x, 1);',
      ''
    ].join('\n')))
  });

  it('collision-for', function() {
    eval(compile([
      'let x = 0;',
      'for (;;) {',
      '  let x = 1;',
      '  assert.equal(x, 1);',
      '  break;',
      '}',
      ''
    ].join('\n')))
  });

  it('switch-break', function() {
    eval(compile([
      'if (true) {',
      '  const x = 1;',
      '  switch (x) {',
      '    case 1: {',
      '      assert(x, 1);',
      '      break;',
      '    }',
      '  }',
      '}',
      ''
    ].join('\n')))
  });

  it('duplicate-function-scope', function() {
    eval(compile([
      'function test () {',
      '  let value = "outer";',
      '',
      '  return (function () {',
      '    let value = "inner";',
      '    return value;',
      '  })();',
      '}',
      '',
      'assert(test(), "inner");',
      ''
    ].join('\n')))
  });

  it('destructuring-defaults', function() {
    eval(compile([
      'var fields = [{ name: "title" }, { name: "content" }];',
      '',
      'for (let { name, value = "Default value" } of fields) {',
      '  assert.equal(value, "Default value");',
      '}',
      ''
    ].join('\n')))
  });

  it('closure-wrap-collision', function() {
    eval(compile([
      'for (let i = 1; i < 3; i += 1) {',
      '  (function () {',
      '    i;',
      '  })();',
      '}',
      '',
      'assert.throws(function () {',
      '  i;',
      '}, ReferenceError);',
      ''
    ].join('\n')))
  });

  it('nested-labels-2', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '',
      '  loop1:',
      '  for (let j = 0; j < 10; j++) {',
      '    for (let i = 0; i < 10; i++) {',
      '      stack.push(() => [i, j]);',
      '      break;',
      '    }',
      '  }',
      '',
      '  assert.deepEqual(stack[0](), [0, 0]);',
      '  assert.deepEqual(stack[1](), [0, 1]);',
      '  assert.deepEqual(stack[2](), [0, 2]);',
      '  assert.deepEqual(stack[3](), [0, 3]);',
      '  assert.deepEqual(stack[4](), [0, 4]);',
      '  assert.deepEqual(stack[5](), [0, 5]);',
      '  assert.deepEqual(stack[6](), [0, 6]);',
      '  assert.deepEqual(stack[7](), [0, 7]);',
      '  assert.deepEqual(stack[8](), [0, 8]);',
      '  assert.deepEqual(stack[9](), [0, 9]);',
      '})();',
      ''
    ].join('\n')))
  });

  it('nested-labels', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '',
      '  loop1:',
      '  for (let j = 0; j < 10; j++) {',
      '    for (let i = 0; i < 10; i++) {',
      '      stack.push(() => [i, j]);',
      '      continue loop1;',
      '    }',
      '  }',
      '',
      '  assert.deepEqual(stack[0](), [0, 0]);',
      '  assert.deepEqual(stack[1](), [0, 1]);',
      '  assert.deepEqual(stack[2](), [0, 2]);',
      '  assert.deepEqual(stack[3](), [0, 3]);',
      '  assert.deepEqual(stack[4](), [0, 4]);',
      '  assert.deepEqual(stack[5](), [0, 5]);',
      '  assert.deepEqual(stack[6](), [0, 6]);',
      '  assert.deepEqual(stack[7](), [0, 7]);',
      '  assert.deepEqual(stack[8](), [0, 8]);',
      '  assert.deepEqual(stack[9](), [0, 9]);',
      '})();',
      ''
    ].join('\n')))
  });

  it('label', function() {
    eval(compile([
      'var heh = [];',
      'var nums = [1, 2, 3];',
      '',
      'loop1:',
      'for (let i in nums) {',
      '  let num = nums[i];',
      '  heh.push(x => x * num);',
      '  if (num >= 2) {',
      '    break loop1;',
      '  }',
      '}',
      '',
      'assert.equal(heh.length, 2);',
      'assert.equal(heh[0](2), 2);',
      'assert.equal(heh[1](4), 8);',
      ''
    ].join('\n')))
  });

  it('nested-labels-3', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '',
      '  loop1:',
      '  for (let j = 0; j < 10; j++) {',
      '    loop2:',
      '    for (let i = 0; i < 10; i++) {',
      '      for (let x = 0; x < 10; x++) {',
      '        stack.push(() => [j, i, x]);',
      '        continue loop2;',
      '      }',
      '    }',
      '  }',
      '',
      '  assert.deepEqual(stack[0](), [0, 0, 0]);',
      '  assert.deepEqual(stack[1](), [0, 1, 0]);',
      '  assert.deepEqual(stack[2](), [0, 2, 0]);',
      '  assert.deepEqual(stack[3](), [0, 3, 0]);',
      '  assert.deepEqual(stack[4](), [0, 4, 0]);',
      '  assert.deepEqual(stack[5](), [0, 5, 0]);',
      '  assert.deepEqual(stack[6](), [0, 6, 0]);',
      '  assert.deepEqual(stack[7](), [0, 7, 0]);',
      '  assert.deepEqual(stack[8](), [0, 8, 0]);',
      '  assert.deepEqual(stack[9](), [0, 9, 0]);',
      '})();',
      ''
    ].join('\n')))
  });
});
