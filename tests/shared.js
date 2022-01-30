/* global Symbol */
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function () {
  var exports = typeof module === "object" ? module.exports : {};
  var assert;

  if (typeof window === "object") {
    assert = window.chai.assert;
  } else {
    assert = require("chai").assert;
  }

  if (typeof Symbol === "function") {
    exports.Symbol = Symbol;
  } else {
    exports.Symbol = function Symbol() {};
  }

  if (!exports.Symbol.iterator) {
    exports.Symbol.iterator = "@@iterator";
  }

  exports.check = function check(g, yields, returnValue) {
    var i;

    for (i = 0; i < yields.length; ++i) {
      var info = g.next(i);
      assert.deepEqual(info.value, yields[i]);
      assert.strictEqual(info.done, false);
    }

    assert.deepEqual(i > 0 ? g.next(i) : g.next(), {
      value: returnValue,
      done: true,
    });
  };

  exports.assertAlreadyFinished = function assertAlreadyFinished(generator) {
    assert.deepEqual(generator.next(), {
      value: undefined,
      done: true,
    });
  };

  if (typeof module !== "object") {
    window.shared = exports;
  }
})();
