/* eslint-disable no-template-curly-in-string */
var compile, assert;

if (typeof window === 'object') {
  compile = window.pregenerator.compile;
  assert = window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  compile = require('pregenerator/test').compile;
  var chai = require('chai');
  assert = global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  global.sinon = require('sinon');
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

  it('should optimize unpacking of array literals with reassignment, holes on rhs', function() {
    eval(compile([
      'var [a, b] = [1, 2];',
      '[a, b] = [, 2];',
      'assert.equal(b, 2);',
      'assert.equal(a, undefined);'
    ].join('\n')));
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

  it('should respect default precedence', function() {
    eval(compile([
      'var f0 = function (a, b = a, c = b) {',
      '  return [a, b, c];',
      '};',
      '',
      'assert.deepEqual(f0(1), [1, 1, 1]);',
      '',
      'var f1 = function ({a}, b = a, c = b) {',
      '  return [a, b, c];',
      '};',
      '',
      'assert.deepEqual(f1({a: 1}), [1, 1, 1]);',
      '',
      'var f2 = function ({a}, b = a, c = a) {',
      '  return [a, b, c];',
      '};',
      '',
      'assert.deepEqual(f2({a: 1}), [1, 1, 1]);'
    ].join('\n')));
  });

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

  it('arrow function no block (destructuring plugin alone)', function() {
    var expected = [
      'var ret = (() => {',
      '  var _ref = ["abc", 2];',
      '  a = _ref[0].length;',
      '  b = _ref[1];',
      '  return _ref;',
      '})();',
      ''
    ].join('\n');
    var actual = compile(
      'var ret = (() => [{length: a}, b] = ["abc", 2])();',
      {plugins: ['destructuring']});
    assert.equal(actual, expected);
  });

  it('const', function() {
    eval(compile([
      'const getState = () => ({});',
      'const { data: { courses: oldCourses = [] } = {} } = getState();',
      'assert.deepEqual(oldCourses, []);'
    ].join('\n')));
  });

  it('const (destructuring plugin alone)', function() {
    var actual = compile(
      'const { data: { courses: oldCourses = [] } = {} } = getState();',
      {plugins: ['destructuring']});
    var expected = [
      'const _getState = getState(),',
      ' _getState$data = _getState.data,',
      ' _getState$data2 = _getState$data === undefined ? {} : _getState$data,',
      ' _getState$data2$cours = _getState$data2.courses,',
      ' oldCourses = _getState$data2$cours === undefined ? [] : _getState$data2$cours;\n'
    ].join('');
    assert.equal(actual, expected);
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

    eval(compile([
      '(function({ x, ...y }) {',
      '  assert.equal(x, "X");',
      '  assert.deepEqual(y, {a: "A"});',
      '})({a: "A", x: "X"});'
    ].join('\n')));

    // I think this is actually a bug in babel proper
    // eval(compile([
    //   'var z = {a: "A", x: "X", "A": "!"};',
    //   'var x = "a";',
    //   'var { [x]: x, ...y } = z;',
    //   'assert.equal(x, "A");',
    //   'assert.deepEqual(y, {x: "X", A: "!"});'
    // ].join('\n')));
  });

  it('template literals', function() {
    eval(compile([
      'var {[`a`]: b, ...rest} = {a: 1, c: 3};',
      'assert.equal(b, 1);',
      'assert.deepEqual(rest, {c: 3});',
    ].join('\n')));
  });

  it('issue 9834', function() {
    eval(compile([
      'var prefix = \'address_\';',
      'const input = {',
      '  given_name: \'Mark\',',
      '  last_name: \'Twain\',',
      '  country: \'US\',',
      '  address_state: \'CT\',',
      '  address_city: \'Hartford\',',
      '  address_postal: \'06105\',',
      '};',
      '',
      'const {',
      '  given_name: givenName,',
      '  \'last_name\': lastName,',
      '  [`country`]: countryCode,',
      '  [prefix + \'state\']: state,',
      '  [`${prefix}city`]: city,',
      '  ...rest',
      '} = input;',
      '',
      'assert.equal(givenName, \'Mark\');',
      'assert.equal(lastName, \'Twain\');',
      'assert.equal(countryCode, \'US\');',
      'assert.equal(state, \'CT\');',
      'assert.equal(city, \'Hartford\');',
      'assert.deepEqual(rest, {address_postal: \'06105\'});'
    ].join('\n')));
  });

  it('swap assignment', function() {
    eval(compile([
      'var a = "A";',
      'var b = "B";',
      'if (true) [a, b] = [b, a];',
      'assert.equal(a, "B");',
      'assert.equal(b, "A");'
    ].join('\n')));
  });

  it('parameters', function() {
    eval(compile([
      'var rect = {topLeft: {x: 0, y: 1}, bottomRight: {x: 2, y: 3}};',
      '',
      'function somethingAdvanced({',
      '  topLeft: {x: x1, y: y1} = {}, bottomRight: {x: x2, y: y2} = {}}, p2, p3',
      ') {',
      '  assert.equal(x1, rect.topLeft.x);',
      '  assert.equal(y1, rect.topLeft.y);',
      '  assert.equal(x2, rect.bottomRight.x);',
      '  assert.equal(y2, rect.bottomRight.y);',
      '  assert.equal(p2, 4);',
      '  assert.equal(p3, 5);',
      '}',
      '',
      'somethingAdvanced(rect, 4, 5);',
      '',
      'function unpackObject({title: title, author: author}) {',
      '  return title + " " + author;',
      '}',
      '',
      'assert.equal(unpackObject({title: "title", author: "author"}), "title author");',
      '',
      'var unpackArray = function ([a, b, c], [x, y, z]) {',
      '  return a + b + c;',
      '};',
      '',
      'assert.equal(unpackArray(["hello", ", ", "world"], [1, 2, 3]), "hello, world");'
    ].join('\n')));
  });

  it('parameters with array rest', function() {
    eval(compile([
      'function foo([x, y, ...rest]) {',
      '  assert.equal(x, 1);',
      '  assert.equal(y, 2);',
      '  assert.deepEqual(rest, [3, 4]);',
      '}',
      'foo([1, 2, 3, 4]);'
    ].join('\n')));
  });

  it('array unpacking of array expression with holes', function() {
    eval(compile([
      'var [, b] = [1, 2];',
      'assert.equal(b, 2);'
    ].join('\n')));
  });

  it('array unpacking of array expression with nested holes', function() {
    eval(compile([
      'var [[, a], b] = [[0, 1], 2];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);'
    ].join('\n')));
  });

  it('array unpacking of array expression with lhs spread', function() {
    eval(compile([
      'var [a, b, ...rest] = [1, 2, 3, 4];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.deepEqual(rest, [3, 4]);'
    ].join('\n')));
  });

  it('array unpacking of array expression with nested lhs spread', function() {
    eval(compile([
      'var [a, [b, ...rest], c] = [1, [2, 3, 4], 5];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 5);',
      'assert.deepEqual(rest, [3, 4]);'
    ].join('\n')));
  });

  it('array unpacking of array expression with rhs spread', function() {
    eval(compile([
      'var rest = [3];',
      'var [a, b, c] = [1, 2, ...rest];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 3);'
    ].join('\n')));
  });

  it('array unpacking of array expression with rhs call', function() {
    eval(compile([
      'function fn() { return 3; };',
      'var [a, b, c] = [1, 2, fn()];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 3);'
    ].join('\n')));
  });

  it('array unpacking of array expression with rhs member expression', function() {
    eval(compile([
      'var obj = {x: 3};',
      'var [a, b, c] = [1, 2, obj.x];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 3);'
    ].join('\n')));
  });

  it('array unpacking with empty lhs', function() {
    eval(compile([
      'var [] = [1, 2];',
    ].join('\n')));
  });

  it('array unpacking with empty lhs and rhs', function() {
    eval(compile('var [] = [];'));
  });

  it('array unpacking with nested empty lhs and rhs', function() {
    eval(compile([
      'var [a, [,]] = [1, [,]];',
      'assert.equal(a, 1);'
    ].join('\n')));
  });

  it('array unpacking of array expression with rhs nested spread', function() {
    eval(compile([
      'var rest = [3];',
      'var [a, b, [c]] = [1, 2, [...rest]];',
      'assert.equal(a, 1);',
      'assert.equal(b, 2);',
      'assert.equal(c, 3);'
    ].join('\n')));
  });

  it('array unpacking swap in arrow function', function() {
    eval(compile([
      'var a = "A", b = "B";',
      'var fn = () => [a, b] = [b, a];',
      'fn();',
      'assert.equal(a, "B");',
      'assert.equal(b, "A");'
    ].join('\n')));
  });

  it('for-in loop destructuring with empty body and completion value', function() {
    eval(compile([
      'var k;',
      'var ret = eval(compile("for ({ length: k } in { abc: 5 });"));',
      'assert.equal(k, 3);',
      'assert.equal(ret, undefined);'
    ].join('\n')));
  });
});
