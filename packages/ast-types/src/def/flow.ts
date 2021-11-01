import "./es-proposals";
import "./type-annotations";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

// Base types

def("Flow").aliases("Node");
def("FlowType").bases("BaseNode").aliases("Flow");

// Type annotations

def("AnyTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("EmptyTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("MixedTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("VoidTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("SymbolTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("NumberTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("BigIntTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("NumberLiteralTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("value", "raw")
  .field("value", Number)
  .field("raw", String);

// Babylon 6 differs in AST from Flow
// same as NumberLiteralTypeAnnotation
def("NumericLiteralTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("value", "raw")
  .field("value", Number)
  .field("raw", String);

def("BigIntLiteralTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("value", "raw")
  .field("value", null)
  .field("raw", String);

def("StringTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("StringLiteralTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("value", "raw")
  .field("value", String)
  .field("raw", String);

def("BooleanTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("BooleanLiteralTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("value", "raw")
  .field("value", Boolean)
  .field("raw", String);

def("TypeAnnotation")
  .bases("BaseNode")
  .aliases("Node")
  .build("typeAnnotation")
  .field("typeAnnotation", def("FlowType"));

def("NullableTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("typeAnnotation")
  .field("typeAnnotation", def("FlowType"));

def("NullLiteralTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("NullTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("ThisTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("ExistsTypeAnnotation").bases("BaseNode").aliases("FlowType").build();

def("ExistentialTypeParam").bases("BaseNode").aliases("FlowType").build();

def("FunctionTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("params", "returnType", "rest", "typeParameters")
  .field("params", [def("FunctionTypeParam")])
  .field("returnType", def("FlowType"))
  .field("rest", or(def("FunctionTypeParam"), null))
  .field("typeParameters", or(def("TypeParameterDeclaration"), null));

def("FunctionTypeParam")
  .bases("BaseNode")
  .aliases("Node")
  .build("name", "typeAnnotation", "optional")
  .field("name", or(def("Identifier"), null))
  .field("typeAnnotation", def("FlowType"))
  .field("optional", Boolean);

def("ArrayTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("elementType")
  .field("elementType", def("FlowType"));

def("ObjectTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("properties", "indexers", "callProperties")
  .field("properties", [
    or(def("ObjectTypeProperty"), def("ObjectTypeSpreadProperty")),
  ])
  .field("indexers", [def("ObjectTypeIndexer")], defaults.emptyArray)
  .field("callProperties", [def("ObjectTypeCallProperty")], defaults.emptyArray)
  .field("inexact", or(Boolean, void 0), defaults["undefined"])
  .field("exact", Boolean, defaults["false"])
  .field("internalSlots", [def("ObjectTypeInternalSlot")], defaults.emptyArray);

def("Variance")
  .bases("BaseNode")
  .aliases("Node")
  .build("kind")
  .field("kind", or("plus", "minus"));

const LegacyVariance = or(def("Variance"), "plus", "minus", null);

def("ObjectTypeProperty")
  .bases("BaseNode")
  .aliases("Node")
  .build("key", "value", "optional")
  .field("key", or(def("Literal"), def("Identifier")))
  .field("value", def("FlowType"))
  .field("optional", Boolean)
  .field("variance", LegacyVariance, defaults["null"]);

def("ObjectTypeIndexer")
  .bases("BaseNode")
  .aliases("Node")
  .build("id", "key", "value")
  .field("id", def("Identifier"))
  .field("key", def("FlowType"))
  .field("value", def("FlowType"))
  .field("variance", LegacyVariance, defaults["null"])
  .field("static", Boolean, defaults["false"]);

def("ObjectTypeCallProperty")
  .bases("BaseNode")
  .aliases("Node")
  .build("value")
  .field("value", def("FunctionTypeAnnotation"))
  .field("static", Boolean, defaults["false"]);

def("QualifiedTypeIdentifier")
  .bases("BaseNode")
  .aliases("Node")
  .build("qualification", "id")
  .field("qualification", or(def("Identifier"), def("QualifiedTypeIdentifier")))
  .field("id", def("Identifier"));

def("GenericTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("id", "typeParameters")
  .field("id", or(def("Identifier"), def("QualifiedTypeIdentifier")))
  .field("typeParameters", or(def("TypeParameterInstantiation"), null));

def("MemberTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("object", "property")
  .field("object", def("Identifier"))
  .field(
    "property",
    or(def("MemberTypeAnnotation"), def("GenericTypeAnnotation"))
  );

def("UnionTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("types")
  .field("types", [def("FlowType")]);

def("IntersectionTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("types")
  .field("types", [def("FlowType")]);

def("TypeofTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("argument")
  .field("argument", def("FlowType"));

def("ObjectTypeSpreadProperty")
  .bases("BaseNode")
  .aliases("Node")
  .build("argument")
  .field("argument", def("FlowType"));

def("ObjectTypeInternalSlot")
  .bases("BaseNode")
  .aliases("Node")
  .build("id", "value", "optional", "static", "method")
  .field("id", def("Identifier"))
  .field("value", def("FlowType"))
  .field("optional", Boolean)
  .field("static", Boolean)
  .field("method", Boolean);

def("TypeParameterDeclaration")
  .bases("BaseNode")
  .aliases("Node")
  .build("params")
  .field("params", [def("TypeParameter")]);

def("TypeParameterInstantiation")
  .bases("BaseNode")
  .aliases("Node")
  .build("params")
  .field("params", [def("FlowType")]);

def("TypeParameter")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("name", "variance", "bound", "default")
  .field("name", String)
  .field("variance", LegacyVariance, defaults["null"])
  .field("bound", or(def("TypeAnnotation"), null), defaults["null"])
  .field("default", or(def("FlowType"), null), defaults["null"]);

def("ClassProperty").field("variance", LegacyVariance, defaults["null"]);

def("ClassImplements")
  .bases("BaseNode")
  .aliases("Node")
  .build("id")
  .field("id", def("Identifier"))
  .field("superClass", or(def("Expression"), null), defaults["null"])
  .field(
    "typeParameters",
    or(def("TypeParameterInstantiation"), null),
    defaults["null"]
  );

def("InterfaceTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("body", "extends")
  .field("body", def("ObjectTypeAnnotation"))
  .field("extends", or([def("InterfaceExtends")], null), defaults["null"]);

def("InterfaceDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "body", "extends")
  .field("id", def("Identifier"))
  .field(
    "typeParameters",
    or(def("TypeParameterDeclaration"), null),
    defaults["null"]
  )
  .field("body", def("ObjectTypeAnnotation"))
  .field("extends", [def("InterfaceExtends")]);

def("InterfaceExtends")
  .bases("BaseNode")
  .aliases("Node")
  .build("id")
  .field("id", def("Identifier"))
  .field(
    "typeParameters",
    or(def("TypeParameterInstantiation"), null),
    defaults["null"]
  );

def("TypeAlias")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "typeParameters", "right")
  .field("id", def("Identifier"))
  .field("typeParameters", or(def("TypeParameterDeclaration"), null))
  .field("right", def("FlowType"));

def("DeclareTypeAlias")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "typeParameters", "right")
  .field("id", def("Identifier"))
  .field("typeParameters", or(def("TypeParameterDeclaration"), null))
  .field("right", def("FlowType"));

def("OpaqueType")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "typeParameters", "impltype", "supertype")
  .field("id", def("Identifier"))
  .field("typeParameters", or(def("TypeParameterDeclaration"), null))
  .field("impltype", def("FlowType"))
  .field("supertype", or(def("FlowType"), null));

def("DeclareOpaqueType")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "typeParameters", "supertype")
  .field("id", def("Identifier"))
  .field("typeParameters", or(def("TypeParameterDeclaration"), null))
  .field("supertype", or(def("FlowType"), null))
  .field("impltype", or(def("FlowType"), null));

def("TypeCastExpression")
  .bases("BaseNode")
  .aliases("Expression")
  .build("expression", "typeAnnotation")
  .field("expression", def("Expression"))
  .field("typeAnnotation", def("TypeAnnotation"));

def("TupleTypeAnnotation")
  .bases("BaseNode")
  .aliases("FlowType")
  .build("types")
  .field("types", [def("FlowType")]);

def("DeclareVariable")
  .bases("BaseNode")
  .aliases("Statement")
  .build("id")
  .field("id", def("Identifier"));

def("DeclareFunction")
  .bases("BaseNode")
  .aliases("Statement")
  .build("id")
  .field("id", def("Identifier"))
  .field("predicate", or(def("FlowPredicate"), null), defaults["null"]);

def("DeclareClass")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "body", "extends")
  .field("id", def("Identifier"))
  .field(
    "typeParameters",
    or(def("TypeParameterDeclaration"), null),
    defaults["null"]
  )
  .field("body", def("ObjectTypeAnnotation"))
  .field("extends", [def("InterfaceExtends")]);

def("DeclareModule")
  .bases("BaseNode")
  .aliases("Statement")
  .build("id", "body")
  .field("id", or(def("Identifier"), def("Literal")))
  .field("body", def("BlockStatement"));

def("DeclareModuleExports")
  .bases("BaseNode")
  .aliases("Statement")
  .build("typeAnnotation")
  .field("typeAnnotation", def("TypeAnnotation"));

def("DeclareExportDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("default", "declaration", "specifiers", "source")
  .field("default", Boolean)
  .field(
    "declaration",
    or(
      def("DeclareVariable"),
      def("DeclareFunction"),
      def("DeclareClass"),
      def("FlowType"), // Implies default.
      def("TypeAlias"), // Implies named type
      def("DeclareOpaqueType"), // Implies named opaque type
      def("InterfaceDeclaration"),
      null
    )
  )
  .field(
    "specifiers",
    [or(def("ExportSpecifier"), def("ExportBatchSpecifier"))],
    defaults.emptyArray
  )
  .field("source", or(def("Literal"), null), defaults["null"]);

def("DeclareExportAllDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("source")
  .field("source", or(def("Literal"), null), defaults["null"]);

def("ImportDeclaration").field(
  "importKind",
  or("value", "type", "typeof"),
  () => "value"
);

def("FlowPredicate").bases("BaseNode").aliases("Flow");

def("InferredPredicate").bases("BaseNode").aliases("FlowPredicate").build();

def("DeclaredPredicate")
  .bases("BaseNode")
  .aliases("FlowPredicate")
  .build("value")
  .field("value", def("Expression"));

def("BaseFunction").field(
  "predicate",
  or(def("FlowPredicate"), null),
  defaults["null"]
);

def("CallExpression").field(
  "typeArguments",
  or(null, def("TypeParameterInstantiation")),
  defaults["null"]
);

def("NewExpression").field(
  "typeArguments",
  or(null, def("TypeParameterInstantiation")),
  defaults["null"]
);

// Enums
def("EnumDeclaration")
  .bases("BaseNode")
  .aliases("Declaration")
  .build("id", "body")
  .field("id", def("Identifier"))
  .field(
    "body",
    or(
      def("EnumBooleanBody"),
      def("EnumNumberBody"),
      def("EnumStringBody"),
      def("EnumSymbolBody")
    )
  );

def("EnumBooleanBody")
  .build("members", "explicitType")
  .field("members", [def("EnumBooleanMember")])
  .field("explicitType", Boolean);

def("EnumNumberBody")
  .build("members", "explicitType")
  .field("members", [def("EnumNumberMember")])
  .field("explicitType", Boolean);

def("EnumStringBody")
  .build("members", "explicitType")
  .field("members", or([def("EnumStringMember")], [def("EnumDefaultedMember")]))
  .field("explicitType", Boolean);

def("EnumSymbolBody")
  .build("members")
  .field("members", [def("EnumDefaultedMember")]);

def("EnumBooleanMember")
  .build("id", "init")
  .field("id", def("Identifier"))
  .field("init", or(def("Literal"), Boolean));

def("EnumNumberMember")
  .build("id", "init")
  .field("id", def("Identifier"))
  .field("init", def("Literal"));

def("EnumStringMember")
  .build("id", "init")
  .field("id", def("Identifier"))
  .field("init", def("Literal"));

def("EnumDefaultedMember").build("id").field("id", def("Identifier"));
