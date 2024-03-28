import "./babel-core";
import "./type-annotations";
import { Type } from "../lib/types";
import { namedTypes as n } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

const StringLiteral = Type.from((value: any, deep?: any) => {
  if (n.StringLiteral && n.StringLiteral.check(value, deep)) {
    return true;
  }
  if (
    n.Literal &&
    n.Literal.check(value, deep) &&
    typeof value.value === "string"
  ) {
    return true;
  }
  return false;
}, "StringLiteral");

def("TSType").aliases("Node");

const TSEntityName = or(def("Identifier"), def("TSQualifiedName"));

def("TSTypeReference")
  .bases("TSHasOptionalTypeParameterInstantiation")
  .aliases("TSType")
  .build("typeName", "typeParameters")
  .field("typeName", TSEntityName);

// An abstract (non-buildable) base type that provide a commonly-needed
// optional .typeParameters field.
def("TSHasOptionalTypeParameterInstantiation")
  .field(
    "typeParameters",
    or(def("TSTypeParameterInstantiation"), null),
    defaults["null"]
  )
  .bases("BaseNode");

// An abstract (non-buildable) base type that provide a commonly-needed
// optional .typeParameters field.
def("TSHasOptionalTypeParameters")
  .field(
    "typeParameters",
    or(def("TSTypeParameterDeclaration"), null, void 0),
    defaults["null"]
  )
  .bases("BaseNode");

// An abstract (non-buildable) base type that provide a commonly-needed
// optional .typeAnnotation field.
def("TSHasOptionalTypeAnnotation")
  .field("typeAnnotation", or(def("TSTypeAnnotation"), null), defaults["null"])
  .bases("BaseNode");

def("TSQualifiedName")
  .bases("BaseNode")
  .aliases("Node")
  .build("left", "right")
  .field("left", TSEntityName)
  .field("right", TSEntityName);

def("TSAsExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("expression", "typeAnnotation")
  .field("expression", def("Expression"))
  .field("typeAnnotation", def("TSType"))
  .field("extra", or({ parenthesized: Boolean }, null), defaults["null"]);

def("TSNonNullExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("expression")
  .field("expression", def("Expression"));

[
  // Define all the simple keyword types.
  "TSAnyKeyword",
  "TSBigIntKeyword",
  "TSBooleanKeyword",
  "TSNeverKeyword",
  "TSNullKeyword",
  "TSNumberKeyword",
  "TSObjectKeyword",
  "TSStringKeyword",
  "TSSymbolKeyword",
  "TSUndefinedKeyword",
  "TSUnknownKeyword",
  "TSVoidKeyword",
  "TSThisType",
].forEach((keywordType) => {
  def(keywordType).bases("BaseNode").aliases("TSType").build();
});

def("TSArrayType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("elementType")
  .field("elementType", def("TSType"));

def("TSLiteralType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("literal")
  .field(
    "literal",
    or(
      def("NumericLiteral"),
      def("StringLiteral"),
      def("BooleanLiteral"),
      def("TemplateLiteral"),
      def("UnaryExpression")
    )
  );

["TSUnionType", "TSIntersectionType"].forEach((typeName) => {
  def(typeName)
    .bases("BaseNode")
    .aliases("TSType")
    .build("types")
    .field("types", [def("TSType")]);
});

def("TSConditionalType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("checkType", "extendsType", "trueType", "falseType")
  .field("checkType", def("TSType"))
  .field("extendsType", def("TSType"))
  .field("trueType", def("TSType"))
  .field("falseType", def("TSType"));

def("TSInferType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("typeParameter")
  .field("typeParameter", def("TSTypeParameter"));

def("TSParenthesizedType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("typeAnnotation")
  .field("typeAnnotation", def("TSType"));

const ParametersType = [
  or(
    def("Identifier"),
    def("RestElement"),
    def("ArrayPattern"),
    def("ObjectPattern")
  ),
];

["TSFunctionType", "TSConstructorType"].forEach((typeName) => {
  def(typeName)
    .bases("TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
    .aliases("TSType")
    .build("parameters")
    .field("parameters", ParametersType);
});

def("TSDeclareFunction")
  .bases("TSHasOptionalTypeParameters")
  .aliases("Declaration", "Statement")
  .build("id", "params", "returnType")
  .field("declare", Boolean, defaults["false"])
  .field("async", Boolean, defaults["false"])
  .field("generator", Boolean, defaults["false"])
  .field("id", or(def("Identifier"), null), defaults["null"])
  .field("params", [def("PatternLike")])
  // tSFunctionTypeAnnotationCommon
  .field(
    "returnType",
    or(
      def("TSTypeAnnotation"),
      def("Noop"), // Still used?
      null
    ),
    defaults["null"]
  );

def("TSDeclareMethod")
  .bases("TSHasOptionalTypeParameters")
  .aliases("Declaration")
  .build("key", "params", "returnType")
  .field("async", Boolean, defaults["false"])
  .field("generator", Boolean, defaults["false"])
  .field("params", [def("PatternLike")])
  // classMethodOrPropertyCommon
  .field("abstract", Boolean, defaults["false"])
  .field(
    "accessibility",
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  )
  .field("static", Boolean, defaults["false"])
  .field("computed", Boolean, defaults["false"])
  .field("optional", Boolean, defaults["false"])
  .field(
    "key",
    or(
      def("Identifier"),
      def("StringLiteral"),
      def("NumericLiteral"),
      // Only allowed if .computed is true.
      def("Expression")
    )
  )
  // classMethodOrDeclareMethodCommon
  .field(
    "kind",
    or("get", "set", "method", "constructor"),
    function getDefault() {
      return "method";
    }
  )
  .field(
    "access", // Not "accessibility"?
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  )
  .field("decorators", or([def("Decorator")], null), defaults["null"])
  // tSFunctionTypeAnnotationCommon
  .field(
    "returnType",
    or(
      def("TSTypeAnnotation"),
      def("Noop"), // Still used?
      null
    ),
    defaults["null"]
  );

def("TSMappedType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("typeParameter", "typeAnnotation")
  .field("readonly", or(Boolean, "+", "-"), defaults["false"])
  .field("typeParameter", def("TSTypeParameter"))
  .field("optional", or(Boolean, "+", "-"), defaults["false"])
  .field("typeAnnotation", or(def("TSType"), null), defaults["null"]);

def("TSTupleType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("elementTypes")
  .field("elementTypes", [or(def("TSType"), def("TSNamedTupleMember"))]);

def("TSNamedTupleMember")
  .bases("BaseNode")
  .aliases("TSType")
  .build("label", "elementType", "optional")
  .field("label", def("Identifier"))
  .field("optional", Boolean, defaults["false"])
  .field("elementType", def("TSType"));

def("TSRestType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("typeAnnotation")
  .field("typeAnnotation", def("TSType"));

def("TSOptionalType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("typeAnnotation")
  .field("typeAnnotation", def("TSType"));

def("TSIndexedAccessType")
  .bases("BaseNode")
  .aliases("TSType")
  .build("objectType", "indexType")
  .field("objectType", def("TSType"))
  .field("indexType", def("TSType"));

def("TSTypeOperator")
  .bases("BaseNode")
  .aliases("TSType")
  .build("operator")
  .field("operator", String)
  .field("typeAnnotation", def("TSType"));

def("TSTypeAnnotation")
  .bases("BaseNode")
  .aliases("Node")
  .build("typeAnnotation")
  .field("typeAnnotation", or(def("TSType"), def("TSTypeAnnotation")));

def("TSTypeElement").aliases("Node");

def("TSIndexSignature")
  .bases("TSHasOptionalTypeAnnotation")
  .aliases("TSTypeElement")
  .build("parameters", "typeAnnotation")
  .field("parameters", [def("Identifier")]) // Length === 1
  .field("readonly", Boolean, defaults["false"]);

def("TSPropertySignature")
  .bases("TSHasOptionalTypeAnnotation")
  .aliases("TSTypeElement")
  .build("key", "typeAnnotation", "optional")
  .field("key", def("Expression"))
  .field("computed", Boolean, defaults["false"])
  .field("readonly", Boolean, defaults["false"])
  .field("optional", Boolean, defaults["false"])
  .field("initializer", or(def("Expression"), null), defaults["null"]);

def("TSMethodSignature")
  .bases("TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
  .aliases("TSTypeElement")
  .build("key", "parameters", "typeAnnotation")
  .field("key", def("Expression"))
  .field("computed", Boolean, defaults["false"])
  .field("optional", Boolean, defaults["false"])
  .field("parameters", ParametersType);

def("TSTypePredicate")
  .bases("BaseNode")
  .aliases("TSTypeAnnotation", "TSType")
  .build("parameterName", "typeAnnotation", "asserts")
  .field("parameterName", or(def("Identifier"), def("TSThisType")))
  .field("typeAnnotation", or(def("TSTypeAnnotation"), null), defaults["null"])
  .field("asserts", Boolean, defaults["false"]);

["TSCallSignatureDeclaration", "TSConstructSignatureDeclaration"].forEach(
  (typeName) => {
    def(typeName)
      .bases("TSHasOptionalTypeParameters", "TSHasOptionalTypeAnnotation")
      .aliases("TSTypeElement")
      .build("parameters", "typeAnnotation")
      .field("parameters", ParametersType);
  }
);

def("TSEnumMember")
  .bases("BaseNode")
  .aliases("Node")
  .build("id", "initializer")
  .field("id", or(def("Identifier"), StringLiteral))
  .field("initializer", or(def("Expression"), null), defaults["null"]);

def("TSTypeQuery")
  .bases("BaseNode")
  .aliases("TSType")
  .build("exprName")
  .field("exprName", or(TSEntityName, def("TSImportType")));

// Inferred from Babylon's tsParseTypeMember method.
const TSTypeMember = or(
  def("TSCallSignatureDeclaration"),
  def("TSConstructSignatureDeclaration"),
  def("TSIndexSignature"),
  def("TSMethodSignature"),
  def("TSPropertySignature")
);

def("TSTypeLiteral")
  .bases("BaseNode")
  .aliases("TSType")
  .build("members")
  .field("members", [TSTypeMember]);

def("TSTypeParameter")
  .bases("BaseNode")
  .aliases("Node")
  .build("name", "constraint", "default")
  .field("name", String)
  .field("constraint", or(def("TSType"), void 0), defaults["undefined"])
  .field("default", or(def("TSType"), void 0), defaults["undefined"]);

def("TSTypeAssertion")
  .bases("BaseNode")
  .aliases("Expression")
  .build("typeAnnotation", "expression")
  .field("typeAnnotation", def("TSType"))
  .field("expression", def("Expression"))
  .field("extra", or({ parenthesized: Boolean }, null), defaults["null"]);

def("TSTypeParameterDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("params")
  .field("params", [def("TSTypeParameter")]);

def("TSTypeParameterInstantiation")
  .bases("BaseNode")
  .aliases("Node")
  .build("params")
  .field("params", [def("TSType")]);

def("TSEnumDeclaration")
  .bases("BaseNode")
  .aliases("Declaration", "Statement")
  .build("id", "members")
  .field("id", def("Identifier"))
  .field("const", Boolean, defaults["false"])
  .field("declare", Boolean, defaults["false"])
  .field("members", [def("TSEnumMember")])
  .field("initializer", or(def("Expression"), null), defaults["null"]);

def("TSTypeAliasDeclaration")
  .bases("TSHasOptionalTypeParameters")
  .aliases("Declaration", "Statement")
  .build("id", "typeAnnotation")
  .field("id", def("Identifier"))
  .field("declare", Boolean, defaults["false"])
  .field("typeAnnotation", def("TSType"));

def("TSModuleBlock")
  .bases("BaseNode")
  .aliases("Node")
  .build("body")
  .field("body", [def("Statement")]);

def("TSModuleDeclaration")
  .bases("BaseNode")
  .aliases("Declaration", "Statement")
  .build("id", "body")
  .field("id", or(StringLiteral, TSEntityName))
  .field("declare", Boolean, defaults["false"])
  .field("global", Boolean, defaults["false"])
  .field(
    "body",
    or(def("TSModuleBlock"), def("TSModuleDeclaration"), null),
    defaults["null"]
  );

def("TSImportType")
  .bases("TSHasOptionalTypeParameterInstantiation")
  .aliases("TSType")
  .build("argument", "qualifier", "typeParameters")
  .field("argument", StringLiteral)
  .field("qualifier", or(TSEntityName, void 0), defaults["undefined"]);

def("TSImportEqualsDeclaration")
  .bases("BaseNode")
  .aliases("Statement")
  .build("id", "moduleReference")
  .field("id", def("Identifier"))
  .field("isExport", Boolean, defaults["false"])
  .field("moduleReference", or(TSEntityName, def("TSExternalModuleReference")));

def("TSExternalModuleReference")
  .bases("BaseNode")
  .aliases("Node")
  .build("expression")
  .field("expression", StringLiteral);

def("TSExportAssignment")
  .bases("BaseNode")
  .aliases("Statement")
  .build("expression")
  .field("expression", def("Expression"));

def("TSNamespaceExportDeclaration")
  .bases("BaseNode")
  .aliases("Statement")
  .build("id")
  .field("id", def("Identifier"));

def("TSInterfaceBody")
  .bases("BaseNode")
  .aliases("Node")
  .build("body")
  .field("body", [TSTypeMember]);

def("TSExpressionWithTypeArguments")
  .bases("TSHasOptionalTypeParameterInstantiation")
  .aliases("TSType")
  .build("expression", "typeParameters")
  .field("expression", TSEntityName);

def("TSInterfaceDeclaration")
  .bases("TSHasOptionalTypeParameters")
  .aliases("Declaration", "Statement")
  .build("id", "body")
  .field("id", TSEntityName)
  .field("declare", Boolean, defaults["false"])
  .field(
    "extends",
    or([def("TSExpressionWithTypeArguments")], null),
    defaults["null"]
  )
  .field("body", def("TSInterfaceBody"));

def("TSParameterProperty")
  .bases("BaseNode")
  .aliases("LVal")
  .build("parameter")
  .field(
    "accessibility",
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  )
  .field("readonly", Boolean, defaults["false"])
  .field("parameter", or(def("Identifier"), def("AssignmentPattern")));

def("ClassProperty").field(
  "access", // Not "accessibility"?
  or("public", "private", "protected", void 0),
  defaults["undefined"]
);

// Defined already in es6 and babel-core.
def("ClassBody").field("body", [
  or(
    def("MethodDefinition"),
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    def("ClassPrivateProperty"),
    def("ClassMethod"),
    def("ClassPrivateMethod"),
    // Just need to add these types:
    def("TSDeclareMethod"),
    TSTypeMember
  ),
]);
