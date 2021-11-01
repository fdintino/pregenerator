import "./es-proposals";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";
import { namedTypes as N } from "../gen/namedTypes";

const { def, or } = Type;

def("Noop").bases("BaseNode").aliases("Statement").build();

def("DoExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("body")
  .field("body", [def("Statement")]);

def("BindExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("object", "callee")
  .field("object", or(def("Expression"), null))
  .field("callee", def("Expression"));

def("ParenthesizedExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("expression")
  .field("expression", def("Expression"));

def("ExportNamespaceSpecifier")
  .bases("BaseNode")
  .aliases("Specifier")
  .build("exported")
  .field("exported", def("Identifier"));

def("ExportDefaultSpecifier")
  .bases("BaseNode")
  .aliases("Specifier")
  .build("exported")
  .field("exported", def("Identifier"));

def("CommentBlock")
  .bases("BaseComment")
  .field("type", String)
  .aliases("Comment")
  .build("value", /*optional:*/ "leading", "trailing");

def("CommentLine")
  .bases("BaseComment")
  .field("type", String)
  .aliases("Comment")
  .build("value", /*optional:*/ "leading", "trailing");

def("Directive")
  .bases("BaseNode")
  .aliases("Node")
  .build("value")
  .field("value", def("DirectiveLiteral"));

def("DirectiveLiteral")
  .bases("BaseNode")
  .aliases("Node", "Expression")
  .build("value")
  .field("value", String, defaults["use strict"]);

def("InterpreterDirective")
  .bases("BaseNode")
  .aliases("Node")
  .build("value")
  .field("value", String);

def("BlockStatement")
  .bases("BaseNode")
  .aliases("Statement")
  .build("body")
  .field("body", [def("Statement")])
  .field("directives", [def("Directive")], defaults.emptyArray);

def("Program")
  .bases("BaseNode")
  .aliases("Node")
  .build("body")
  .field("body", [def("Statement")])
  .field("directives", [def("Directive")], defaults.emptyArray)
  .field(
    "interpreter",
    or(def("InterpreterDirective"), null),
    defaults["null"]
  );

// Split Literal
def("StringLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("value")
  .field("value", String)
  .field("raw", String, function getDefault(this: N.StringLiteral) {
    return JSON.stringify(this.value);
  })
  .field(
    "extra",
    {
      rawValue: String,
      raw: String,
    },
    function getDefault(this: N.StringLiteral) {
      return {
        rawValue: this.value,
        raw: this.raw,
      };
    }
  );

def("NumericLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("value")
  .field("value", Number)
  .field("raw", String, function getDefault(this: N.NumericLiteral) {
    return JSON.stringify(this.value);
  })
  .field(
    "extra",
    {
      rawValue: Number,
      raw: String,
    },
    function getDefault(this: N.NumericLiteral) {
      return {
        rawValue: this.value,
        raw: this.raw,
      };
    }
  );

def("BigIntLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("value")
  // Only String really seems appropriate here, since BigInt values
  // often exceed the limits of JS numbers.
  .field("value", or(String, Number))
  .field("raw", String, function getDefault(this: N.BigIntLiteral) {
    return String(this.value);
  })
  .field(
    "extra",
    {
      rawValue: String,
      raw: String,
    },
    function getDefault(this: N.BigIntLiteral) {
      return {
        rawValue: String(this.value),
        raw: this.raw,
      };
    }
  );

def("NullLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("value")
  .field("value", null, defaults["null"])
  .field("raw", String, () => "null")
  .field(
    "extra",
    {
      rawValue: null,
      raw: String,
    },
    () => ({ rawValue: null, raw: "null" })
  );

def("BooleanLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("value")
  .field("value", Boolean)
  .field("raw", String, function getDefault(this: N.BooleanLiteral) {
    return this.value ? "true" : "false";
  })
  .field(
    "extra",
    {
      rawValue: Boolean,
      raw: String,
    },
    function getDefault(this: N.BooleanLiteral) {
      return {
        rawValue: this.value,
        raw: this.raw,
      };
    }
  );

def("RegExpLiteral")
  .bases("BaseNode")
  .aliases("Literal")
  .build("pattern", "flags")
  .field("pattern", String)
  .field("flags", String)
  .field("value", RegExp, function (this: N.RegExpLiteral) {
    return new RegExp(this.pattern, this.flags);
  })
  .field("raw", String, function getDefault(this: N.RegExpLiteral) {
    return this.value + "";
  })
  .field(
    "extra",
    {
      rawValue: RegExp,
      raw: String,
    },
    function getDefault(this: N.RegExpLiteral) {
      return {
        rawValue: this.value,
        raw: this.raw,
      };
    }
  );

const ObjectExpressionProperty = or(
  def("Property"),
  def("ObjectMethod"),
  def("ObjectProperty"),
  def("SpreadElement")
);

// Split Property -> ObjectProperty and ObjectMethod
def("ObjectExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("properties")
  .field("properties", [ObjectExpressionProperty]);

// ObjectMethod hoist .value properties to own properties
def("ObjectMethod")
  .bases("BaseFunction")
  .aliases("Node", "Function", "FunctionParent")
  .build("kind", "key", "params", "body", "computed")
  .field("kind", or("method", "get", "set"))
  .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
  .field("params", [def("PatternLike")])
  .field("body", def("BlockStatement"))
  .field("computed", Boolean, defaults["false"])
  .field("generator", Boolean, defaults["false"])
  .field("async", Boolean, defaults["false"])
  .field(
    "accessibility", // TypeScript
    or(def("Literal"), null),
    defaults["null"]
  )
  .field("decorators", or([def("Decorator")], null), defaults["null"]);

def("ObjectProperty")
  .bases("BaseNode")
  .aliases("Node")
  .build("key", "value")
  .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
  .field("value", or(def("Expression"), def("PatternLike")))
  .field(
    "accessibility", // TypeScript
    or(def("Literal"), null),
    defaults["null"]
  )
  .field("computed", Boolean, defaults["false"]);

const ClassBodyElement = or(
  def("MethodDefinition"),
  def("VariableDeclarator"),
  def("ClassPropertyDefinition"),
  def("ClassProperty"),
  def("ClassPrivateProperty"),
  def("ClassMethod"),
  def("ClassPrivateMethod")
);

// MethodDefinition -> ClassMethod
def("ClassBody")
  .bases("BaseNode")
  .aliases("Node")
  .build("body")
  .field("body", [ClassBodyElement]);

def("ClassMethod")
  .bases("BaseFunction")
  .aliases("Function", "FunctionParent")
  .build("kind", "key", "params", "body", "computed", "static")
  .field("key", or(def("Literal"), def("Identifier"), def("Expression")));

def("ClassPrivateMethod")
  .bases("BaseFunction")
  .aliases("Function", "FunctionParent")
  .build("key", "params", "body", "kind", "computed", "static")
  .field("key", def("PrivateName"));

["ClassMethod", "ClassPrivateMethod"].forEach((typeName) => {
  def(typeName)
    .field("kind", or("get", "set", "method", "constructor"), () => "method")
    .field("body", def("BlockStatement"))
    .field("computed", Boolean, defaults["false"])
    .field("static", or(Boolean, null), defaults["null"])
    .field("abstract", or(Boolean, null), defaults["null"])
    .field(
      "access",
      or("public", "private", "protected", null),
      defaults["null"]
    )
    .field(
      "accessibility",
      or("public", "private", "protected", null),
      defaults["null"]
    )
    .field("decorators", or([def("Decorator")], null), defaults["null"])
    .field("optional", or(Boolean, null), defaults["null"]);
});

const ObjectPatternProperty = or(
  def("Property"),
  def("ObjectProperty") // Babel 6
);

def("ObjectPattern")
  .bases("BaseNode")
  .aliases("Pattern", "PatternLike", "LVal")
  .build("properties")
  .field("properties", [ObjectPatternProperty])
  .field("decorators", or([def("Decorator")], null), defaults["null"]);

def("ForAwaitStatement")
  .bases("BaseNode")
  .aliases("Statement")
  .build("left", "right", "body")
  .field("left", or(def("VariableDeclaration"), def("Expression")))
  .field("right", def("Expression"))
  .field("body", def("Statement"));

// The callee node of a dynamic import(...) expression.
def("Import").bases("BaseNode").aliases("Expression").build();
