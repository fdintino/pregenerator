import "./es2017";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("ForOfStatement").field("await", Boolean, defaults["false"]);

def("ObjectExpression").field("properties", [
  or(def("ObjectMethod"), def("ObjectProperty"), def("SpreadElement")),
]);

def("TemplateElement").field("value", {
  cooked: or(String, null),
  raw: String,
});
