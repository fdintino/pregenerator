var _compile, assert;

if (typeof window === 'object') {
  _compile = window.pregenerator.compile;
  assert = window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  _compile = require('pregenerator/test').compile;
  var chai = require('chai');
  assert = global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  global.sinon = require('sinon');
}

function compile(src) {
  return _compile(src, {allowReturnOutsideFunction: true});
}

describe('parameters', function() {
  it('default before last', function() {
    eval(compile([
      'function foo(a = "foo", b) {',
      '  return [a, b];',
      '}',
      'assert.deepEqual(foo(undefined, "bar"), ["foo", "bar"]);',
      'assert.deepEqual(foo("baz", "bar"), ["baz", "bar"]);'
    ].join('\n')));
  });

  it('default destructuring', function() {
    eval(compile([
      'function required(msg) {',
      '  throw new Error(msg);',
      '}',
      'function sum(',
      '  { arr = required("arr is required") } = { arr: arr = [] },',
      '  length = arr.length',
      ') {',
      '  let i = 0;',
      '  let acc = 0;',
      '  for (let item of arr) {',
      '    if (i >= length) return acc;',
      '    acc += item;',
      '    i++;',
      '  }',
      '  return acc;',
      '}',
      'assert.equal(sum({arr:[1,2]}), 3);'
    ].join('\n')));
  });

  it('default earlier params', function() {
    eval(compile([
      'function f(a, b = a, c = b) { return c; }',
      'assert.equal(3, f(3));'
    ].join('\n')));
  });

  it('default eval', function() {
    eval(compile([
      'let x = "outside";',
      'function outer(a = () => eval("x")) {',
      '  let x = "inside";',
      '  return a();',
      '}',
      'assert.equal(outer(), "outside");'
    ].join('\n')));
  });

  it('default rhs unsafe iife', function() {
    eval(compile([
      'let x = "outside";',
      'function outer({length: a} = x) {',
      '  let x = "inside";',
      '  return a;',
      '}',
      'assert.equal(outer(), 7);'
    ].join('\n')));
  });

  // babel bug
  // it('default eval lhs not identifier', function() {
  //   eval(compile([
  //     'let x = "outside";',
  //     'function outer({a} = {a: () => eval("x")}) {',
  //     '  let x = "inside";',
  //     '  return a();',
  //     '}',
  //     'assert.equal(outer(), "outside");'
  //   ].join('\n')));
  // });

  it('default iife 1128', function() {
    eval(compile([
      'const bar = true;',
      '',
      'function foo(a = bar, ...b) {',
      '  const bar = false;',
      '  assert.equal(b[0], 2);',
      '  assert.equal(b[1], 3);',
      '}',
      '',
      'foo(1, 2, 3);'
    ].join('\n')));
  });

  it('default multiple', function() {
    eval(compile([
      'var t = function (e = "foo", f = 5) {',
      '  return e + " bar " + f;',
      '};',
      '',
      'var a = function (e, f = 5) {',
      '  return e + " bar " + f;',
      '};',
      '',
      'assert.equal(t("baz"), "baz bar 5");',
      'assert.equal(t("baz", 2), "baz bar 2");',
      'assert.equal(t(undefined), "foo bar 5");',
      'assert.equal(a("baz"), "baz bar 5");',
      'assert.equal(a("baz", 2), "baz bar 2");'
    ].join('\n')));
  });

  it('default rest value', function() {
    eval(compile([
      'const a = 1;',
      'function rest(b = a, ...a) {',
      '  assert.equal(b, 1);',
      '}',
      'rest(undefined, 2);'
    ].join('\n')));
  });

  it('default rest index access', function() {
    eval(compile([
      'const a = 1;',
      'function rest(b = a, ...a) {',
      '  assert.equal(a[0], 2);',
      '}',
      'rest(undefined, 2);'
    ].join('\n')));
  });
  it('default rest length', function() {
    eval(compile([
      'const a = 1;',
      'function rest(b = a, ...a) {',
      '  assert.equal(a.length, 1);',
      '}',
      'rest(undefined, 2);'
    ].join('\n')));
  });

  it('default rest mix', function() {
    eval(compile([
      'function fn(',
      '  a,',
      '  b = 2,',
      '  {c, d},',
      '  e,',
      '  {f, g} = {}) {',
      '    return [a, b, c, d, e, f, g];',
      '}',
      'assert.deepEqual(',
      '  fn(1, undefined, {c: 3, d: 4}, 5),',
      '  [1, 2, 3, 4, 5, undefined, undefined]);'
    ].join('\n')));
  });

  it('destructuring rest', function() {
    eval(compile([
      'function t(x = "default", { a, b }, ...args) {',
      '  return [x, a, b, args];',
      '}',
      'var ret = t(1, {a: 2, b: 3}, 4, 5);',
      'assert.deepEqual(ret, [1, 2, 3, [4, 5]]);'
    ].join('\n')));
  });

  it('rest arguments deoptimization', function() {
    eval(compile([
      'function x (...rest) {',
      '  rest.push(3);',
      '  assert.equal(arguments[2], undefined);',
      '  return rest;',
      '}',
      'assert.deepEqual(x(1, 2), [1, 2, 3]);'
    ].join('\n')));
  });

  it('rest arrow functions', function() {
    eval(compile([
      'var concat = (...arrs) => {',
      '  var x = arrs[0];',
      '  var y = arrs[1];',
      '  return [x, y];',
      '};',
      'assert.deepEqual(concat("foo", "bar"), ["foo", "bar"]);'
    ].join('\n')));
  });

  it('rest binding deoptimization', function() {
    eval(compile([
      'const foo = (...args) => args = [2];',
      'assert.deepEqual(foo(1), [2]);'
    ].join('\n')));
  });

  it('rest deepest common ancestor earliest child', function() {
    var actual = compile([
      'function foo(...args) {',
      '  if (true) {',
      '    return args;',
      '  }',
      '}'
    ].join('\n'));
    var expected = [
      'function foo() {',
      '  if (true) {',
      '    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {',
      '      args[_key] = arguments[_key];',
      '    }',
      '    return args;',
      '  }',
      '}\n'
    ].join('\n');
    assert.equal(actual, expected);
  });

  it('rest spread optimization', function() {
    var actual = compile([
      'function foo(...bar) {',
      '  foo(...bar);',
      '}'
    ].join('\n'));
    var expected = [
      'function foo() {',
      '  foo.apply(undefined, arguments);',
      '}',
      ''
    ].join('\n');
    assert.equal(actual, expected);
  });

  it('rest spread deoptimization 1', function() {
    var actual = compile([
      'function foo(a, ...b) {',
      '  foo(...b);',
      '}'
    ].join('\n'));
    var expected = [
      'function foo(a) {',
      '  for (var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {',
      '    b[_key - 1] = arguments[_key];',
      '  }',
      '  foo.apply(undefined, b);',
      '}',
      ''
    ].join('\n');
    assert.equal(actual, expected);
  });

  it('rest spread deoptimization 2', function() {
    var actual = compile([
      'function foo(...b) {',
      '  foo(1, ...b);',
      '}'
    ].join('\n'));
    var expected = [
      'function foo() {',
      '  for (var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++) {',
      '    b[_key] = arguments[_key];',
      '  }',
      '  foo.apply(undefined, [1].concat(b));',
      '}',
      ''
    ].join('\n');
    assert.equal(actual, expected);
  });

  it('rest patterns', function() {
    eval(compile([
      'function foo(...{ length }) {',
      '  return length;',
      '}',
      '',
      'assert.equal(foo(1, 2, 3), 3);'
    ].join('\n')));
  });

  it('rest nested', function() {
    eval(compile([
      'function bar(val) {',
      '  return val;',
      '}',
      '',
      'function test(thing, ...args) {',
      '  const foo = (...args) => bar(...args);',
      '  {',
      '    let args = thing;',
      '    return foo(thing);',
      '  }',
      '}',
      '',
      'assert.deepEqual(test([1, 2, 3], 4, 5, 6), [1, 2, 3]);'
    ].join('\n')));
  });

  it('rest member expression optimization', function() {
    var actual = compile([
      'var t = function (...items) {',
      '  var x = items[0];',
      '  var y = items[1];',
      '}',
      '',
      'function t(...items) {',
      '  var x = items[0];',
      '  var y = items[1];',
      '}',
      '',
      'function t(...items) {',
      '  var a = [];',
      '  for (var i = 0; i < items.length; i++) {',
      '    a.push(i);',
      '  }',
      '  return a;',
      '}',
    ].join('\n'));
    var expected = [
      'var t = function () {',
      '  var x = arguments.length <= 0 ? undefined : arguments[0];',
      '  var y = arguments.length <= 1 ? undefined : arguments[1];',
      '};',
      'function t() {',
      '  var x = arguments.length <= 0 ? undefined : arguments[0];',
      '  var y = arguments.length <= 1 ? undefined : arguments[1];',
      '}',
      'function t() {',
      '  var a = [];',
      '  for (var i = 0; i < arguments.length; i++) {',
      '    a.push(i);',
      '  }',
      '  return a;',
      '}',
      ''
    ].join('\n');
    assert.equal(actual, expected);
  });
});
