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

describe('spread expressions', function() {
  it('should concat to arguments', function() {
    eval(compile([
      'function bar(one, two, three) {',
      '  return [one, two, three];',
      '}',
      '',
      'function foo() {',
      '  return bar("test", ...arguments).join(",");',
      '}',
      '',
      'assert.equal(foo("foo", "bar"), "test,foo,bar");'
    ].join('\n')));
  });

  it('should support spread as first item in array literal', function() {
    eval(compile([
      'var parts = ["head", "shoulders"];',
      'var lyrics = [...parts, "knees", "and", "toes"];',
      'assert.equal(lyrics.join(" "), "head shoulders knees and toes")',
    ].join('\n')));
  });

  it('should support spread in the middle of an array literal', function() {
    eval(compile([
      'var b = 0, c = [1, 2, 3], d = 4;',
      'var a = [b, ...c, d];',
      'assert.equal(a.join(""), "01234")',
    ].join('\n')));
  });

  it('should support multiple spreads in an array literal', function() {
    eval(compile([
      'var b = 0, c = [1, 2, 3], d = 4, e = 5, f = [6, 7];',
      'var a = [b, ...c, d, e, ...f];',
      'assert.equal(a.join(""), "01234567")'
    ].join('\n')));
  });

  it('should support contexted computed method call with multiple args', function() {
    eval(compile([
      'var obj = {',
      '  test: function(a, b, c, d, e) {',
      '    return [a, b, c, d, e];',
      '  }',
      '};',
      'var method = "test";',
      'var foo = "foo";',
      'var bar = "bar";',
      'var args = ["baz", 1, 1];',
      'var actual = obj[method](foo, bar, ...args);',
      'assert.deepEqual(actual, ["foo", "bar", "baz", 1, 1]);'
    ].join('\n')));
  });

  it('should support `new` expressions', function() {
    eval(compile([
      'function Numbers(a, b, c, d) { this.nums = [a, b, c, d]; }',
      'var nums = [2, 3, 4];',
      'var numsObj1 = new Numbers(...nums);',
      'var numsObj2 = new Numbers(1, ...nums);',
      'assert.deepEqual(numsObj1.nums, [2, 3, 4, undefined]);',
      'assert.deepEqual(numsObj2.nums, [1, 2, 3, 4]);'
    ].join('\n')));
  });
});
