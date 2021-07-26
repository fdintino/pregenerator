import "./es2018";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("CatchClause").field(
  "param",
  or(def("Identifier"), def("ArrayPattern"), def("ObjectPattern"), null),
  defaults["null"]
);
