/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var assert = require("assert");
// var espree = require("espree");
// var escodegen = require("escodegen");
// var t = require('../babel/src/types');
// var types = require("ast-types");
// var n = types.namedTypes;
var { types: t, transform, compile, parse } = require("pregenerator");
var UglifyJS = require("uglify-js");

// function parse(code) {
//   return _parse(code).program;
// }

// function parse(code) {
//   return espree.parse(code, {
//     ecmaVersion: 2018,
//     range: true,
//     tokens: true,
//     loc: true
//   });
// }

// describe("_blockHoist nodes", function() {
//   it("should be hoisted to the outer body", function() {
//     var foo;
//     var names = [];
//     var ast = parse([
//       "function *foo(doNotHoistMe, hoistMe) {",
//       "  var sent = yield doNotHoistMe();",
//       "  hoistMe();",
//       "  names.push(sent);",
//       "  return 123;",
//       "}"
//     ].join("\n"));
//
//     var hoistMeStmt = ast.program.body[0].body.body[1];
//     t.assertExpressionStatement(hoistMeStmt);
//     t.assertCallExpression(hoistMeStmt.expression);
//     t.assertIdentifier(hoistMeStmt.expression.callee);
//     assert.strictEqual(hoistMeStmt.expression.callee.name, "hoistMe");
//
//     hoistMeStmt._blockHoist = 1;
//     // console.log(generate(transform(ast)));
//     // eval(generate(transform(ast)), {comment: true});
//     eval(`
//       function foo(doNotHoistMe, hoistMe) {
//         var sent;
//         return regeneratorRuntime.wrap(function foo$(_context) {
//           while (1) switch (_context.prev = _context.next) {
//             case 0:
//               _context.next = 2;
//               return doNotHoistMe();
//             case 2:
//               sent = _context.sent;
//               hoistMe();
//               names.push(sent);
//               return _context.abrupt("return", 123);
//             case 6:
//             case "end":
//               return _context.stop();
//           }
//         }, _marked);
//       }
//       var _marked = /* #__PURE__ */ regeneratorRuntime.mark(foo);`);
//
//     assert.strictEqual(typeof foo, "function");
//     assert.ok(regeneratorRuntime.isGeneratorFunction(foo));
//     assert.strictEqual(names.length, 0);
//
//     var g = foo(function doNotHoistMe() {
//       names.push("doNotHoistMe");
//       return "yielded";
//     }, function hoistMe() {
//       names.push("hoistMe");
//     });
//
//     assert.deepEqual(names, ["hoistMe"]);
//     assert.deepEqual(g.next(), { value: "yielded", done: false });
//     assert.deepEqual(names, ["hoistMe", "doNotHoistMe"]);
//     assert.deepEqual(g.next("oyez"), { value: 123, done: true });
//     assert.deepEqual(names, ["hoistMe", "doNotHoistMe", "oyez"]);
//   });
// });

describe("uglifyjs dead code removal", function () {
  function uglifyAndParse(file1, file2) {
    var code = {
      "file1.js": file1,
      "file2.js": file2,
    };

    var options = {
      toplevel: true,
      // don't mangle function or variable names so we can find them
      mangle: false,
      output: {
        // make it easier to parse the output
        beautify: true,
      },
    };

    // uglify our code
    var result = UglifyJS.minify(code, options);

    // parse and return the output
    return parse(result.code);
  }

  it("works with function expressions", function () {
    var file1 = compile(
      ["var foo = function* () {};", "var bar = function* () {};"].join("\n")
    );
    var file2 = compile("console.log(foo());");

    var ast = uglifyAndParse(file1, file2);

    // the results should have a single variable declaration
    var variableDeclarations = ast.program.body.filter(function (b) {
      return b.type === "VariableDeclaration";
    });
    assert.strictEqual(variableDeclarations.length, 1);
    assert.strictEqual(variableDeclarations[0].declarations.length, 1);
    var declaration = variableDeclarations[0].declarations[0];

    // named foo
    assert.strictEqual(declaration.id.name, "foo");
  });

  it("works with function declarations", function () {
    var file1 = compile(
      ["function* foo() {};", "function* bar() {};"].join("\n")
    );

    var file2 = compile("console.log(foo());");

    var ast = uglifyAndParse(file1, file2);

    // the results should have our foo() function
    assert.ok(
      ast.program.body.some(function (b) {
        return b.type === "FunctionDeclaration" && b.id.name === "foo";
      })
    );

    // but not our bar() function
    assert.ok(
      !ast.program.body.some(function (b) {
        return b.type === "FunctionDeclaration" && b.id.name === "bar";
      })
    );

    // and a single mark declaration
    var variableDeclarations = ast.program.body.filter(function (b) {
      return b.type === "VariableDeclaration";
    });
    assert.strictEqual(variableDeclarations.length, 1);
    var declarations = variableDeclarations[0].declarations;
    assert.strictEqual(declarations.length, 1);
    var declaration = declarations[0];

    // with our function name as an argument'
    assert.strictEqual(declaration.init.arguments.length, 1);
    assert.strictEqual(declaration.init.arguments[0].name, "foo");
  });
});

context("functions", function () {
  function marksCorrectly(marked, varName) {
    // marked should be a VariableDeclarator
    t.assertVariableDeclarator(marked);

    // using our variable name
    assert.strictEqual(marked.id.name, varName);

    assertMarkCall(marked.init);
  }

  function assertMarkCall(node) {
    // assiging a call expression to regeneratorRuntime.mark()

    t.assertCallExpression(node);
    assert.strictEqual(node.callee.object.name, "regeneratorRuntime");
    assert.strictEqual(node.callee.property.name, "mark");

    // with said call expression marked as a pure function
    assert.deepEqual(node.comments, [
      {
        type: "CommentBlock",
        leading: true,
        value: "#__PURE__",
      },
    ]);
  }

  describe("function declarations", function () {
    it("should work with a single function", function () {
      var ast = parse("function* foo(){};");

      // get our declarations
      const [declaration, func] = transform(ast).program.body;
      t.assertVariableDeclaration(declaration);
      t.assertFunctionDeclaration(func);

      const declarations = declaration.declarations;

      // verify our declaration is marked correctly
      marksCorrectly(declarations[0], "_marked");

      // and has our function name as its first argument
      assert.strictEqual(declarations[0].init.arguments[0].name, "foo");
      assert.strictEqual(func.id.name, "foo");
    });

    it("should work with multiple functions", function () {
      var ast = parse(
        ["function* foo() {};", "function* bar() {};"].join("\n")
      );

      // get our declarations
      const [declaration, func1, empty, func2] = transform(ast).program.body;

      t.assertVariableDeclaration(declaration);
      t.assertFunctionDeclaration(func1);
      t.assertEmptyStatement(empty);
      t.assertFunctionDeclaration(func2);

      const declarations = declaration.declarations;

      // verify our declarations are marked correctly and have our function name
      // as their first argument
      marksCorrectly(declarations[0], "_marked");
      t.assertIdentifier(declarations[0].init.arguments[0]);
      assert.strictEqual(declarations[0].init.arguments[0].name, "foo");
      t.assertIdentifier(func1.id);
      assert.strictEqual(func1.id.name, "foo");

      marksCorrectly(declarations[1], "_marked0");
      t.assertIdentifier(declarations[1].init.arguments[0]);
      assert.strictEqual(declarations[1].init.arguments[0].name, "bar");
      t.assertIdentifier(func2.id);
      assert.strictEqual(func2.id.name, "bar");
    });
  });

  describe("function expressions", function () {
    it("should work with a named function", function () {
      var ast = parse("var a = function* foo(){};");

      // get our declarations
      const declaration = transform(ast).program.body[0];
      t.assertVariableDeclaration(declaration);
      const declarator = declaration.declarations[0];

      // verify our declaration is marked correctly
      marksCorrectly(declarator, "a");

      // and that our first argument is our original function expression
      t.assertFunctionExpression(declarator.init.arguments[0]);
      assert.strictEqual(declarator.init.arguments[0].id.name, "foo");
    });

    it("should work with an anonymous function", function () {
      var ast = parse("var a = function* (){};");

      // get our declarations
      const declaration = transform(ast).program.body[0];
      t.assertVariableDeclaration(declaration);
      const declarator = declaration.declarations[0];

      // verify our declaration is marked correctly
      marksCorrectly(declarator, "a");

      // and that our first argument is our original function expression
      t.assertFunctionExpression(declarator.init.arguments[0]);
      assert.strictEqual(declarator.init.arguments[0].id.name, "_callee");
    });
  });

  describe("variables hoisting", function () {
    it("shouldn't throw about duplicate bindings", function () {
      // https://github.com/babel/babel/issues/6923

      assert.doesNotThrow(function () {
        const code = `
          async function foo() {
            (async function f(number) {
              const tmp = number
            })
          }
        `;

        compile(code);
      });
    });
  });
});
