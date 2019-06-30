var _compile;

if (typeof window === 'object') {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  _compile = require('pregenerator/test').compile;
  var chai = require('chai');
  global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  global.sinon = require('sinon');
}

function compile(src) {
  return _compile(src, {allowReturnOutsideFunction: true});
}

describe('destructuring', function() {
  it('should support arrays', function() {
    eval(compile([
      'var [a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];',
      'assert.equal([a, b, c].join(""), "hello, world");',
      '[a, [b], [c]] = ["hello", [", ", "junk"], ["world"]];',
      'assert.equal([a, b, c].join(""), "hello, world");'
    ].join('\n')));
  });

  it('should optimize unpacking of array literals', function() {
    var actual = compile('var [a, b] = [1, 2]');
    var expected = 'var a = 1, b = 2;\n';
    assert.equal(actual, expected);
  });

  it('should work in assignment expressions', function() {
    eval(compile([
      'var spy = sinon.spy();',
      'var x;',
      'spy([x] = [123]);',
      'expect(spy).to.have.been.calledWith([123]);',
      'expect(x).to.equal(123);'
    ].join('\n')));
  });

  it('should support assignment expression pattern with defaults', function() {
    eval(compile([
      'var z = {};',
      'var { x: { y } = { y: 5 } } = z;',
      'expect(y).to.equal(5);'
    ].join('\n')));
  });

  it('should support assignment from call expression', function() {
    eval(compile([
      'function f() { return [1, 2]; }',
      'var [a, b] = f();',
      'expect(a).to.equal(1);',
      'expect(b).to.equal(2);'
    ].join('\n')));    
  });

  it('should support chaining', function() {
    eval(compile([
      'var a, b, c, d;',
      '({ a, b } = { c, d } = { a: 1, b: 2, c: 3, d: 4});',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 3);',
      'assert.equal(d, 4);'
    ].join('\n')));
  });

  // it('should respect default precedence', function() {
  //   eval(compile([
  //     'var f0 = function (a, b = a, c = b) {',
  //     '  return [a, b, c];',
  //     '};',
  //     '',
  //     'assert.deepEqual(f0(1), [1, 1, 1]);',
  //     '',
  //     'var f1 = function ({a}, b = a, c = b) {',
  //     '  return [a, b, c];',
  //     '};',
  //     '',
  //     'assert.deepEqual(f1({a: 1}), [1, 1, 1]);',
  //     '',
  //     'var f2 = function ({a}, b = a, c = a) {',
  //     '  return [a, b, c];',
  //     '};',
  //     '',
  //     'assert.deepEqual(f2({a: 1}), [1, 1, 1]);'
  //   ].join('\n')));
  // });

  it('should support empty items on lhs', function() {
    eval(compile([
      'var [, a, [b], [c], d] = ["foo", "hello", [", ", "junk"], ["world"]];',
      'assert.equal(a, "hello");',
      'assert.equal(b, ", ");',
      'assert.equal(c, "world");',
      'assert.equal(d, undefined);'
    ].join('\n')));
  });

  it('should reject empty object pattern', function() {
    eval(compile([
      'assert.throws(function () {',
      '  var {} = null;',
      '}, /Cannot destructure undefined/);'
    ].join('\n')));
  });

  it('assignment to member expressions', function() {
    eval(compile([
      'var foo = {};',
      '[foo.foo, foo.bar] = [1, 2];',
      'assert.deepEqual([foo.foo, foo.bar], [1, 2]);'
    ].join('\n')));
  });

  it('mixed object/array assignments', function() {
    eval(compile([
      'var rect = {topLeft: [0, 1], bottomRight: [2, 3]};',
      'var {topLeft: [x1, y1], bottomRight: [x2, y2] } = rect;',
      'assert.deepEqual([x1, y1, x2, y2], [0, 1, 2, 3]);'
    ].join('\n')));
  });

  it('multiple variable declarations', function() {
    eval(compile([
      'var coords = {x: 1, y: 2};',
      'var {x, y} = coords, foo = "bar";',
      'assert.deepEqual([x, y], [1, 2]);',
      'assert.equal(foo, "bar");'
    ].join('\n')));
  });

  it('deeply nested object destructuring assignments', function() {
    eval(compile([
      'var rect = {topLeft: {x: 0, y: 1}, bottomRight: {x: 2, y: 3}};',
      'var {topLeft: {x: x1, y: y1}, bottomRight: {x: x2, y: y2}} = rect;',
      'assert.deepEqual([x1, y1, x2, y2], [0, 1, 2, 3]);'
    ].join('\n')));
  });

  it('handles impure', function() {
    eval(compile([
      'var key, x, y, z;',
      'key = 1;',
      'var { [key++]: y, ...x } = { 1: 1, a: 1 };',
      'assert.deepEqual(x, { a: 1 });',
      'assert.equal(key, 2);',
      'assert.equal(y, 1);'
    ].join('\n')));
  });

  it('takes care of order', function() {
    eval(compile([
      'var key, x, y, z;',
      'key = 1;',
      'var { [++key]: y, [++key]: z, ...rest} = {2: 2, 3: 3};',
      'assert.equal(y, 2);',
      'assert.equal(z, 3);'
    ].join('\n')));
  });

  it('leaves pure, computed properties as-is', function() {
    eval(compile([
      'var key, x, y, z;',
      'key = 2;',
      '({ [key]: y, z, ...x } = {2: "two", z: "zee"});',
      'assert.equal(y, "two");',
      'assert.deepEqual(x, {});',
      'assert.equal(z, "zee");'
    ].join('\n')));
  });

  it('evaluates rhs before lhs', function() {
    eval(compile([
      'var x, y;',
      'var order = [];',
      'function left() {',
      '  order.push("left");',
      '  return 0;',
      '}',
      'function right() {',
      '  order.push("right");',
      '  return {};',
      '}',
      'var { [left()]: y, ...x} = right();',
      'assert.deepEqual(order, ["right", "left"]);'
    ].join('\n')));
  });

  it('should support spread generators', function() {
    eval(compile([
      'function* f() {',
      '  for (var i = 0; i < 3; i++) {',
      '    yield i;',
      '  }',
      '}',
      'var [...xs] = f();',
      'assert.deepEqual(xs, [0, 1, 2]);'
    ].join('\n')));
  });

  it('for-of', function() {
    eval(compile([
      'var list = [[0, 1, 2]];',
      'var iterations = 0;',
      'for (var [x, y, z] of list) {',
      '  assert.deepEqual([x, y, z], [0, 1, 2]);',
      '  iterations++;',
      '}',
      'assert.equal(iterations, 1);'
    ].join('\n')));
  });

  it('for-let', function() {
    eval(compile([
      'var list = [0, 1];',
      'var iterations = 0;',
      'for (let [a, b] = list; ;) {',
      '  assert.deepEqual([a, b], list);',
      '  iterations++;',
      '  break;',
      '}',
      'assert.equal(iterations, 1);'
    ].join('\n')));
  });

  it('for-in', function() {
    eval(compile([
      'var foo = {ab: 1, bc: 2};',
      'var vals = {a: [], b: [], c: []};',
      'for (var [a, b] in foo) {',
      '  var key = a + b;',
      '  vals[a].push(foo[key]);',
      '  vals[b].push(foo[key]);',
      '}',
      'assert.deepEqual(vals, {a: [1], b: [1, 2], c: [2]});'
    ].join('\n')));
  });

  it('destructuring assignment in for loop', function() {
    eval(compile([
      'var list = [1, 2, 3, 4];',
      'var ret = [];',
      'for (let i = 0, { length } = list; i < length; i++) {',
      '  ret.push(list[i]);',
      '}',
      'assert.deepEqual(list, ret);'
    ].join('\n')));
  });

  it('for-in object assignment', function() {
    eval(compile([
      'var vals = [];',
      'for ({ length: k } in { abc: 3, de: 5 }) {',
      '  vals.push(k);',
      '}',
      'assert.deepEqual(vals, [3, 2]);'
    ].join('\n')));
  });

  it('catch expressions', function() {
    eval(compile([
      'var val;',
      'try {',
      '  throw new Error("foo");',
      '} catch ({message: val}) {}',
      'assert.equal(val, "foo");'
    ].join('\n')));
  });

  it('function key with object rest spread', function() {
    eval(compile([
      'const { [(() => 1)()]: a, ...rest } = { 1: "a" , 2: "b"};',
      'assert.equal(a, "a");',
      'assert.deepEqual(rest, {2: "b"});'
    ].join('\n')));
  });

  it('arrow function no block', function() {
    eval(compile([
      'var a, b;',
      'var ret = (() => [{length: a}, b] = ["abc", 2])();',
      'assert.deepEqual(ret, ["abc", 2]);',
      'assert.equal(a, 3);',
      'assert.equal(b, 2);'
    ].join('\n')));
  });

  it('const', function() {
    eval(compile([
      'const getState = () => ({});',
      'const { data: { courses: oldCourses = [] } = {} } = getState();',
      'assert.deepEqual(oldCourses, []);'
    ].join('\n')));
  });

  it('number key with object rest spread', function() {
    eval(compile([
      'var foo = {',
      '  1: "a",',
      '  2: "b",',
      '  3: "c",',
      '};',
      '',
      'var { [1]: bar, ...rest } = foo;',
      '',
      'assert.equal(bar, "a");',
      'assert.deepEqual(rest, { 2: "b", 3: "c" });'
    ].join('\n')));
  });

  it('should support es7 object rest properties', function() {
    eval(compile([
      'var z = {a: "A", x: "X"};',
      'var { ...x } = z;',
      'assert.deepEqual(x, z);'
    ].join('\n')));
    eval(compile([
      'var z = {a: "A", x: "X"};',
      'var { x, ...y } = z;',
      'assert.equal(x, "X");',
      'assert.deepEqual(y, {a: "A"});'
    ].join('\n')));

    // TK parameter rest
    // eval(compile([
    //   '(function({ x, ...y }) {',
    //   '  assert.equal(x, "X");',
    //   '  assert.deepEqual(y, {a: "A"});',
    //   '})({a: "A", x: "X"});'
    // ].join('\n')));

    // I think this is actually a bug in babel proper
    // eval(compile([
    //   'var z = {a: "A", x: "X", "A": "!"};',
    //   'var x = "a";',
    //   'var { [x]: x, ...y } = z;',
    //   'assert.equal(x, "A");',
    //   'assert.deepEqual(y, {x: "X", A: "!"});'
    // ].join('\n')));
  });
});
