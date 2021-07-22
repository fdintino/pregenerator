import { Fork } from "../types";
import es2018Def from "./es2018";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork): void {
  fork.use(es2018Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;

  def("CatchClause").field(
    "param",
    or(def("Identifier"), def("ArrayPattern"), def("ObjectPattern"), null),
    defaults["null"]
  );
}
