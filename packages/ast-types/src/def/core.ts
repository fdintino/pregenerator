import {
  BinaryOperators,
  AssignmentOperators,
  LogicalOperators,
} from "./core-operators";
import "./es-proposals";
import { Type } from "../lib/types";
import { defaults, geq } from "../lib/shared";
import { namedTypes as N } from "../gen/namedTypes";

const { def, or } = Type;

def("Node");

def("BaseNode")
  .aliases("Node")
  .field("type", String)
  .field("comments", or([def("Comment")], null), defaults["null"], true)
  .field(
    "loc",
    or(def("SourceLocation"), null),
    defaults["null"],
    true
  );

def("SourceLocation")
  .field("start", def("Position"))
  .field("end", def("Position"))
  .field("source", or(String, null), defaults["null"]);

def("Position").field("line", geq(1)).field("column", geq(0));

def("File")
  .bases("BaseNode").aliases("Node")
  .build("program", "name")
  .field("program", def("Program"))
  .field("name", or(String, null), defaults["null"]);

def("Program")
  .bases("BaseNode").aliases("Node")
  .build("body")
  .field("body", [def("Statement")]);

def("Function").aliases("Node");

def("BaseFunction")
  .bases("BaseNode").aliases("Function")
  .field("id", or(def("Identifier"), null), defaults["null"])
  .field("params", [def("PatternLike")])
  .field("body", def("BlockStatement"))
  .field("generator", Boolean, defaults["false"])
  .field("async", Boolean, defaults["false"]);

def("Statement").aliases("Node");

def("LVal").aliases("Node");

// The empty .build() here means that an EmptyStatement can be constructed
// (i.e. it's not abstract) but that it needs no arguments.
def("EmptyStatement").bases("BaseNode").aliases("Statement").build();

def("BlockStatement")
  .bases("BaseNode").aliases("Statement")
  .build("body")
  .field("body", [def("Statement")]);

// TODO Figure out how to silently coerce Expressions to
// ExpressionStatements where a Statement was expected.
def("ExpressionStatement")
  .bases("BaseNode").aliases("Statement")
  .build("expression")
  .field("expression", def("Expression"));

def("IfStatement")
  .bases("BaseNode").aliases("Statement")
  .build("test", "consequent", "alternate")
  .field("test", def("Expression"))
  .field("consequent", def("Statement"))
  .field("alternate", or(def("Statement"), null), defaults["null"]);

def("LabeledStatement")
  .bases("BaseNode").aliases("Statement")
  .build("label", "body")
  .field("label", def("Identifier"))
  .field("body", def("Statement"));

def("BreakStatement")
  .bases("BaseNode").aliases("Statement")
  .build("label")
  .field("label", or(def("Identifier"), null), defaults["null"]);

def("ContinueStatement")
  .bases("BaseNode").aliases("Statement")
  .build("label")
  .field("label", or(def("Identifier"), null), defaults["null"]);

def("WithStatement")
  .bases("BaseNode").aliases("Statement")
  .build("object", "body")
  .field("object", def("Expression"))
  .field("body", def("Statement"));

def("SwitchStatement")
  .bases("BaseNode").aliases("Statement")
  .build("discriminant", "cases", "lexical")
  .field("discriminant", def("Expression"))
  .field("cases", [def("SwitchCase")])
  .field("lexical", Boolean, defaults["false"]);

def("ReturnStatement")
  .bases("BaseNode").aliases("Statement")
  .build("argument")
  .field("argument", or(def("Expression"), null));

def("ThrowStatement")
  .bases("BaseNode").aliases("Statement")
  .build("argument")
  .field("argument", def("Expression"));

def("TryStatement")
  .bases("BaseNode").aliases("Statement")
  .build("block", "handler", "finalizer")
  .field("block", def("BlockStatement"))
  .field(
    "handler",
    or(def("CatchClause"), null),
    function (this: N.TryStatement) {
      return (this.handlers && this.handlers[0]) || null;
    }
  )
  .field(
    "handlers",
    [def("CatchClause")],
    function (this: N.TryStatement) {
      return this.handler ? [this.handler] : [];
    },
    true
  ) // Indicates this field is hidden from eachField iteration.
  .field("guardedHandlers", [def("CatchClause")], defaults.emptyArray)
  .field("finalizer", or(def("BlockStatement"), null), defaults["null"]);

def("CatchClause")
  .bases("BaseNode").aliases("Node")
  .build("param", "guard", "body")
  .field("param", def("Identifier"))
  .field("guard", or(def("Expression"), null), defaults["null"])
  .field("body", def("BlockStatement"));

def("WhileStatement")
  .bases("BaseNode").aliases("Statement")
  .build("test", "body")
  .field("test", def("Expression"))
  .field("body", def("Statement"));

def("DoWhileStatement")
  .bases("BaseNode").aliases("Statement")
  .build("body", "test")
  .field("body", def("Statement"))
  .field("test", def("Expression"));

def("ForStatement")
  .bases("BaseNode").aliases("Statement")
  .build("init", "test", "update", "body")
  .field("init", or(def("VariableDeclaration"), def("Expression"), null))
  .field("test", or(def("Expression"), null))
  .field("update", or(def("Expression"), null))
  .field("body", def("Statement"));

def("ForInStatement")
  .bases("BaseNode").aliases("Statement")
  .build("left", "right", "body")
  .field("left", or(def("VariableDeclaration"), def("LVal")))
  .field("right", def("Expression"))
  .field("body", def("Statement"));

def("DebuggerStatement").bases("BaseNode").aliases("Statement").build();

def("Declaration").aliases("Statement");

def("FunctionDeclaration")
  .bases("BaseFunction").aliases("Function", "Declaration")
  .build("id", "params", "body")
  .field("id", def("Identifier"));

def("FunctionExpression")
  .bases("BaseFunction").aliases("Function", "Expression")
  .build("id", "params", "body");

def("VariableDeclaration")
  .bases("BaseNode").aliases("Declaration")
  .build("kind", "declarations")
  .field("kind", or("var", "let", "const"))
  .field("declarations", [def("VariableDeclarator")]);

def("VariableDeclarator")
  .bases("BaseNode").aliases("Node")
  .build("id", "init")
  .field("id", def("LVal"))
  .field("init", or(def("Expression"), null), defaults["null"]);

def("Expression").aliases("Node");

def("ThisExpression").bases("BaseNode").aliases("Expression").build();

def("ArrayExpression")
  .bases("BaseNode").aliases("Expression")
  .build("elements")
  .field("elements", [or(def("Expression"), null)]);

def("ObjectExpression")
  .bases("BaseNode").aliases("Expression")
  .build("properties")
  .field("properties", [def("Property")]);

// TODO Not in the Mozilla Parser API, but used by Esprima.
def("Property")
  .bases("BaseNode").aliases("Node") // Want to be able to visit Property Nodes.
  .build("kind", "key", "value")
  .field("kind", or("init", "get", "set"))
  .field("key", or(def("Literal"), def("Identifier")))
  .field("value", def("Expression"));

def("SequenceExpression")
  .bases("BaseNode").aliases("Expression")
  .build("expressions")
  .field("expressions", [def("Expression")]);

const UnaryOperator = or("-", "+", "!", "~", "typeof", "void", "delete");

def("UnaryExpression")
  .bases("BaseNode").aliases("Expression")
  .build("operator", "argument", "prefix")
  .field("operator", UnaryOperator)
  .field("argument", def("Expression"))
  // Esprima doesn't bother with this field, presumably because it's
  // always true for unary operators.
  .field("prefix", Boolean, defaults["true"]);

const BinaryOperator = or(...BinaryOperators);

def("BinaryExpression")
  .bases("BaseNode").aliases("Expression")
  .build("operator", "left", "right")
  .field("operator", BinaryOperator)
  .field("left", def("Expression"))
  .field("right", def("Expression"));

const AssignmentOperator = or(...AssignmentOperators);

def("AssignmentExpression")
  .bases("BaseNode").aliases("Expression")
  .build("operator", "left", "right")
  .field("operator", AssignmentOperator)
  .field("left", def("LVal"))
  .field("right", def("Expression"));

const UpdateOperator = or("++", "--");

def("UpdateExpression")
  .bases("BaseNode").aliases("Expression")
  .build("operator", "argument", "prefix")
  .field("operator", UpdateOperator)
  .field("argument", def("Expression"))
  .field("prefix", Boolean);

const LogicalOperator = or(...LogicalOperators);

def("LogicalExpression")
  .bases("BaseNode").aliases("Expression")
  .build("operator", "left", "right")
  .field("operator", LogicalOperator)
  .field("left", def("Expression"))
  .field("right", def("Expression"));

def("ConditionalExpression")
  .bases("BaseNode").aliases("Expression")
  .build("test", "consequent", "alternate")
  .field("test", def("Expression"))
  .field("consequent", def("Expression"))
  .field("alternate", def("Expression"));

def("NewExpression")
  .bases("BaseNode").aliases("Expression")
  .build("callee", "arguments")
  .field("callee", def("Expression"))
  // The Mozilla Parser API gives this type as [or(def("Expression"),
  // null)], but null values don't really make sense at the call site.
  // TODO Report this nonsense.
  .field("arguments", [def("Expression")]);

def("CallExpression")
  .bases("BaseNode").aliases("Expression")
  .build("callee", "arguments")
  .field("callee", def("Expression"))
  // See comment for NewExpression above.
  .field("arguments", [def("Expression")]);

def("MemberExpression")
  .bases("BaseNode").aliases("Expression", "LVal")
  .build("object", "property", "computed")
  .field("object", def("Expression"))
  .field("property", or(def("Identifier"), def("Expression")))
  .field("computed", Boolean, function (this: N.MemberExpression) {
    const type = this.property.type;
    if (
      type === "StringLiteral" ||
      type === "NumericLiteral" ||
      type === "BigIntLiteral" ||
      type === "NullLiteral" ||
      type === "BooleanLiteral" ||
      type === "RegExpLiteral" ||
      type === "MemberExpression" ||
      type === "BinaryExpression"
    ) {
      return true;
    }
    return false;
  });

def("Pattern").aliases("Node");
def("PatternLike").aliases("Node");

def("SwitchCase")
  .bases("BaseNode").aliases("Node")
  .build("test", "consequent")
  .field("test", or(def("Expression"), null))
  .field("consequent", [def("Statement")]);

def("Identifier")
  .bases("BaseNode").aliases("Expression", "PatternLike", "LVal")
  .build("name")
  .field("name", String)
  .field("optional", Boolean, defaults["false"]);

def("Literal").aliases("Expression");

// Abstract (non-buildable) comment supertype. Not a Node.
def("Comment");

def("BaseComment")
  .field(
    "loc",
    or(def("SourceLocation"), null),
    defaults["null"],
    true
  )
  .field("value", String)
  // A .leading comment comes before the node, whereas a .trailing
  // comment comes after it. These two fields should not both be true,
  // but they might both be false when the comment falls inside a node
  // and the node has no children for the comment to lead or trail,
  // e.g. { /*dangling*/ }.
  .field("leading", Boolean, defaults["true"])
  .field("trailing", Boolean, defaults["false"]);
