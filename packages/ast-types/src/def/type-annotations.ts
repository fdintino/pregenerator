/**
 * Type annotation defs shared between Flow and TypeScript.
 * These defs could not be defined in ./flow.ts or ./typescript.ts directly
 * because they use the same name.
 */

import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

const TypeAnnotation = or(def("TypeAnnotation"), def("TSTypeAnnotation"), null);

const TypeParamDecl = or(
  def("TypeParameterDeclaration"),
  def("TSTypeParameterDeclaration"),
  null
);

def("Identifier").field("typeAnnotation", TypeAnnotation, defaults["null"]);

def("ObjectPattern").field("typeAnnotation", TypeAnnotation, defaults["null"]);

[
  "ObjectMethod",
  "FunctionDeclaration",
  "FunctionExpression",
  "ArrowFunctionExpression",
  "ClassMethod",
  "ClassPrivateMethod",
].forEach((typeName) => {
  def(typeName)
    .field("returnType", TypeAnnotation, defaults["null"])
    .field("typeParameters", TypeParamDecl, defaults["null"]);
});

def("ClassProperty")
  .build("key", "value", "typeAnnotation", "static")
  .field("value", or(def("Expression"), null))
  .field("static", Boolean, defaults["false"])
  .field("typeAnnotation", TypeAnnotation, defaults["null"]);

["ClassDeclaration", "ClassExpression"].forEach((typeName) => {
  def(typeName)
    .field("typeParameters", TypeParamDecl, defaults["null"])
    .field(
      "superTypeParameters",
      or(
        def("TypeParameterInstantiation"),
        def("TSTypeParameterInstantiation"),
        null
      ),
      defaults["null"]
    )
    .field(
      "implements",
      or([def("ClassImplements")], [def("TSExpressionWithTypeArguments")]),
      defaults.emptyArray
    );
});
