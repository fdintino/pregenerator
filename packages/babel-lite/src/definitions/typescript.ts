import defineType, {
  arrayOfType,
  assertEach,
  assertNodeType,
  assertOneOf,
  assertValueType,
  chain,
  validate,
  validateArrayOfType,
  validateOptional,
  validateOptionalType,
  validateType,
} from "./utils";
import {
  functionDeclarationCommon,
  classMethodOrDeclareMethodCommon,
} from "./core";

const bool = assertValueType("boolean");

const tSFunctionTypeAnnotationCommon = {
  returnType: {
    validate: assertNodeType("TSTypeAnnotation", "Noop"),
    optional: true,
  },
  typeParameters: {
    validate: assertNodeType("TSTypeParameterDeclaration", "Noop"),
    optional: true,
  },
};

defineType/* TSParameterProperty */("TSParameterProperty", {
  aliases: ["LVal"], // TODO: This isn't usable in general as an LVal. Should have a "Parameter" alias.
  visitor: ["parameter"],
  fields: {
    accessibility: {
      validate: assertOneOf("public", "private", "protected"),
      optional: true,
    },
    readonly: {
      validate: assertValueType("boolean"),
      optional: true,
    },
    parameter: {
      validate: assertNodeType("Identifier", "AssignmentPattern"),
    },
  },
});

defineType/* TSDeclareFunction */("TSDeclareFunction", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "params", "returnType"],
  fields: {
    ...functionDeclarationCommon,
    ...tSFunctionTypeAnnotationCommon,
  },
});

defineType/* TSDeclareMethod */("TSDeclareMethod", {
  visitor: ["decorators", "key", "typeParameters", "params", "returnType"],
  fields: {
    ...classMethodOrDeclareMethodCommon,
    ...tSFunctionTypeAnnotationCommon,
  },
});

defineType/* TSQualifiedName */("TSQualifiedName", {
  aliases: ["TSEntityName"],
  visitor: ["left", "right"],
  fields: {
    left: validateType("TSEntityName"),
    right: validateType("Identifier"),
  },
});

const signatureDeclarationCommon = {
  typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
  parameters: validateArrayOfType(["Identifier", "RestElement"]),
  typeAnnotation: validateOptionalType("TSTypeAnnotation"),
};

const callConstructSignatureDeclaration = {
  aliases: ["TSTypeElement"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon,
};

defineType/* TSCallSignatureDeclaration */(
  "TSCallSignatureDeclaration",
  callConstructSignatureDeclaration
);
defineType/* TSConstructSignatureDeclaration */(
  "TSConstructSignatureDeclaration",
  callConstructSignatureDeclaration
);

const namedTypeElementCommon = {
  key: validateType("Expression"),
  computed: validate(bool),
  optional: validateOptional(bool),
};

defineType/* TSPropertySignature */("TSPropertySignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeAnnotation", "initializer"],
  fields: {
    ...namedTypeElementCommon,
    readonly: validateOptional(bool),
    typeAnnotation: validateOptionalType("TSTypeAnnotation"),
    initializer: validateOptionalType("Expression"),
  },
});

defineType/* TSMethodSignature */("TSMethodSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
  fields: {
    ...signatureDeclarationCommon,
    ...namedTypeElementCommon,
  },
});

defineType/* TSIndexSignature */("TSIndexSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["parameters", "typeAnnotation"],
  fields: {
    readonly: validateOptional(bool),
    parameters: validateArrayOfType("Identifier"), // Length must be 1
    typeAnnotation: validateOptionalType("TSTypeAnnotation"),
  },
});

const tsKeywordTypes = [
  "TSAnyKeyword",
  "TSBooleanKeyword",
  "TSBigIntKeyword",
  "TSNeverKeyword",
  "TSNullKeyword",
  "TSNumberKeyword",
  "TSObjectKeyword",
  "TSStringKeyword",
  "TSSymbolKeyword",
  "TSUndefinedKeyword",
  "TSUnknownKeyword",
  "TSVoidKeyword",
] as const;

for (const type of tsKeywordTypes) {
  defineType(type, {
    aliases: ["TSType", "TSBaseType"],
    // visitor: [],
    fields: {},
  });
}

defineType/* TSThisType */("TSThisType", {
  aliases: ["TSType", "TSBaseType"],
  // visitor: [],
  fields: {},
});

const fnOrCtr = {
  aliases: ["TSType"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon,
} as const;

defineType/* TSFunctionType */("TSFunctionType", fnOrCtr);
defineType/* TSConstructorType */("TSConstructorType", fnOrCtr);

defineType/* TSTypeReference */("TSTypeReference", {
  aliases: ["TSType"],
  visitor: ["typeName", "typeParameters"],
  fields: {
    typeName: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation"),
  },
});

defineType/* TSTypePredicate */("TSTypePredicate", {
  aliases: ["TSType"],
  visitor: ["parameterName", "typeAnnotation"],
  builder: ["parameterName", "typeAnnotation", "asserts"],
  fields: {
    parameterName: validateType(["Identifier", "TSThisType"]),
    typeAnnotation: validateOptionalType("TSTypeAnnotation"),
    asserts: validateOptional(bool),
  },
});

defineType/* TSTypeQuery */("TSTypeQuery", {
  aliases: ["TSType"],
  visitor: ["exprName"],
  fields: {
    exprName: validateType(["TSEntityName", "TSImportType"]),
  },
});

defineType/* TSTypeLiteral */("TSTypeLiteral", {
  aliases: ["TSType"],
  visitor: ["members"],
  fields: {
    members: validateArrayOfType("TSTypeElement"),
  },
});

defineType/* TSArrayType */("TSArrayType", {
  aliases: ["TSType"],
  visitor: ["elementType"],
  fields: {
    elementType: validateType("TSType"),
  },
});

defineType/* TSTupleType */("TSTupleType", {
  aliases: ["TSType"],
  visitor: ["elementTypes"],
  fields: {
    elementTypes: validateArrayOfType(["TSType", "TSNamedTupleMember"]),
  },
});

defineType/* TSOptionalType */("TSOptionalType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSRestType */("TSRestType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSNamedTupleMember */("TSNamedTupleMember", {
  visitor: ["label", "elementType"],
  builder: ["label", "elementType", "optional"],
  fields: {
    label: validateType("Identifier"),
    optional: {
      validate: bool,
      default: false,
    },
    elementType: validateType("TSType"),
  },
});

const unionOrIntersection = {
  aliases: ["TSType"],
  visitor: ["types"],
  fields: {
    types: validateArrayOfType("TSType"),
  },
};

defineType/* TSUnionType */("TSUnionType", unionOrIntersection);
defineType/* TSIntersectionType */("TSIntersectionType", unionOrIntersection);

defineType/* TSConditionalType */("TSConditionalType", {
  aliases: ["TSType"],
  visitor: ["checkType", "extendsType", "trueType", "falseType"],
  fields: {
    checkType: validateType("TSType"),
    extendsType: validateType("TSType"),
    trueType: validateType("TSType"),
    falseType: validateType("TSType"),
  },
});

defineType/* TSInferType */("TSInferType", {
  aliases: ["TSType"],
  visitor: ["typeParameter"],
  fields: {
    typeParameter: validateType("TSTypeParameter"),
  },
});

defineType/* TSParenthesizedType */("TSParenthesizedType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSTypeOperator */("TSTypeOperator", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: {
    operator: validate(assertValueType("string")),
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSIndexedAccessType */("TSIndexedAccessType", {
  aliases: ["TSType"],
  visitor: ["objectType", "indexType"],
  fields: {
    objectType: validateType("TSType"),
    indexType: validateType("TSType"),
  },
});

defineType/* TSMappedType */("TSMappedType", {
  aliases: ["TSType"],
  visitor: ["typeParameter", "typeAnnotation"],
  fields: {
    readonly: validateOptional(bool),
    typeParameter: validateType("TSTypeParameter"),
    optional: validateOptional(bool),
    typeAnnotation: validateOptionalType("TSType"),
  },
});

defineType/* TSLiteralType */("TSLiteralType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: ["literal"],
  fields: {
    literal: validateType([
      "NumericLiteral",
      "StringLiteral",
      "BooleanLiteral",
      "BigIntLiteral",
    ]),
  },
});

defineType/* TSExpressionWithTypeArguments */("TSExpressionWithTypeArguments", {
  aliases: ["TSType"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation"),
  },
});

defineType/* TSInterfaceDeclaration */("TSInterfaceDeclaration", {
  // "Statement" alias prevents a semicolon from appearing after it in an export declaration.
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "extends", "body"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
    extends: validateOptional(arrayOfType("TSExpressionWithTypeArguments")),
    body: validateType("TSInterfaceBody"),
  },
});

defineType/* TSInterfaceBody */("TSInterfaceBody", {
  visitor: ["body"],
  fields: {
    body: validateArrayOfType("TSTypeElement"),
  },
});

defineType/* TSTypeAliasDeclaration */("TSTypeAliasDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "typeAnnotation"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSAsExpression */("TSAsExpression", {
  aliases: ["Expression"],
  visitor: ["expression", "typeAnnotation"],
  fields: {
    expression: validateType("Expression"),
    typeAnnotation: validateType("TSType"),
  },
});

defineType/* TSTypeAssertion */("TSTypeAssertion", {
  aliases: ["Expression"],
  visitor: ["typeAnnotation", "expression"],
  fields: {
    typeAnnotation: validateType("TSType"),
    expression: validateType("Expression"),
  },
});

defineType/* TSEnumDeclaration */("TSEnumDeclaration", {
  // "Statement" alias prevents a semicolon from appearing after it in an export declaration.
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "members"],
  fields: {
    declare: validateOptional(bool),
    const: validateOptional(bool),
    id: validateType("Identifier"),
    members: validateArrayOfType("TSEnumMember"),
    initializer: validateOptionalType("Expression"),
  },
});

defineType/* TSEnumMember */("TSEnumMember", {
  visitor: ["id", "initializer"],
  fields: {
    id: validateType(["Identifier", "StringLiteral"]),
    initializer: validateOptionalType("Expression"),
  },
});

defineType/* TSModuleDeclaration */("TSModuleDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    declare: validateOptional(bool),
    global: validateOptional(bool),
    id: validateType(["Identifier", "StringLiteral"]),
    body: validateType(["TSModuleBlock", "TSModuleDeclaration"]),
  },
});

defineType/* TSModuleBlock */("TSModuleBlock", {
  aliases: ["Scopable", "Block", "BlockParent"],
  visitor: ["body"],
  fields: {
    body: validateArrayOfType("Statement"),
  },
});

defineType/* TSImportType */("TSImportType", {
  aliases: ["TSType"],
  visitor: ["argument", "qualifier", "typeParameters"],
  fields: {
    argument: validateType("StringLiteral"),
    qualifier: validateOptionalType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation"),
  },
});

defineType/* TSImportEqualsDeclaration */("TSImportEqualsDeclaration", {
  aliases: ["Statement"],
  visitor: ["id", "moduleReference"],
  fields: {
    isExport: validate(bool),
    id: validateType("Identifier"),
    moduleReference: validateType([
      "TSEntityName",
      "TSExternalModuleReference",
    ]),
  },
});

defineType/* TSExternalModuleReference */("TSExternalModuleReference", {
  visitor: ["expression"],
  fields: {
    expression: validateType("StringLiteral"),
  },
});

defineType/* TSNonNullExpression */("TSNonNullExpression", {
  aliases: ["Expression"],
  visitor: ["expression"],
  fields: {
    expression: validateType("Expression"),
  },
});

defineType/* TSExportAssignment */("TSExportAssignment", {
  aliases: ["Statement"],
  visitor: ["expression"],
  fields: {
    expression: validateType("Expression"),
  },
});

defineType/* TSNamespaceExportDeclaration */("TSNamespaceExportDeclaration", {
  aliases: ["Statement"],
  visitor: ["id"],
  fields: {
    id: validateType("Identifier"),
  },
});

defineType/* TSTypeAnnotation */("TSTypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: {
    typeAnnotation: {
      validate: assertNodeType("TSType"),
    },
  },
});

defineType/* TSTypeParameterInstantiation */("TSTypeParameterInstantiation", {
  visitor: ["params"],
  fields: {
    params: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("TSType"))
      ),
    },
  },
});

defineType/* TSTypeParameterDeclaration */("TSTypeParameterDeclaration", {
  visitor: ["params"],
  fields: {
    params: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("TSTypeParameter"))
      ),
    },
  },
});

defineType/* TSTypeParameter */("TSTypeParameter", {
  builder: ["constraint", "default", "name"],
  visitor: ["constraint", "default"],
  fields: {
    name: {
      validate: assertValueType("string"),
    },
    constraint: {
      validate: assertNodeType("TSType"),
      optional: true,
    },
    default: {
      validate: assertNodeType("TSType"),
      optional: true,
    },
  },
});
