import { LogicalOperators } from "./core-operators";
import "./es2019";
import { namedTypes as N } from "../gen/namedTypes";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("ImportExpression")
  .bases("Expression")
  .build("source")
  .field("source", def("Expression"));

def("ExportAllDeclaration")
  .build("source", "exported")
  .field("source", def("Literal"))
  .field("exported", or(def("Identifier"), null));

// Optional chaining
def("ChainElement").bases("Node").field("optional", Boolean, defaults["false"]);

def("CallExpression").bases("Expression", "ChainElement");

def("MemberExpression").bases("Expression", "ChainElement");

def("ChainExpression")
  .bases("Expression")
  .build("expression")
  .field("expression", def("ChainElement"));

def("OptionalCallExpression")
  .bases("Expression")
  .build("callee", "arguments", "optional")
  .field("callee", def("Expression"))
  // See comment for NewExpression above.
  .field("arguments", [def("Expression")])
  .field("optional", Boolean, defaults["true"]);

// Deprecated optional chaining type, doesn't work with babelParser@7.11.0 or newer
def("OptionalMemberExpression")
  .bases("Expression", "LVal")
  .build("object", "property", "computed", "optional")
  .field("object", def("Expression"))
  .field("property", or(def("Identifier"), def("Expression")))
  .field("computed", Boolean, function (this: N.MemberExpression) {
    const type = this.property.type;
    if (
      type === "Literal" ||
      type === "MemberExpression" ||
      type === "BinaryExpression"
    ) {
      return true;
    }
    return false;
  })
  .field("optional", Boolean, defaults["true"]);

// Nullish coalescing
const LogicalOperator = or(...LogicalOperators, "??");

def("LogicalExpression").field("operator", LogicalOperator);
