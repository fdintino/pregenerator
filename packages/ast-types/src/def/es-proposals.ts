import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("AwaitExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("argument", "all")
  .field("argument", def("Expression"))
  .field("all", Boolean, defaults["false"]);

// Decorators
def("Decorator")
  .bases("BaseNode")
  .aliases("Node")
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
  .bases("BaseNode")
  .aliases("Expression")
  .build("id")
  .field("id", def("Identifier"));

def("ClassPrivateProperty")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("key", "value")
  .field("key", def("PrivateName"))
  .field("value", or(def("Expression"), null), defaults["null"])
  .field("computed", Boolean, defaults["false"]);
