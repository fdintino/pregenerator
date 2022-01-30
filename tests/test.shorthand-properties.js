var compile;

if (typeof window === "object") {
  compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
} else {
  compile = require("pregenerator").compile;
  global.assert = require("chai").assert;
}

describe("shorthand properties", function () {
  it("method plain", function () {
    eval(
      compile(
        [
          "var obj = {",
          "  method() {",
          "    return 5 + 5;",
          "  }",
          "};",
          "assert.equal(obj.method(), 10);",
        ].join("\n")
      )
    );
  });

  it("mixed", function () {
    eval(
      compile(
        [
          "var x = 1;",
          "var y = 2;",
          'var coords = { x, y, foo: "bar" };',
          'assert.deepEqual(coords, {x: 1, y: 2, foo: "bar"});',
        ].join("\n")
      )
    );
  });

  it("multiple", function () {
    eval(
      compile(
        [
          "var x = 1, y = 2;",
          "var coords = { x, y };",
          "assert.deepEqual(coords, {x: 1, y: 2});",
        ].join("\n")
      )
    );
  });

  it("single", function () {
    eval(
      compile(
        [
          "var x = 1;",
          "var coords = { x };",
          "assert.deepEqual(coords, {x: 1});",
        ].join("\n")
      )
    );
  });
});
