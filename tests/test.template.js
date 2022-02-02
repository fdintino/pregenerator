var generate, expect, template, t;

if (typeof window === "object") {
  generate = window.pregenerator.generate;
  template = window.pregeneratorTemplate;
  expect = window.expect = window.chai.expect;
  t = window.pregenerator.builders;
} else {
  generate = require("pregenerator").generate;
  template = require("@pregenerator/template").default;
  t = require("pregenerator").builders;
  var chai = require("chai");
  expect = global.expect = chai.expect;
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);
  global.sinon = require("sinon");
}

function generator(ast) {
  return { code: generate(ast) };
}

describe("@pregenerator/template", function () {
  it("with statements are allowed with sourceType: script", function () {
    expect(function () {
      template("with({}){}", { sourceType: "script" })({});
    }).not.to.throw();
  });

  describe("string-based", () => {
    it("should handle replacing values from an object", () => {
      const value = t.stringLiteral("some string value");
      const result = template(`
        if (SOME_VAR === "") {}
      `)({
        SOME_VAR: value,
      });

      expect(result.type).to.equal("IfStatement");
      expect(result.test.type).to.equal("BinaryExpression");
      expect(result.test.left).to.equal(value);
    });

    it("should handle replacing values given an array", () => {
      const value = t.stringLiteral("some string value");
      const result = template(`
        if ($0 === "") {}
      `)([value]);

      expect(result.type).to.equal("IfStatement");
      expect(result.test.type).to.equal("BinaryExpression");
      expect(result.test.left).to.equal(value);
    });

    it("should handle replacing values with null to remove them", () => {
      const result = template(`
        callee(ARG);
      `)({ ARG: null });

      expect(result.type).to.equal("ExpressionStatement");
      expect(result.expression.type).to.equal("CallExpression");
      expect(result.expression.arguments.length).to.equal(0);
    });

    it("should handle replacing values that are string content", () => {
      const result = template(`
        ("ARG");
      `)({ ARG: "some new content" });

      expect(result.type).to.equal("ExpressionStatement");
      expect(result.expression.type).to.equal("StringLiteral");
      expect(result.expression.value).to.equal("some new content");
    });

    it("should automatically clone nodes if they are injected twice", () => {
      const id = t.identifier("someIdent");

      const result = template(`
        ID;
        ID;
      `)({ ID: id });

      expect(result[0].type).to.equal("ExpressionStatement");
      expect(result[0].expression).to.equal(id);
      expect(result[1].type).to.equal("ExpressionStatement");
      expect(result[1].expression).not.to.equal(id);
      expect(result[1].expression).to.deep.equal(id);
    });

    // it("should allow passing in a whitelist of replacement names", () => {
    //   const id = t.identifier("someIdent");
    //   const result = template(
    //     `
    //       some_id;
    //     `,
    //     { placeholderWhitelist: new Set(["some_id"]) }
    //   )({ some_id: id });

    //   expect(result.type).to.equal("ExpressionStatement");
    //   expect(result.expression).to.equal(id);
    // });

    it("should allow passing in a RegExp to match replacement patterns", () => {
      const id = t.identifier("someIdent");
      const result = template(
        `
          ID;
          ANOTHER_ID;
        `,
        { placeholderPattern: /^ID$/ }
      )({ ID: id });

      expect(result[0].type).to.equal("ExpressionStatement");
      expect(result[0].expression).to.equal(id);
      expect(result[1].type).to.equal("ExpressionStatement");
      expect(result[1].expression.type).to.equal("Identifier");
      expect(result[1].expression.name).to.equal("ANOTHER_ID");
    });

    it("should throw if unknown replacements are provided", () => {
      expect(() => {
        template(`
          ID;
        `)({ ID: t.identifier("someIdent"), ANOTHER_ID: null });
      }).to.throw('Unknown substitution "ANOTHER_ID" given');
    });

    it("should throw if placeholders are not given explicit values", () => {
      expect(() => {
        template(`
          ID;
          ANOTHER_ID;
        `)({ ID: t.identifier("someIdent") });
      }).to.throw(
        `Error: No substitution given for "ANOTHER_ID". If this is not meant to be a
            placeholder you may want to consider passing one of the following options to @pregenerator/template:
            - { placeholderPattern: false, placeholderWhitelist: new Set(['ANOTHER_ID'])}
            - { placeholderPattern: /^ANOTHER_ID$/ }`
      );
    });

    it("should return the AST directly when using .ast", () => {
      const result = template.ast(`
        if ("some string value" === "") {}
      `);

      expect(result.type).to.equal("IfStatement");
      expect(result.test.type).to.equal("BinaryExpression");
      expect(result.test.left.type).to.equal("StringLiteral");
      expect(result.test.left.value).to.equal("some string value");
    });
  });

  describe("literal-based", () => {
    it("should handle replacing values from an object", () => {
      const value = t.stringLiteral("some string value");
      const result = template`
        if (${value} === "") {}
      `();

      expect(result.type).to.equal("IfStatement");
      expect(result.test.type).to.equal("BinaryExpression");
      expect(result.test.left).to.equal(value);
    });

    it("should handle replacing values with null to remove them", () => {
      const result = template`
        callee(${null});
      `();

      expect(result.type).to.equal("ExpressionStatement");
      expect(result.expression.type).to.equal("CallExpression");
      expect(result.expression.arguments.length).to.equal(0);
    });

    it("should handle replacing values that are string content", () => {
      const result = template`
        ("${"some new content"}");
      `();

      expect(result.type).to.equal("ExpressionStatement");
      expect(result.expression.type).to.equal("StringLiteral");
      expect(result.expression.value).to.equal("some new content");
    });

    it("should allow setting options by passing an object", () => {
      const result = template({ sourceType: "script" })`
        with({}){}
      `();

      expect(result.type).to.equal("WithStatement");
    });

    it("should return the AST directly when using .ast", () => {
      const value = t.stringLiteral("some string value");
      const result = template.ast`
        if (${value} === "") {}
      `;

      expect(result.type).to.equal("IfStatement");
      expect(result.test.type).to.equal("BinaryExpression");
      expect(result.test.left).to.equal(value);
    });
  });

  describe(".syntacticPlaceholders", () => {
    it("works in function body", () => {
      const output = template(`function f() %%A%%`)({
        A: t.blockStatement([]),
      });
      expect(generator(output).code).to.equal("function f() {}");
    });

    it("replaces lowercase names", () => {
      const output = template(`%%foo%%`)({
        foo: t.numericLiteral(1),
      });
      expect(generator(output).code).to.equal("1");
    });

    it("allows placeholders", () => {
      const output = template(`%%FOO%%`)({
        FOO: t.numericLiteral(1),
      });
      expect(generator(output).code).to.equal("1");
    });

    it("replaces identifiers", () => {
      const output = template(`FOO`)({
        FOO: t.numericLiteral(1),
      });
      expect(generator(output).code).to.equal("1;");
    });

    it("doesn't mix placeholder styles", () => {
      const output = template(`FOO + %%FOO%%`)({
        FOO: t.numericLiteral(1),
      });
      expect(generator(output).code).to.equal("FOO + 1;");
    });

    it("works in var declaration", () => {
      const output = template("var %%LHS%% = %%RHS%%")({
        LHS: t.identifier("x"),
        RHS: t.numericLiteral(7),
      });
      expect(generator(output).code).to.equal("var x = 7;");
    });

    it("works in const declaration", () => {
      const output = template("const %%LHS%% = %%RHS%%")({
        LHS: t.identifier("x"),
        RHS: t.numericLiteral(7),
      });
      expect(generator(output).code).to.equal("const x = 7;");
    });

    it("works in let declaration", () => {
      const output = template("let %%LHS%% = %%RHS%%")({
        LHS: t.identifier("x"),
        RHS: t.numericLiteral(7),
      });
      expect(generator(output).code).to.equal("let x = 7;");
    });
  });
});
