var _compile;

if (typeof window === "object") {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
} else {
  _compile = require("pregenerator").compile;
  global.assert = require("chai").assert;
  global.sinon = require("sinon");
}

function compile(src) {
  return _compile(src, { allowReturnOutsideFunction: true });
}

describe("spread expressions", function () {
  it("should concat to arguments", function () {
    eval(
      compile(
        [
          "function bar(one, two, three) {",
          "  return [one, two, three];",
          "}",
          "",
          "function foo() {",
          '  return bar("test", ...arguments).join(",");',
          "}",
          "",
          'assert.equal(foo("foo", "bar"), "test,foo,bar");',
        ].join("\n")
      )
    );
  });

  it("should support spread as first item in array literal", function () {
    eval(
      compile(
        [
          'var parts = ["head", "shoulders"];',
          'var lyrics = [...parts, "knees", "and", "toes"];',
          'assert.equal(lyrics.join(" "), "head shoulders knees and toes")',
        ].join("\n")
      )
    );
  });

  it("should support spread in the middle of an array literal", function () {
    eval(
      compile(
        [
          "var b = 0, c = [1, 2, 3], d = 4;",
          "var a = [b, ...c, d];",
          'assert.equal(a.join(""), "01234")',
        ].join("\n")
      )
    );
  });

  it("should support multiple spreads in an array literal", function () {
    eval(
      compile(
        [
          "var b = 0, c = [1, 2, 3], d = 4, e = 5, f = [6, 7];",
          "var a = [b, ...c, d, e, ...f];",
          'assert.equal(a.join(""), "01234567")',
        ].join("\n")
      )
    );
  });

  it("should support contexted computed method call with multiple args", function () {
    eval(
      compile(
        [
          "var obj = {",
          "  test: function(a, b, c, d, e) {",
          "    return [a, b, c, d, e];",
          "  }",
          "};",
          'var method = "test";',
          'var foo = "foo";',
          'var bar = "bar";',
          'var args = ["baz", 1, 1];',
          "var actual = obj[method](foo, bar, ...args);",
          'assert.deepEqual(actual, ["foo", "bar", "baz", 1, 1]);',
        ].join("\n")
      )
    );
  });

  it("should support `new` expressions", function () {
    eval(
      compile(
        [
          "function Numbers(a, b, c, d) { this.nums = [a, b, c, d]; }",
          "var nums = [2, 3, 4];",
          "var numsObj1 = new Numbers(...nums);",
          "var numsObj2 = new Numbers(1, ...nums);",
          "assert.deepEqual(numsObj1.nums, [2, 3, 4, undefined]);",
          "assert.deepEqual(numsObj2.nums, [1, 2, 3, 4]);",
        ].join("\n")
      )
    );
  });

  it("does not call concat method on spread arrays", function () {
    eval(
      compile(
        [
          "const arr = [];",
          "",
          "arr.concat = function() {",
          '  throw new Error("Should not be called");',
          "};",
          "let x;",
          "",
          "(function() {",
          "  x = [...arr];",
          "}());",
          "",
          "assert.notEqual(x, arr);",
        ].join("\n")
      )
    );
  });

  it("properly resolves scope inside switch statement", function () {
    eval(
      compile(
        [
          "var fn = sinon.spy();",
          "",
          "var args = [1, 2, 3];",
          "var obj = {obj: {fn}};",
          "",
          "switch (true){",
          "  case true:",
          "    obj.obj.fn(...args);",
          "    break;",
          "}",
          "",
          "assert.deepEqual(fn.getCall(0).args, args);",
        ].join("\n")
      )
    );
  });

  it("array literal first", function () {
    eval(
      compile(
        [
          'var parts = ["head", "shoulders"]',
          'var lyrics = [...parts, "knees", "and", "toes"];',
          'assert.deepEqual(lyrics.join(" "), "head shoulders knees and toes");',
        ].join("\n")
      )
    );
  });

  it("toConsumableArray clones the array", function () {
    eval(
      compile(
        [
          "const arr = [];",
          "const foo = () => arr;",
          "",
          "const x = [...foo()];",
          "",
          "assert.notEqual(x, arr);",
        ].join("\n")
      )
    );
  });

  it("known rest", function () {
    eval(
      compile(
        [
          "function foo(...bar) {",
          "  return [...bar];",
          "}",
          "",
          "var ret = foo(0, 1, 2);",
          "assert.deepEqual(ret, [0, 1, 2]);",
        ].join("\n")
      )
    );
  });

  it("arguments concat", function () {
    eval(
      compile(
        [
          "function foo() {",
          '  return bar("test", ...arguments);',
          "}",
          "",
          "function bar(one, two, three) {",
          "  return [one, two, three];",
          "}",
          "",
          'var ret = foo("foo", "bar");',
          'assert.deepEqual(ret, ["test", "foo", "bar"]);',
        ].join("\n")
      )
    );
  });

  it("arguments array", function () {
    eval(
      compile(
        [
          "function foo() {",
          "  const x = [...arguments];",
          "  assert.notEqual(x, arguments);",
          "}",
          "",
          "foo(1, 2);",
        ].join("\n")
      )
    );
  });

  it("iife this", function () {
    eval(
      compile(
        [
          "var a = 1;",
          "",
          "function Foo() {}",
          "Foo.prototype.bar = function bar(p = a) {",
          "  let a;",
          "  assert.equal(p, 1);",
          "  assert.equal(a, undefined);",
          "  return this;",
          "}",
          "",
          "var foo = new Foo();",
          "var ret = foo.bar();",
          "",
          "assert.equal(ret, foo);",
          "assert.equal(a, 1);",
        ].join("\n")
      )
    );
  });
});
