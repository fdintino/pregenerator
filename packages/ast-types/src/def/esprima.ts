import "./es2020";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("VariableDeclaration").field("declarations", [
  or(
    def("VariableDeclarator"),
    def("Identifier") // Esprima deviation.
  ),
]);

// Like ModuleSpecifier, except type:"ExportSpecifier" and buildable.
// export {<id [as name]>} [from ...];
def("ExportSpecifier")
  .bases("BaseNode").aliases("ModuleSpecifier")
  .field("local", or(def("Identifier"), null), defaults["null"])
  .field("id", or(def("Identifier"), null), defaults["null"])
  .field("name", or(def("Identifier"), null), defaults["null"])
  .build("id", "name");

// export <*> from ...;
def("ExportBatchSpecifier").bases("BaseNode").aliases("Specifier").build();

def("ExportDeclaration")
  .bases("BaseNode").aliases("Declaration")
  .build("default", "declaration", "specifiers", "source")
  .field("default", Boolean)
  .field(
    "declaration",
    or(
      def("Declaration"),
      def("Expression"), // Implies default.
      null
    )
  )
  .field(
    "specifiers",
    [or(def("ExportSpecifier"), def("ExportBatchSpecifier"))],
    defaults.emptyArray
  )
  .field("source", or(def("Literal"), null), defaults["null"]);

def("Block")
  .bases("BaseComment")
  .aliases("Comment")
  .build("value", /*optional:*/ "leading", "trailing");

def("Line")
  .bases("BaseComment")
  .aliases("Comment")
  .build("value", /*optional:*/ "leading", "trailing");
