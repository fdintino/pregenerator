import { Fork } from "../types";
import es2017Def from "./es2017";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork) {
  fork.use(es2017Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;

  def("ForOfStatement")
    .field("await", Boolean, defaults["false"]);

  // Legacy
  def("SpreadProperty").bases("SpreadElement");

  def("ObjectExpression")
    .field("properties", [or(
      def("ObjectMethod"),
      def("ObjectProperty"),
      def("SpreadElement")
    )]);

  def("TemplateElement")
    .field("value", {"cooked": or(String, null), "raw": String});
}
