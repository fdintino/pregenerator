var _compile;

if (typeof window === 'object') {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
} else {
  _compile = require('pregenerator/test').compile;
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
    ].join('\n')));
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
    ].join('\n')));
  });

  it('destructuring', function() {
    eval(compile([
      'function foo(',
      '   { x: { y: { z: a = 10 } = {}, w: b = 20 }, a: c = 30 }',
      ') {',
      '  assert.equal(a, 10);',
      '  assert.equal(b, 20);',
      '  assert.equal(c, 30);',
      '}',
      '',
      'foo({ x: {} });',
      ''
    ].join('\n')));
  });

  it('hoisting', function() {
    eval(compile([
      'var fns = [];',
      'var nums = [1, 2, 3];',
      'for (let i of nums) {',
      '  var x = 5;',
      '  var { f } = { f: 2 };',
      '  fns.push(function () {',
      '    return i * x * f;',
      '  });',
      '}',
      'var res = fns.map(function(f) { return f(); });',
      'assert.deepEqual(res, [10, 20, 30]);',
      ''
    ].join('\n')));
  });

  it('for break continue return', function() {
    eval(compile([
      'var fns = [];',
      'var nums = {a: 0, b: 1, c: 2, d: 3};',
      '(function () {',
      '  for (let i in nums) {',
      '    fns.push(function () { return i; });',
      '    if (i === "b") {',
      '      continue;',
      '    } else if (i === "c") {',
      '      break;',
      '    } else if (i === "d") {',
      '      return i;',
      '    }',
      '  }',
      '})();',
      'var res = fns.map(function(f) { return f(); });',
      'assert.deepEqual(res, ["a", "b", "c"]);',
    ].join('\n')));
  });

  it('for return undefined', function() {
    eval(compile([
      'var obj = {a: 1, b: 2, c: 3};',
      'var fns = [];',
      '(function () {',
      '  for (let k in obj) {',
      '    fns.push(function () { return k; });',
      '    return;',
      '  }',
      '})();',
      'assert.equal(fns.length, 1);',
      'assert.equal(fns[0](), "a");'
    ].join('\n')));
  });

  it('for closure with yield', function() {
    eval(compile([
      'var obj = {a: 1, b: 2, c: 3};',
      'var fns = [];',
      'function *gen() {',
      '  for (let k in obj) {',
      '    fns.push(function() { return k; });',
      '    yield k;',
      '  }',
      '}',
      'var res = [];',
      'for (let k of gen()) {',
      '  res.push(k);',
      '}',
      'assert.deepEqual(res, ["a", "b", "c"]);',
      'assert.equal(fns.length, 3);',
      'assert.equal(fns[0](), "a");',
      'assert.equal(fns[1](), "b");',
      'assert.equal(fns[2](), "c");'
    ].join('\n')));
  });

  it('for closure with await', new Function("done", compile([
    'var obj = {a: 1, b: 2, c: 3};',
    'var fns = [];',
    'async function addX(k) {',
    '  return "x" + k;',
    '}',
    'async function loop() {',
    '  var res = [];',
    '  for (let k in obj) {',
    '    fns.push(function() { return k; });',
    '    var xk = await addX(k);',
    '    res.push(xk);',
    '    continue;',
    '  }',
    '  return res;',
    '}',
    'loop().then(function(res) {',
    '  try {',
    '    assert.deepEqual(res, ["xa", "xb", "xc"]);',
    '    assert.equal(fns.length, 3);',
    '    assert.equal(fns[0](), "a");',
    '    assert.equal(fns[1](), "b");',
    '    assert.equal(fns[2](), "c");',
    '  } catch (err) {',
    '    return done(err);',
    '  }',
    '  done();',
    '}, function(err) { done(err); });'
  ].join('\n'))));

  it('for closure inside switch', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '  var obj1 = {a: 1, b: 2, c: 3};',
      '  var obj2 = {e: 4, f: 5, g: 6};',
      '',
      '  switch (true) {',
      '    default:',
      '    let i = obj1;',
      '    for (let j in i) {',
      '      stack.push(function() { return [i, j]; });',
      '      break;',
      '    }',
      '  }',
      '',
      '  assert.equal(stack.length, 1);',
      '  assert.deepEqual(stack[0](), [{a: 1, b: 2, c: 3}, "a"]);',
      '  assert.equal(typeof i, "undefined");',
      '})();',
    ].join('\n')));
  });

  it('for continuation', function() {
    eval(compile([
      'var res = [];',
      'for (let i = 0; i < 2; i++) {',
      '  () => { i };',
      '  res.push(i);',
      '  i += 1;',
      '}',
      'assert.deepEqual(res, [0]);',
      ''
    ].join('\n')));
  });

  it('defaults', function() {
    eval(compile([
      'function foo(bar, bar2 = bar) {}',
      '',
      'foo();',
      ''
    ].join('\n')));
  });

  it('assignment', function() {
    eval(compile([
      'let a = 1;',
      'a = 2;',
      'assert.equal(a, 2);',
      ''
    ].join('\n')));
  });

  it('for-loop-head', function() {
    eval(compile([
      'assert.equal((function(){',
      '  let a = 1;',
      '  for (let a = 0; a < 8; a++) {}',
      '  return a;',
      '}()), 1);',
      ''
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
  });

  it('multiple', function() {
    eval(compile([
      'for (let i = 0, x = 2; i < 5; i++);',
      '',
      'assert.ok(typeof i === "undefined");',
      'assert.ok(typeof x === "undefined");',
      ''
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
  });

  it('destructuring-defaults', function() {
    eval(compile([
      'var fields = [{ name: "title" }, { name: "content" }];',
      '',
      'for (let { name, value = "Default value" } of fields) {',
      '  assert.equal(value, "Default value");',
      '}',
      ''
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
  });

  it('nested-labels multiple for declarations', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '',
      '  loop1:',
      '  for (let k = 0, l = 5; k < 4; k++) {',
      '    for (let i = 0, j = 4; i < 4; i++) {',
      '      stack.push(() => [i, j, k, l]);',
      '      continue loop1;',
      '    }',
      '  }',
      '',
      '  assert.deepEqual(stack[0](), [0, 4, 0, 5]);',
      '  assert.deepEqual(stack[1](), [0, 4, 1, 5]);',
      '  assert.deepEqual(stack[2](), [0, 4, 2, 5]);',
      '  assert.deepEqual(stack[3](), [0, 4, 3, 5]);',
      '})();',
      ''
    ].join('\n')));
  });

  it('nested-labels for-in', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '  var obj1 = {a: 1, b: 2, c: 3};',
      '  var obj2 = {e: 4, f: 5, g: 6};',
      '',
      '  loop1:',
      '  for (let j in obj2) {',
      '    for (let i in obj1) {',
      '      stack.push(() => [i, j]);',
      '      continue loop1;',
      '    }',
      '  }',
      '',
      '  assert.equal(stack.length, 3);',
      '  assert.deepEqual(stack[0](), ["a", "e"]);',
      '  assert.deepEqual(stack[1](), ["a", "f"]);',
      '  assert.deepEqual(stack[2](), ["a", "g"]);',
      '})();',
      ''
    ].join('\n')));
  });

  it('nested-labels for-in block hoisting', function() {
    eval(compile([
      '(function () {',
      '  var stack = [];',
      '  var obj1 = {a: 1, b: 2, c: 3};',
      '  var obj2 = {e: 4, f: 5, g: 6};',
      '',
      '  for (let j in obj2) {',
      '    for (var i in obj1) {',
      '      stack.push(function() { return [i, j]; });',
      '      break;',
      '    }',
      '  }',
      '',
      '  assert.equal(stack.length, 3);',
      '  assert.deepEqual(stack[0](), ["a", "e"]);',
      '  assert.deepEqual(stack[1](), ["a", "f"]);',
      '  assert.deepEqual(stack[2](), ["a", "g"]);',
      '  assert.equal(typeof i, "string");',
      '})();',
    ].join('\n')));
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
    ].join('\n')));
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
    ].join('\n')));
  });

  describe('switch inside loop', function() {
    it('should not break on a case-break statement', function() {
      eval(compile([
        'var i;',
        'for (i = 0; i < 10; i++) {',
        '  switch (i) {',
        '    case 1:',
        '      break;',
        '  }',
        '',
        '  const z = 3; // to force the plugin to convert to loop function call',
        '  () => z;',
        '}',
        '',
        'assert.equal(i, 10);',
      ].join('\n')));
    });

    it('should continue on continue statements within switch', function() {
      eval(compile([
        'var i;',
        'var j = 0;',
        'for (i = 0; i < 10; i++) {',
        '  switch (i) {',
        '    case 0:',
        '      continue;',
        '  }',
        '  j++;',
        '',
        '  const z = 3;',
        '  () => z;',
        '}',
        '',
        'assert.equal(j, 9);'
      ].join('\n')));
    });

    it('should work with loops nested within switch', function() {
      eval(compile([
        'var i;',
        'var j = 0;',
        'for (i = 0; i < 10; i++) {',
        '  switch (i) {',
        '    case 0:',
        '      for (var k = 0; k < 10; k++) {',
        '        const z = 3;',
        '        () => z;',
        '        j++;',
        '        break;',
        '      }',
        '      break;',
        '  }',
        '',
        '  const z = 3;',
        '  () => z;',
        '}',
        '',
        'assert.equal(j, 1);'
      ].join('\n')));
    });

    it('should work with loops nested within switch with multiple assignments', function() {
      eval(compile([
        'var i;',
        'var j = 0;',
        'for (i = 0; i < 10; i++) {',
        '  switch (i) {',
        '    case 0:',
        '      for (var k = 0, l = 1; k < 10; k++) {',
        '        const z = 3;',
        '        () => z;',
        '        j++;',
        '        break;',
        '      }',
        '      break;',
        '  }',
        '',
        '  const z = 3;',
        '  () => z;',
        '}',
        '',
        'assert.equal(j, 1);'
      ].join('\n')));
    });
  });

  it('issue 8498 loop init collision', function() {
    eval(compile([
      'var res = [];',
      'for (let i = 0; res.push(i) && i < 3; i++) {',
      '    let i = 2;',
      '    res.push(i);',
      '',
      '    {',
      '      let i = "hello";',
      '      res.push(i);',
      '    }',
      '}',
      'assert.deepEqual(res, [0, 2, "hello", 1, 2, "hello", 2, 2, "hello", 3]);'
    ].join('\n')));
  });

  it('block scoped functions', function() {
    eval(compile([
      'var name;',
      '{',
      '  function name(n) { return n; }',
      '}',
      'assert.equal(typeof name, "undefined");'
    ].join('\n')));
  });

  it('block scoped functions in switch-case', function() {
    eval(compile([
      'var name;',
      'switch(1) {',
      '  default:',
      '    function name(n) { return n; }',
      '}',
      'assert.equal(typeof name, "undefined");'
    ].join('\n')));
  });

  it('loop initializer default', function() {
    eval(compile([
      'var count = 0;',
      '',
      'for (var i = 0; i < 3; i++) {',
      '  let foo;',
      '',
      '  if (i === 1) {',
      '    foo = true;',
      '  }',
      '',
      '  if (foo) {',
      '    count++;',
      '  }',
      '}',
      '',
      'assert.equal(count, 1);'
    ].join('\n')));
  });
});
