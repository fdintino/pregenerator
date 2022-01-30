/* eslint-disable no-template-curly-in-string */
var _compile;

if (typeof window === "object") {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  _compile = require("pregenerator").compile;
  var chai = require("chai");
  global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);
  global.sinon = require("sinon");
}

function compile(src) {
  return _compile(src, { allowReturnOutsideFunction: true });
}

describe("template literals", function () {
  it("single interpolation", function () {
    eval(
      compile(
        [
          'var bar = "bar";',
          "var foobar = `foo${bar}`;",
          'assert.equal(foobar, "foobar");',
        ].join("\n")
      )
    );
  });
  it("multiple interpolations", function () {
    eval(
      compile(
        [
          'var foo = "foo";',
          'var bar = "bar";',
          "var foobar = `${foo}${bar}`;",
          'assert.equal(foobar, "foobar");',
        ].join("\n")
      )
    );
  });
  it("multiple interpolations and string literals", function () {
    eval(
      compile(
        [
          'var bar = "bar";',
          'var baz = "baz";',
          "var foobar = `foo${bar}${baz}!`;",
          'assert.equal(foobar, "foobarbaz!");',
        ].join("\n")
      )
    );
  });
  it("escapes quotes", function () {
    eval(
      compile(
        [
          'var foo = "foo";',
          'var bar = "bar";',
          "var foobar = `'${foo}' \"${bar}\"`;",
          'assert.equal(foobar, "\'foo\' \\"bar\\"");',
        ].join("\n")
      )
    );
  });
  it("expression first", function () {
    eval(
      compile(
        [
          "var foo = 5;",
          "var bar = 10;",
          "var baz = 15;",
          "",
          'var example = `${"a"}`;',
          "var example2 = `${1}`;",
          "var example3 = 1 + `${foo}${bar}${baz}`;",
          "var example4 = 1 + `${foo}bar${baz}`;",
          'var example5 = `${""}`;',
          'assert.equal(example, "a");',
          'assert.strictEqual(example2, "1");',
          'assert.strictEqual(example3, "151015");',
          'assert.equal(example4, "15bar15");',
          'assert.strictEqual(example5, "");',
        ].join("\n")
      )
    );
  });

  it("functions", function () {
    eval(
      compile(
        [
          'var x = "foo";',
          'var bar = "bar";',
          "var _ = {test: function(s) { return s; }};",
          "var foo = `test ${_.test(x)} ${bar}`;",
          'assert.equal(foo, "test foo bar");',
        ].join("\n")
      )
    );
  });

  it("literals", function () {
    eval(
      compile(
        [
          'var f = "f", b = "b", baz = "baz";',
          "var foo = `${1}${f}oo${true}${b}ar${0}${baz}`;",
        ].join("\n")
      )
    );
  });

  it("multiline", function () {
    eval(
      compile(
        [
          "var o = `wow",
          "this is",
          "actually multiline!`;",
          'assert.equal(o, "wow\\nthis is\\nactually multiline!");',
        ].join("\n")
      )
    );
  });

  it("no variables", function () {
    eval(
      compile(["var foo = `test`;", 'assert.equal(foo, "test");'].join("\n"))
    );
  });

  // it('call order 1', function() {
  //   eval(compile([
  //     'const calls = [];',
  //     '',
  //     '`',
  //     '  ${',
  //     '    (calls.push(1), {',
  //     '      [Symbol.toPrimitive](){',
  //     '        calls.push(2);',
  //     '        return \'foo\';',
  //     '      }',
  //     '    })',
  //     '  }',
  //     '  ${',
  //     '    (calls.push(3), {',
  //     '      [Symbol.toPrimitive](){',
  //     '        calls.push(4);',
  //     '        return \'bar\';',
  //     '      }',
  //     '    })',
  //     '  }',
  //     '`;',
  //     '',
  //     'assert.deepEqual(calls, [1, 2, 3, 4]);',
  //     ''
  //   ].join('\n')));
  // });

  it("statement", function () {
    eval(
      compile(
        [
          'var foo = "foo";',
          'var bar = "bar";',
          "var foobar = `test ${foo + bar}`;",
          'assert.equal(foobar, "test foobar");',
        ].join("\n")
      )
    );
  });
});
