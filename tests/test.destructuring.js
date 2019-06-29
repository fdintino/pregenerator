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
    var expected = 'var a = 1;\nvar b = 2;\n';
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
