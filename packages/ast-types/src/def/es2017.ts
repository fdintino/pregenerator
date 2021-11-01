import "./es2016";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def } = Type;

def("BaseFunction").field("async", Boolean, defaults["false"]);

def("AwaitExpression")
  .bases("BaseNode").aliases("Expression")
  .build("argument")
  .field("argument", def("Expression"));
