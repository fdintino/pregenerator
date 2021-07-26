import "./es2016";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def } = Type;

def("Function").field("async", Boolean, defaults["false"]);

def("AwaitExpression")
  .bases("Expression")
  .build("argument")
  .field("argument", def("Expression"));
