/* eslint-disable quotes */
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// These tests run only in translation, not in native Node.

var shared, check, _compile, assertAlreadyFinished;

if (typeof window === "object") {
  _compile = window.pregenerator.compile;
  window.assert = window.chai.assert;
  shared = window.shared;
  check = shared.check;
  assertAlreadyFinished = shared.assertAlreadyFinished;
} else {
  _compile = require("pregenerator").compile;
  global.assert = require("chai").assert;
  shared = require("./shared.js");
  check = shared.check;
  assertAlreadyFinished = shared.assertAlreadyFinished;
}

function compile(src) {
  return _compile(src, { allowReturnOutsideFunction: true });
}

describe("@@iterator", function () {
  it(
    "is defined on Generator.prototype and returns this",
    new Function(
      "Symbol",
      compile(
        [
          "return function() {",
          "  function *gen(){}",
          "  var iterator = gen();",
          "  assert.ok(!iterator.hasOwnProperty(Symbol.iterator));",
          "  assert.ok(!Object.getPrototypeOf(iterator).hasOwnProperty(Symbol.iterator));",
          "  assert.ok(Object.getPrototypeOf(Object.getPrototypeOf(",
          "    Object.getPrototypeOf(iterator)",
          "  )).hasOwnProperty(Symbol.iterator));",
          "  assert.strictEqual(iterator[Symbol.iterator](), iterator);",
          "};",
        ].join("\n")
      )
    )(shared.Symbol)
  );
});

describe("throw", function () {
  it(
    "should complete throwing generator",
    new Function(
      "Symbol",
      "assertAlreadyFinished",
      compile(
        [
          "return function() {",
          "  function *gen(x) {",
          "    throw 1;",
          "  }",
          "",
          "  var u = gen();",
          "",
          "  try {",
          "    u.next();",
          "  } catch (err) {",
          "    assert.strictEqual(err, 1);",
          "  }",
          "",
          "  assertAlreadyFinished(u);",
          "};",
        ].join("\n")
      )
    )(shared.Symbol, assertAlreadyFinished)
  );

  it(
    "should complete yielding/throwing generator",
    new Function(
      "Symbol",
      "assertAlreadyFinished",
      compile(
        [
          "return function() {",
          "  function *gen(x) {",
          "    yield 2;",
          "    throw 1;",
          "  }",
          "",
          "  var u = gen();",
          "",
          "  u.next();",
          "",
          "  try {",
          "    u.throw(2);",
          "  } catch (err) {",
          "    assert.strictEqual(err, 2);",
          "  }",
          "",
          "  assertAlreadyFinished(u);",
          "};",
        ].join("\n")
      )
    )(shared.Symbol, assertAlreadyFinished)
  );
});

describe("completed generator", function () {
  it(
    "should refuse to resume",
    new Function(
      "Symbol",
      "assertAlreadyFinished",
      compile(
        [
          "function *gen() {",
          "  return 'ALL DONE';",
          "}",
          "return function() {",
          "  var g = gen();",
          "",
          "  assert.deepEqual(g.next(), {",
          "    value: 'ALL DONE', done: true",
          "  });",
          "",
          "  assertAlreadyFinished(g);",
          "};",
        ].join("\n")
      )
    )(shared.Symbol, assertAlreadyFinished)
  );
});

describe("delegate yield", function () {
  it(
    "should support any iterable argument",
    new Function(
      "Symbol",
      "check",
      compile(
        [
          "return function() {",
          "  function *gen() {",
          "    yield 0;",
          "    yield* [",
          "      yield 'one',",
          "      yield 'two',",
          "      yield 'three'",
          "    ];",
          "    yield 5;",
          "  }",
          "",
          "  check(gen(), [0, 'one', 'two', 'three', 2, 3, 4, 5]);",
          "",
          "  function *string() {",
          "    return yield* 'asdf';",
          "  }",
          "",
          "  check(string(), ['a', 's', 'd', 'f']);",
          "};",
        ].join("\n")
      )
    )(shared.Symbol, check)
  );
});
