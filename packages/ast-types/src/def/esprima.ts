import { Fork } from "../types";
import es2020Def from "./es2020";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork) {
  fork.use(es2020Def);

  var types = fork.use(typesPlugin);
  var defaults = fork.use(sharedPlugin).defaults;
  var def = types.Type.def;
  var or = types.Type.or;

  def("VariableDeclaration")
    .field("declarations", [or(
      def("VariableDeclarator"),
      def("Identifier") // Esprima deviation.
    )]);

  // def("ArrayPattern")
  //   .field("elements", [or(
  //     def("Pattern"),
  //     def("SpreadElement"),
  //     null
  //   )]);

  // Like ModuleSpecifier, except type:"ExportSpecifier" and buildable.
  // export {<id [as name]>} [from ...];
  def("ExportSpecifier")
    .bases("ModuleSpecifier")
    .build("id", "name");

  // export <*> from ...;
  def("ExportBatchSpecifier")
    .bases("Specifier")
    .build();

  def("ExportDeclaration")
    .bases("Declaration")
    .build("default", "declaration", "specifiers", "source")
    .field("default", Boolean)
    .field("declaration", or(
      def("Declaration"),
      def("Expression"), // Implies default.
      null
    ))
    .field("specifiers", [or(
      def("ExportSpecifier"),
      def("ExportBatchSpecifier")
    )], defaults.emptyArray)
    .field("source", or(
      def("Literal"),
      null
    ), defaults["null"]);

  def("Block")
    .bases("Comment")
    .build("value", /*optional:*/ "leading", "trailing");

  def("Line")
    .bases("Comment")
    .build("value", /*optional:*/ "leading", "trailing");
};
