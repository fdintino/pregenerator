var _compile, assert;

if (typeof window === "object") {
  _compile = window.pregenerator.compile;
  assert = window.assert = window.chai.assert;
  window.expect = window.chai.expect;
} else {
  _compile = require("pregenerator").compile;
  var chai = require("chai");
  assert = global.assert = chai.assert;
  global.expect = chai.expect;
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);
  global.sinon = require("sinon");
}

function compile(src, opts) {
  opts = opts || {};
  opts.allowReturnOutsideFunction = true;
  return _compile(src, opts);
}

describe.skip("parameters", function () {
  it("default before last", function () {
    eval(
      compile(
        [
          'function foo(a = "foo", b) {',
          "  return [a, b];",
          "}",
          'assert.deepEqual(foo(undefined, "bar"), ["foo", "bar"]);',
          'assert.deepEqual(foo("baz", "bar"), ["baz", "bar"]);',
        ].join("\n")
      )
    );
  });

  it("default destructuring", function () {
    eval(
      compile(
        [
          "function required(msg) {",
          "  throw new Error(msg);",
          "}",
          "function sum(",
          '  { arr = required("arr is required") } = { arr: arr = [] },',
          "  length = arr.length",
          ") {",
          "  let i = 0;",
          "  let acc = 0;",
          "  for (let item of arr) {",
          "    if (i >= length) return acc;",
          "    acc += item;",
          "    i++;",
          "  }",
          "  return acc;",
          "}",
          "assert.equal(sum({arr:[1,2]}), 3);",
        ].join("\n")
      )
    );
  });

  it("default earlier params", function () {
    eval(
      compile(
        [
          "function f(a, b = a, c = b) { return c; }",
          "assert.equal(3, f(3));",
        ].join("\n")
      )
    );
  });

  it("default eval", function () {
    eval(
      compile(
        [
          'let x = "outside";',
          'function outer(a = () => eval("x")) {',
          '  let x = "inside";',
          "  return a();",
          "}",
          'assert.equal(outer(), "outside");',
        ].join("\n")
      )
    );
  });

  it("default rhs unsafe iife", function () {
    eval(
      compile(
        [
          'let x = "outside";',
          "function outer({length: a} = x) {",
          '  let x = "inside";',
          "  return a;",
          "}",
          "assert.equal(outer(), 7);",
        ].join("\n")
      )
    );
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

  it("default iife 1128", function () {
    eval(
      compile(
        [
          "const bar = true;",
          "",
          "function foo(a = bar, ...b) {",
          "  const bar = false;",
          "  assert.equal(b[0], 2);",
          "  assert.equal(b[1], 3);",
          "}",
          "",
          "foo(1, 2, 3);",
        ].join("\n")
      )
    );
  });

  it("default multiple", function () {
    eval(
      compile(
        [
          'var t = function (e = "foo", f = 5) {',
          '  return e + " bar " + f;',
          "};",
          "",
          "var a = function (e, f = 5) {",
          '  return e + " bar " + f;',
          "};",
          "",
          'assert.equal(t("baz"), "baz bar 5");',
          'assert.equal(t("baz", 2), "baz bar 2");',
          'assert.equal(t(undefined), "foo bar 5");',
          'assert.equal(a("baz"), "baz bar 5");',
          'assert.equal(a("baz", 2), "baz bar 2");',
        ].join("\n")
      )
    );
  });

  it("default rest value", function () {
    eval(
      compile(
        [
          "const a = 1;",
          "function rest(b = a, ...a) {",
          "  assert.equal(b, 1);",
          "}",
          "rest(undefined, 2);",
        ].join("\n")
      )
    );
  });

  it("default rest index access", function () {
    eval(
      compile(
        [
          "const a = 1;",
          "function rest(b = a, ...a) {",
          "  assert.equal(a[0], 2);",
          "}",
          "rest(undefined, 2);",
        ].join("\n")
      )
    );
  });
  it("default rest length", function () {
    eval(
      compile(
        [
          "const a = 1;",
          "function rest(b = a, ...a) {",
          "  assert.equal(a.length, 1);",
          "}",
          "rest(undefined, 2);",
        ].join("\n")
      )
    );
  });

  it("default rest mix", function () {
    eval(
      compile(
        [
          "function fn(",
          "  a,",
          "  b = 2,",
          "  {c, d},",
          "  e,",
          "  {f, g} = {}) {",
          "    return [a, b, c, d, e, f, g];",
          "}",
          "assert.deepEqual(",
          "  fn(1, undefined, {c: 3, d: 4}, 5),",
          "  [1, 2, 3, 4, 5, undefined, undefined]);",
        ].join("\n")
      )
    );
  });

  it("destructuring rest", function () {
    eval(
      compile(
        [
          'function t(x = "default", { a, b }, ...args) {',
          "  return [x, a, b, args];",
          "}",
          "var ret = t(1, {a: 2, b: 3}, 4, 5);",
          "assert.deepEqual(ret, [1, 2, 3, [4, 5]]);",
        ].join("\n")
      )
    );
  });

  it("rest arguments deoptimization", function () {
    eval(
      compile(
        [
          "function x (...rest) {",
          "  rest.push(3);",
          "  assert.equal(arguments[2], undefined);",
          "  return rest;",
          "}",
          "assert.deepEqual(x(1, 2), [1, 2, 3]);",
        ].join("\n")
      )
    );
  });

  it("rest arrow functions", function () {
    eval(
      compile(
        [
          "var concat = (...arrs) => {",
          "  var x = arrs[0];",
          "  var y = arrs[1];",
          "  return [x, y];",
          "};",
          'assert.deepEqual(concat("foo", "bar"), ["foo", "bar"]);',
        ].join("\n")
      )
    );
  });

  it(
    "rest async arrow functions",
    new Function(
      "done",
      compile(
        [
          "return function(done) {",
          "  var concat = async (...arrs) => {",
          "    var x = arrs[0];",
          "    var y = arrs[1];",
          "    this;",
          "    return [x, y];",
          "  };",
          "",
          '  concat("foo", "bar").then(function(value) {',
          '    assert.deepEqual(value, ["foo", "bar"])',
          "    done();",
          "  }, function(err) { done(err); });",
          "};",
        ].join("\n")
      )
    )()
  );

  it("rest generator arrow functions", function () {
    eval(
      compile(
        [
          "var concat = function*(...arrs) {",
          "  var x = arrs[0];",
          "  var y = arrs[1];",
          "  yield [x, y];",
          "};",
          "",
          'for (var item of concat("foo", "bar")) {',
          '  assert.deepEqual(item, ["foo", "bar"])',
          "}",
        ].join("\n")
      )
    );
  });

  it("rest binding deoptimization", function () {
    eval(
      compile(
        [
          "const foo = (...args) => args = [2];",
          "assert.deepEqual(foo(1), [2]);",
        ].join("\n")
      )
    );
  });

  it("rest deepest common ancestor earliest child", function () {
    var actual = compile(
      [
        "function foo(...args) {",
        "  if (true) {",
        "    return args;",
        "  }",
        "}",
      ].join("\n")
    );
    var expected = [
      "function foo() {",
      "  if (true) {",
      "    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {",
      "      args[_key] = arguments[_key];",
      "    }",
      "    return args;",
      "  }",
      "}\n",
    ].join("\n");
    assert.equal(actual, expected);
  });

  it("rest spread optimization", function () {
    var actual = compile(
      ["function foo(...bar) {", "  foo(...bar);", "}"].join("\n")
    );
    var expected = [
      "function foo() {",
      "  foo.apply(undefined, arguments);",
      "}",
      "",
    ].join("\n");
    assert.equal(actual, expected);
  });

  it("rest spread deoptimization 1", function () {
    var actual = compile(
      ["function foo(a, ...b) {", "  foo(...b);", "}"].join("\n")
    );
    var expected = [
      "function foo(a) {",
      "  for (var _len = arguments.length, b = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {",
      "    b[_key - 1] = arguments[_key];",
      "  }",
      "  foo.apply(undefined, b);",
      "}",
      "",
    ].join("\n");
    assert.equal(actual, expected);
  });

  it("rest spread deoptimization 2", function () {
    var actual = compile(
      ["function foo(...b) {", "  foo(1, ...b);", "}"].join("\n")
    );
    var expected = [
      "function foo() {",
      "  for (var _len = arguments.length, b = new Array(_len), _key = 0; _key < _len; _key++) {",
      "    b[_key] = arguments[_key];",
      "  }",
      "  foo.apply(undefined, [1].concat(b));",
      "}",
      "",
    ].join("\n");
    assert.equal(actual, expected);
  });

  it("rest patterns", function () {
    eval(
      compile(
        [
          "function foo(...{ length }) {",
          "  return length;",
          "}",
          "",
          "assert.equal(foo(1, 2, 3), 3);",
        ].join("\n")
      )
    );
  });

  it("rest nested", function () {
    eval(
      compile(
        [
          "function bar(val) {",
          "  return val;",
          "}",
          "",
          "function test(thing, ...args) {",
          "  const foo = (...args) => bar(...args);",
          "  {",
          "    let args = thing;",
          "    return foo(thing);",
          "  }",
          "}",
          "",
          "assert.deepEqual(test([1, 2, 3], 4, 5, 6), [1, 2, 3]);",
        ].join("\n")
      )
    );
  });

  it("rest member expression optimization", function () {
    var actual = compile(
      [
        "var t = function (...items) {",
        "  var x = items[0];",
        "  var y = items[1];",
        "}",
        "",
        "function t(...items) {",
        "  var x = items[0];",
        "  var y = items[1];",
        "}",
        "",
        "function t(...items) {",
        "  var a = [];",
        "  for (var i = 0; i < items.length; i++) {",
        "    a.push(i);",
        "  }",
        "  return a;",
        "}",
      ].join("\n")
    );
    var expected = [
      "var t = function () {",
      "  var x = arguments.length <= 0 ? undefined : arguments[0];",
      "  var y = arguments.length <= 1 ? undefined : arguments[1];",
      "};",
      "function t() {",
      "  var x = arguments.length <= 0 ? undefined : arguments[0];",
      "  var y = arguments.length <= 1 ? undefined : arguments[1];",
      "}",
      "function t() {",
      "  var a = [];",
      "  for (var i = 0; i < arguments.length; i++) {",
      "    a.push(i);",
      "  }",
      "  return a;",
      "}",
      "",
    ].join("\n");
    assert.equal(actual, expected);
  });

  it("default iife 4253", function () {
    eval(
      compile(
        [
          "function Ref(id = ++Ref.nextId, n = id) {",
          "  this.id = n;",
          "}",
          "Ref.nextId = 0;",
          "",
          "assert.equal(new Ref().id, 1);",
          "assert.equal(new Ref().id, 2);",
        ].join("\n")
      )
    );
  });

  it("default iife self", function () {
    eval(
      compile(
        [
          "function Ref(ref = Ref) {",
          "  this.ref = ref;",
          "}",
          "",
          "assert.equal(new Ref().ref, Ref);",
        ].join("\n")
      )
    );
  });

  it("iife this", function () {
    eval(
      compile(
        [
          "var a = 1;",
          "function Test() {}",
          "Test.prototype.invite = function(p = a) {",
          "  let a = 2;",
          "  this.a = a;",
          "  return this;",
          "}",
          "",
          "var test = new Test();",
          "assert.deepEqual(test.invite(), test);",
          "assert.equal(test.a, 2);",
        ].join("\n")
      )
    );
  });

  it("regression 4333", function () {
    eval(
      compile(
        [
          'const args = "bar";',
          "function foo(...args) {",
          "  return args;",
          "}",
          "var bar = foo(args);",
          'var baz = foo("baz");',
          "",
          'assert.deepEqual(bar, ["bar"]);',
          'assert.deepEqual(baz, ["baz"]);',
          'assert.equal(args, "bar");',
        ].join("\n")
      )
    );
  });

  it("regression 4348", function () {
    eval(
      compile(
        [
          "function first(...values) {",
          "  var index = 0;",
          "  return values[index++];",
          "}",
          "assert.equal(first(1, 2, 3), 1);",
        ].join("\n")
      )
    );
  });

  it("regression 5787", function () {
    eval(
      compile(
        [
          "function f1(a, ...rest) {",
          "  let b = rest[rest.length - 3];",
          "  let c = rest[rest.length - 2];",
          "  let d = rest[rest.length - 1];",
          "  return [a, b, c, d];",
          "}",
          "assert.deepEqual(f1(1, 2), [1, undefined, undefined, 2]);",
          "",
          "function f2(a, ...rest) {",
          "  return rest[-1];",
          "}",
          "assert.equal(f2(1, 2), undefined);",
        ].join("\n")
      )
    );
  });

  it("rest nested arrow functions", function () {
    eval(
      compile(
        [
          "var somefun = function () {",
          "  let get2ndArg = (a, b, ...args1) => {",
          "    var _b = args1[0];",
          "    let somef = (x, y, z, ...args2) => {",
          "      var _a = args2[0];",
          "    };",
          "    let somefg = (c, d, e, f, ...args3) => {",
          "      var _a = args3[0];",
          "    };",
          "    var _d = args1[1];",
          "  };",
          "  let get3rdArg = (...args) => args[2];",
          "}",
        ].join("\n")
      )
    );
  });

  it("rest arrow functions deoptimized referenced identifier", function () {
    eval(
      compile(
        [
          "function demo1(...args) {",
          "  return (i) => {",
          "    return args[i+0];",
          "  };",
          "}",
          "var fn = demo1(1, 2, 3);",
          "assert.equal(fn(0), 1);",
          "assert.equal(fn(1), 2);",
        ].join("\n")
      )
    );
  });

  it("rest deepest common ancestor earliest child in nested loop", function () {
    compile(
      [
        "var spies = [sinon.spy(), sinon.spy()];",
        "var foo = true;",
        "",
        "function runQueue(queue, ...args) {",
        "  if (foo) {",
        "    for (let i = 0; i < queue.length; i++) {",
        "      queue[i](...args)",
        "    }",
        "  }",
        "}",
        "",
        "runQueue(spies, 1, 2, 3);",
        "assert.deepEqual(spies[0].getCall(0).args, [1, 2, 3]);",
        "assert.deepEqual(spies[1].getCall(0).args, [1, 2, 3]);",
      ].join("\n")
    );
  });

  it("rest length", function () {
    eval(
      compile(
        [
          "var length = function (a, b, ...items) {",
          "  return items.length;",
          "};",
          "",
          "assert.equal(length(), 0);",
          "assert.equal(length(1), 0);",
          "assert.equal(length(1, 2), 0);",
          "assert.equal(length(1, 2, 3), 1);",
        ].join("\n")
      )
    );
  });

  it("rest deoptimisation for-of loop", function () {
    eval(
      compile(
        [
          "var spy = sinon.spy();",
          "",
          "function forOf(...rest) {",
          "  for (rest[0] of this) {",
          "    spy(rest[0]);",
          "  }",
          "}",
          "",
          'forOf.call(["a"], ["b"]);',
          'assert.deepEqual(spy.getCall(0).args, ["a"]);',
        ].join("\n")
      )
    );
  });

  it("rest deoptimisation for-in loop", function () {
    eval(
      compile(
        [
          "var spy = sinon.spy();",
          "",
          "function forIn(...rest) {",
          "  for (rest[0] in this) {",
          "    spy(rest[0]);",
          "  }",
          "}",
          "",
          'forIn.call({a: 1}, ["b"]);',
          'assert.deepEqual(spy.getCall(0).args, ["a"]);',
        ].join("\n")
      )
    );
  });

  it("rest member expression deoptimisation", function () {
    eval(
      compile(
        [
          "var b = function(...bar) {",
          "  return bar.len;",
          "};",
          "assert.equal(b(1), undefined)",
        ].join("\n")
      )
    );
  });

  it("rest array pop deoptimisation", function () {
    eval(
      compile(
        [
          "var b = function (x, y, ...args) {",
          '  assert.equal(args[0], "c");',
          "  args.pop();",
          '  assert.equal(args[1], "d");',
          "  assert.equal(args.length, 2)",
          "};",
          'b(1, 2, "c", "d", "e");',
        ].join("\n")
      )
    );
  });

  it("rest multiple", function () {
    eval(
      compile(
        [
          "function u(f, g, ...items) {",
          "    var x = f;",
          "    var y = g;",
          "    x[3] = items[0];",
          "    return [x, y]",
          "}",
          'var res = u(["a", "b", "c"], "z", "d", "e");',
          'assert.deepEqual(res, [["a", "b", "c", "d"], "z"])',
        ].join("\n")
      )
    );
  });

  it("default array destructuring", function () {
    eval(
      compile(
        [
          "function t([,,a] = [1,2,3]) { return a }",
          "",
          "assert.equal(t(), 3);",
          "assert.equal(t([4,5,6]), 6);",
        ].join("\n")
      )
    );
  });

  it("default setter", function () {
    eval(
      compile(
        [
          "const defaultValue = 1;",
          "const obj = {",
          "  set field(num = defaultValue) {",
          "    this.num = num;",
          "  }",
          "};",
          "obj.field = undefined;",
          "",
          "assert.equal(obj.num, defaultValue);",
        ].join("\n")
      )
    );
  });

  it("default setter destructuring", function () {
    eval(
      compile(
        [
          "const defaultValue = {a: 1};",
          "const obj = {",
          "  set field({a: num} = defaultValue) {",
          "    this.num = num;",
          "  }",
          "};",
          "obj.field = undefined;",
          "",
          "assert.equal(obj.num, 1);",
        ].join("\n")
      )
    );
  });

  it("default setter rhs unsafe iife", function () {
    eval(
      compile(
        [
          'let x = "outside";',
          "const obj = {",
          "  set field({length: a} = x) {",
          // '    let x = "inside";',
          "    this.num = a;",
          "  }",
          "};",
          "",
          "obj.field = undefined;",
          "",
          "assert.equal(obj.num, 7);",
        ].join("\n")
      )
    );
  });

  it("default setter iife 1128", function () {
    eval(
      compile(
        [
          "const bar = true;",
          "",
          "const obj = {",
          "  set field(a = bar) {",
          "    const bar = false;",
          "    this.prop = a;",
          "  }",
          "}",
          "",
          "obj.field = undefined;",
          "",
          "assert.equal(obj.prop, true);",
        ].join("\n")
      )
    );
  });

  it("default setter array destructuring", function () {
    eval(
      compile(
        [
          'const bar = ["a"];',
          "",
          "const obj = {",
          "  set field([a] = bar) {",
          "    this.prop = a;",
          "  }",
          "}",
          "",
          "obj.field = undefined;",
          "",
          'assert.equal(obj.prop, "a");',
        ].join("\n")
      )
    );
  });

  it("default rhs scopable", function () {
    eval(
      compile(
        [
          'let x = "outside";',
          'function outer(a = () => { { let x = "inside"; return x; }}) {',
          "  return a();",
          "}",
          'assert.equal(outer(), "inside");',
        ].join("\n")
      )
    );
  });
});
