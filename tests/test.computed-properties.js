var shared, compile;

if (typeof window === 'object') {
  compile = window.pregenerator.compile;
  shared = window.shared;
  window.assert = window.chai.assert;
  window.expect = window.chai.expect;

  if (typeof Symbol === 'undefined') {
    window.Symbol = shared.Symbol;
  }
} else {
  compile = require('pregenerator/test').compile;
  shared = require('./shared.js');
  var chai = require('chai');
  global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  global.sinon = require('sinon');
}

describe('computed properties', function() {
  it('single', function() {
    eval(compile([
      'var foo = "foo";',
      'var obj = {',
      '  ["x" + foo]: "heh"',
      '};',
      'assert.equal(obj.xfoo, "heh");'
    ].join('\n')));
  });

  it('multiple', function() {
    eval(compile([
      'var foo = "foo";',
      'var bar = "bar";',
      'var obj = {',
      '  ["x" + foo]: "heh",',
      '  ["y" + bar]: "noo"',
      '};',
      'assert.deepEqual(obj, {xfoo: "heh", ybar: "noo"});'
    ].join('\n')));
  });

  it('mixed', function() {
    eval(compile([
      'var foo = "foo";',
      'var bar = "bar";',
      'var obj = {',
      '  ["x" + foo]: "heh",',
      '  ["y" + bar]: "noo",',
      '  foo: "foo",',
      '  bar: "bar"',
      '};',
      'assert.deepEqual(obj, {xfoo: "heh", ybar: "noo", foo: "foo", bar: "bar"});'
    ].join('\n')));
  });

  it('method', function() {
    eval(compile([
      'var foobar = "foo_bar";',
      'var obj = {',
      '  [foobar]() {',
      '    return "foobar";',
      '  },',
      '  test() {',
      '    return "regular method after computed property";',
      '  }',
      '};',
      'assert.equal(typeof obj.foo_bar, "function");'
    ].join('\n')));
  });

  it('accessors', function() {
    eval(compile([
      'var foobar = "foobar";',
      'var spy = sinon.spy();',
      '',
      'var obj = {',
      '  get [foobar]() {',
      '    spy("get", "foobar");',
      '    return "foobar";',
      '  },',
      '  set [foobar](x) {',
      '    spy("set", "foobar", x);',
      '  },',
      '  get test() {',
      '    spy("get", "test");',
      '    return "test";',
      '  },',
      '  set "test"(x) {',
      '    spy("set", "test", x);',
      '  }',
      '};',
      '',
      'assert.equal(obj.foobar, "foobar");',
      'assert.deepEqual(spy.getCall(0).args, ["get", "foobar"]);',
      '',
      'obj.foobar = "x";',
      'assert.deepEqual(spy.getCall(1).args, ["set", "foobar", "x"]);',
      '',
      'assert.equal(obj.test, "test");',
      'assert.deepEqual(spy.getCall(2).args, ["get", "test"]);',
      '',
      'obj.test = "x";',
      'assert.deepEqual(spy.getCall(3).args, ["set", "test", "x"]);',
    ].join('\n')));
  });

  it('argument', function() {
    eval(compile([
      'var foo = sinon.spy();',
      'var bar = "bar";',
      'foo({',
      '  [bar]: "foobar"',
      '});',
      'assert.deepEqual(foo.getCall(0).args, [{"bar": "foobar"}]);'
    ].join('\n')));
  });

  it('assignment', function() {
    eval(compile([
      'var bar = "bar";',
      'foo = {',
      '  [bar]: "foobar"',
      '};',
      'assert.deepEqual(foo, {bar: "foobar"});'
    ].join('\n')));
  });

  it('symbol', function() {
    eval(compile([
      'var k = Symbol();',
      'var foo = {',
      '  [Symbol.iterator]: "foobar",',
      '  get [k]() {',
      '    return k;',
      '  }',
      '};',
      '',
      'assert.equal(foo[Symbol.iterator], "foobar");',
      'assert.equal(foo[k], k);'
    ].join('\n')));
  });

  it('member expression', function() {
    eval(compile([
      'var foo = {bar: "bar"};',
      'var obj = {',
      '  ["x" + foo.bar]: "heh"',
      '};',
      'assert.deepEqual(obj, {"xbar": "heh"});'
    ].join('\n')));
  });

  it('two', function() {
    eval(compile([
      'var second = "second";',
      'var obj = {',
      '  first: "first",',
      '  [second]: "second",',
      '};',
      'assert.deepEqual(obj, {first: "first", second: "second"});'
    ].join('\n')));
  });
});
