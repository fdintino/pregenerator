import "./es2020";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("AwaitExpression")
  .build("argument", "all")
  .field("argument", or(def("Expression"), null))
  .field("all", Boolean, defaults["false"]);

// Decorators
def("Decorator")
  .bases("Node")
  .build("expression")
  .field("expression", def("Expression"));

def("Property").field(
  "decorators",
  or([def("Decorator")], null),
  defaults["null"]
);

def("MethodDefinition").field(
  "decorators",
  or([def("Decorator")], null),
  defaults["null"]
);

// Private names
def("PrivateName")
  .bases("Expression")
  .build("id")
  .field("id", def("Identifier"));

def("ClassPrivateProperty")
  .bases("ClassProperty")
  .build("key", "value")
  .field("key", def("PrivateName"))
  .field("value", or(def("Expression"), null), defaults["null"]);
