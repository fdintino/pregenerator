import { AssignmentOperators } from "./core-operators";
import "./core";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("BaseFunction")
  .field("generator", Boolean, defaults["false"])
  .field("expression", Boolean, defaults["false"])
  .field("defaults", [or(def("Expression"), null)], defaults.emptyArray)
  // Legacy
  .field("rest", or(def("Identifier"), null), defaults["null"]);

// The ESTree way of representing a ...rest parameter.
def("RestElement")
  .bases("BaseNode")
  .aliases("PatternLike", "LVal")
  .build("argument")
  .field("argument", def("LVal"));

def("FunctionDeclaration")
  .build("id", "params", "body", "generator", "expression")
  // May be `null` in the context of `export default function () {}`
  .field("id", or(def("Identifier"), null));

def("FunctionExpression").build(
  "id",
  "params",
  "body",
  "generator",
  "expression"
);

def("ArrowFunctionExpression")
  .bases("BaseFunction")
  .aliases("Function", "Expression", "FunctionParent")
  .build("params", "body", "expression")
  // The forced null value here is compatible with the overridden
  // definition of the "id" field in the Function interface.
  .field("id", null, defaults["null"])
  // Arrow function bodies are allowed to be expressions.
  .field("body", or(def("BlockStatement"), def("Expression")))
  // The current spec forbids arrow generators, so I have taken the
  // liberty of enforcing that. TODO Report this.
  .field("generator", false, defaults["false"]);

const AssignmentOperator = or(...AssignmentOperators);

def("ForOfStatement")
  .bases("BaseNode")
  .aliases("Statement", "For", "ForX", "Loop")
  .build("left", "right", "body")
  .field("left", or(def("VariableDeclaration"), def("LVal")))
  .field("right", def("Expression"))
  .field("body", def("Statement"));

def("YieldExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("argument", "delegate")
  .field("argument", or(def("Expression"), null))
  .field("delegate", Boolean, defaults["false"]);

def("GeneratorExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("body", "blocks", "filter")
  .field("body", def("Expression"))
  .field("blocks", [def("ComprehensionBlock")])
  .field("filter", or(def("Expression"), null));

def("ComprehensionExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("body", "blocks", "filter")
  .field("body", def("Expression"))
  .field("blocks", [def("ComprehensionBlock")])
  .field("filter", or(def("Expression"), null));

def("ComprehensionBlock")
  .bases("BaseNode")
  .aliases("Node")
  .build("left", "right", "each")
  .field("left", def("Pattern"))
  .field("right", def("Expression"))
  .field("each", Boolean);

def("Property")
  .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
  .field("value", or(def("Expression"), def("PatternLike")))
  .field("method", Boolean, defaults["false"])
  .field("shorthand", Boolean, defaults["false"])
  .field("computed", Boolean, defaults["false"]);

def("ObjectProperty").field("shorthand", Boolean, defaults["false"]);

def("CatchClause").field(
  "param",
  or(def("ArrayPattern"), def("ObjectPattern"), def("Identifier"), null)
);

def("ObjectPattern")
  .bases("BaseNode")
  .aliases("Pattern", "PatternLike", "LVal")
  .build("properties")
  .field("properties", [or(def("RestElement"), def("ObjectProperty"))]);

def("ArrayPattern")
  .bases("BaseNode")
  .aliases("Pattern", "PatternLike", "LVal")
  .build("elements")
  .field("elements", [or(def("PatternLike"), null)]);

def("SpreadElement")
  .bases("BaseNode")
  .aliases("Node")
  .build("argument")
  .field("argument", def("Expression"));

def("ArrayExpression").field("elements", [
  or(def("Expression"), def("SpreadElement"), null),
]);

def("NewExpression").field("arguments", [
  or(def("Expression"), def("SpreadElement")),
]);

def("CallExpression").field("arguments", [
  or(def("Expression"), def("SpreadElement")),
]);

// Note: this node type is *not* an AssignmentExpression with a Pattern on
// the left-hand side! The existing AssignmentExpression type already
// supports destructuring assignments. AssignmentPattern nodes may appear
// wherever a Pattern is allowed, and the right-hand side represents a
// default value to be destructured against the left-hand side, if no
// value is otherwise provided. For example: default parameter values.
def("AssignmentPattern")
  .bases("BaseNode")
  .aliases("Pattern", "PatternLike", "LVal")
  .build("left", "right")
  .field(
    "left",
    or(
      def("Identifier"),
      def("ObjectPattern"),
      def("ArrayPattern"),
      def("MemberExpression")
    )
  )
  .field("right", def("Expression"));

def("MethodDefinition")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("kind", "key", "value", "static")
  .field("kind", or("constructor", "method", "get", "set"))
  .field("key", def("Expression"))
  .field("value", def("Function"))
  .field("computed", Boolean, defaults["false"])
  .field("static", Boolean, defaults["false"]);

const ClassBodyElement = or(
  def("MethodDefinition"),
  def("VariableDeclarator"),
  def("ClassPropertyDefinition"),
  def("ClassProperty")
);

def("ClassProperty")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("key")
  .field("key", or(def("Literal"), def("Identifier"), def("Expression")))
  .field("computed", Boolean, defaults["false"]);

def("ClassPropertyDefinition") // static property
  .bases("BaseNode")
  .aliases("Declaration")
  .build("definition")
  // Yes, Virginia, circular definitions are permitted.
  .field("definition", ClassBodyElement);

def("ClassBody")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("body")
  .field("body", [ClassBodyElement]);

def("Class").aliases("Node", "Scopable");

def("ClassDeclaration")
  .bases("BaseNode")
  .aliases("Declaration", "Class")
  .build("id", "body", "superClass")
  .field("id", or(def("Identifier"), null))
  .field("body", def("ClassBody"))
  .field("superClass", or(def("Expression"), null), defaults["null"]);

def("ClassExpression")
  .bases("BaseNode")
  .aliases("Expression", "Class")
  .build("id", "body", "superClass")
  .field("id", or(def("Identifier"), null), defaults["null"])
  .field("body", def("ClassBody"))
  .field("superClass", or(def("Expression"), null), defaults["null"]);

def("Super").bases("BaseNode").aliases("Expression").build();

// Specifier and ModuleSpecifier are abstract non-standard types
// introduced for definitional convenience.
def("Specifier").aliases("Node");

// This supertype is shared/abused by both def/babel.js and
// def/esprima.js. In the future, it will be possible to load only one set
// of definitions appropriate for a given parser, but until then we must
// rely on default functions to reconcile the conflicting AST formats.
def("ModuleSpecifier").aliases("Specifier");

function addModuleSpecifierFields(typeName: string): void {
  def(typeName)
    // This local field is used by Babel/Acorn. It should not technically
    // be optional in the Babel/Acorn AST format, but it must be optional
    // in the Esprima AST format.
    .field("local", or(def("Identifier"), null), defaults["null"])
    // The id and name fields are used by Esprima. The id field should not
    // technically be optional in the Esprima AST format, but it must be
    // optional in the Babel/Acorn AST format.
    .field("id", or(def("Identifier"), null), defaults["null"])
    .field("name", or(def("Identifier"), null), defaults["null"]);
}

// import {<id [as name]>} from ...;
addModuleSpecifierFields("ImportSpecifier");
def("ImportSpecifier")
  .bases("BaseNode")
  .aliases("ModuleSpecifier")
  .build("imported", "local")
  .field("imported", def("Identifier"));

// import <id> from ...;
addModuleSpecifierFields("ImportDefaultSpecifier");
def("ImportDefaultSpecifier")
  .bases("BaseNode")
  .aliases("ModuleSpecifier")
  .build("local");

// import <* as id> from ...;
addModuleSpecifierFields("ImportNamespaceSpecifier");
def("ImportNamespaceSpecifier")
  .bases("BaseNode")
  .aliases("ModuleSpecifier")
  .build("local");

def("ImportDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("specifiers", "source", "importKind")
  .field(
    "specifiers",
    [
      or(
        def("ImportSpecifier"),
        def("ImportNamespaceSpecifier"),
        def("ImportDefaultSpecifier")
      ),
    ],
    defaults.emptyArray
  )
  .field("source", def("Literal"))
  .field("importKind", or("value", "type"), function () {
    return "value";
  });

def("ExportNamedDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("declaration", "specifiers", "source")
  .field("declaration", or(def("Declaration"), null))
  .field("specifiers", [def("ExportSpecifier")], defaults.emptyArray)
  .field("source", or(def("Literal"), null), defaults["null"]);

addModuleSpecifierFields("ExportSpecifier");
def("ExportSpecifier")
  .bases("BaseNode")
  .aliases("ModuleSpecifier")
  .build("local", "exported")
  .field("exported", def("Identifier"));

def("ExportDefaultDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("declaration")
  .field("declaration", or(def("Declaration"), def("Expression")));

def("ExportAllDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("source")
  .field("source", def("Literal"));

def("TaggedTemplateExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("tag", "quasi")
  .field("tag", def("Expression"))
  .field("quasi", def("TemplateLiteral"));

def("TemplateLiteral")
  .bases("BaseNode")
  .aliases("Expression")
  .build("quasis", "expressions")
  .field("quasis", [def("TemplateElement")])
  .field("expressions", [def("Expression")]);

def("TemplateElement")
  .bases("BaseNode")
  .aliases("Node")
  .build("value", "tail")
  .field("value", { cooked: String, raw: String })
  .field("tail", Boolean);

def("MetaProperty")
  .bases("BaseNode")
  .aliases("Expression")
  .build("meta", "property")
  .field("meta", def("Identifier"))
  .field("property", def("Identifier"));
