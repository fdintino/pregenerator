/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import shallowEqual from "../../utils/shallowEqual";

import type {
  Node,
  ArrayExpression,
  AssignmentExpression,
  BinaryExpression,
  InterpreterDirective,
  Directive,
  DirectiveLiteral,
  BlockStatement,
  BreakStatement,
  CallExpression,
  CatchClause,
  ConditionalExpression,
  ContinueStatement,
  DebuggerStatement,
  DoWhileStatement,
  EmptyStatement,
  ExpressionStatement,
  File,
  ForInStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  LabeledStatement,
  StringLiteral,
  NumericLiteral,
  NullLiteral,
  BooleanLiteral,
  RegExpLiteral,
  LogicalExpression,
  MemberExpression,
  NewExpression,
  Program,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  RestElement,
  ReturnStatement,
  SequenceExpression,
  ParenthesizedExpression,
  SwitchCase,
  SwitchStatement,
  ThisExpression,
  ThrowStatement,
  TryStatement,
  UnaryExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement,
  WithStatement,
  AssignmentPattern,
  ArrayPattern,
  ArrowFunctionExpression,
  ClassBody,
  ClassExpression,
  ClassDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  ForOfStatement,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  MetaProperty,
  ClassMethod,
  ObjectPattern,
  SpreadElement,
  Super,
  TaggedTemplateExpression,
  TemplateElement,
  TemplateLiteral,
  YieldExpression,
  AwaitExpression,
  Import,
  BigIntLiteral,
  ExportNamespaceSpecifier,
  OptionalMemberExpression,
  OptionalCallExpression,
  AnyTypeAnnotation,
  ArrayTypeAnnotation,
  BooleanTypeAnnotation,
  BooleanLiteralTypeAnnotation,
  NullLiteralTypeAnnotation,
  ClassImplements,
  DeclareClass,
  DeclareFunction,
  DeclareInterface,
  DeclareModule,
  DeclareModuleExports,
  DeclareTypeAlias,
  DeclareOpaqueType,
  DeclareVariable,
  DeclareExportDeclaration,
  DeclareExportAllDeclaration,
  DeclaredPredicate,
  ExistsTypeAnnotation,
  FunctionTypeAnnotation,
  FunctionTypeParam,
  GenericTypeAnnotation,
  InferredPredicate,
  InterfaceExtends,
  InterfaceDeclaration,
  InterfaceTypeAnnotation,
  IntersectionTypeAnnotation,
  MixedTypeAnnotation,
  EmptyTypeAnnotation,
  NullableTypeAnnotation,
  NumberLiteralTypeAnnotation,
  NumberTypeAnnotation,
  ObjectTypeAnnotation,
  ObjectTypeInternalSlot,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeProperty,
  ObjectTypeSpreadProperty,
  OpaqueType,
  QualifiedTypeIdentifier,
  StringLiteralTypeAnnotation,
  StringTypeAnnotation,
  SymbolTypeAnnotation,
  ThisTypeAnnotation,
  TupleTypeAnnotation,
  TypeofTypeAnnotation,
  TypeAlias,
  TypeAnnotation,
  TypeCastExpression,
  TypeParameter,
  TypeParameterDeclaration,
  TypeParameterInstantiation,
  UnionTypeAnnotation,
  Variance,
  VoidTypeAnnotation,
  EnumDeclaration,
  EnumBooleanBody,
  EnumNumberBody,
  EnumStringBody,
  EnumSymbolBody,
  EnumBooleanMember,
  EnumNumberMember,
  EnumStringMember,
  EnumDefaultedMember,
  JSXAttribute,
  JSXClosingElement,
  JSXElement,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXSpreadChild,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  JSXSpreadAttribute,
  JSXText,
  JSXFragment,
  JSXOpeningFragment,
  JSXClosingFragment,
  Noop,
  Placeholder,
  V8IntrinsicIdentifier,
  ArgumentPlaceholder,
  BindExpression,
  ClassProperty,
  PipelineTopicExpression,
  PipelineBareFunction,
  PipelinePrimaryTopicReference,
  ClassPrivateProperty,
  ClassPrivateMethod,
  ImportAttribute,
  Decorator,
  DoExpression,
  ExportDefaultSpecifier,
  PrivateName,
  RecordExpression,
  TupleExpression,
  DecimalLiteral,
  TSParameterProperty,
  TSDeclareFunction,
  TSDeclareMethod,
  TSQualifiedName,
  TSCallSignatureDeclaration,
  TSConstructSignatureDeclaration,
  TSPropertySignature,
  TSMethodSignature,
  TSIndexSignature,
  TSAnyKeyword,
  TSBooleanKeyword,
  TSBigIntKeyword,
  TSNeverKeyword,
  TSNullKeyword,
  TSNumberKeyword,
  TSObjectKeyword,
  TSStringKeyword,
  TSSymbolKeyword,
  TSUndefinedKeyword,
  TSUnknownKeyword,
  TSVoidKeyword,
  TSThisType,
  TSFunctionType,
  TSConstructorType,
  TSTypeReference,
  TSTypePredicate,
  TSTypeQuery,
  TSTypeLiteral,
  TSArrayType,
  TSTupleType,
  TSOptionalType,
  TSRestType,
  TSNamedTupleMember,
  TSUnionType,
  TSIntersectionType,
  TSConditionalType,
  TSInferType,
  TSParenthesizedType,
  TSTypeOperator,
  TSIndexedAccessType,
  TSMappedType,
  TSLiteralType,
  TSExpressionWithTypeArguments,
  TSInterfaceDeclaration,
  TSInterfaceBody,
  TSTypeAliasDeclaration,
  TSAsExpression,
  TSTypeAssertion,
  TSEnumDeclaration,
  TSEnumMember,
  TSModuleDeclaration,
  TSModuleBlock,
  TSImportType,
  TSImportEqualsDeclaration,
  TSExternalModuleReference,
  TSNonNullExpression,
  TSExportAssignment,
  TSNamespaceExportDeclaration,
  TSTypeAnnotation,
  TSTypeParameterInstantiation,
  TSTypeParameterDeclaration,
  TSTypeParameter,
  Expression,
  Binary,
  Scopable,
  BlockParent,
  Block,
  Statement,
  Terminatorless,
  CompletionStatement,
  Conditional,
  Loop,
  While,
  ExpressionWrapper,
  For,
  ForXStatement,
  Function,
  FunctionParent,
  Pureish,
  Declaration,
  PatternLike,
  LVal,
  TSEntityName,
  Literal,
  Immutable,
  UserWhitespacable,
  Method,
  ObjectMember,
  Property,
  UnaryLike,
  Pattern,
  Class,
  ModuleDeclaration,
  ExportDeclaration,
  ModuleSpecifier,
  Flow,
  FlowType,
  FlowBaseAnnotation,
  FlowDeclaration,
  FlowPredicate,
  EnumBody,
  EnumMember,
  JSX,
  Private,
  TSTypeElement,
  TSType,
  TSBaseType,
  NumberLiteral,
  RegexLiteral,
  RestProperty,
  SpreadProperty,
} from "../../types";

export function isArrayExpression(
  node: Node | null | undefined,
  opts?: Partial<ArrayExpression> | null
): node is ArrayExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ArrayExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isAssignmentExpression(
  node: Node | null | undefined,
  opts?: Partial<AssignmentExpression> | null
): node is AssignmentExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "AssignmentExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBinaryExpression(
  node: Node | null | undefined,
  opts?: Partial<BinaryExpression> | null
): node is BinaryExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BinaryExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isInterpreterDirective(
  node: Node | null | undefined,
  opts?: Partial<InterpreterDirective> | null
): node is InterpreterDirective {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "InterpreterDirective") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDirective(
  node: Node | null | undefined,
  opts?: Partial<Directive> | null
): node is Directive {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Directive") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDirectiveLiteral(
  node: Node | null | undefined,
  opts?: Partial<DirectiveLiteral> | null
): node is DirectiveLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DirectiveLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBlockStatement(
  node: Node | null | undefined,
  opts?: Partial<BlockStatement> | null
): node is BlockStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BlockStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBreakStatement(
  node: Node | null | undefined,
  opts?: Partial<BreakStatement> | null
): node is BreakStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BreakStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isCallExpression(
  node: Node | null | undefined,
  opts?: Partial<CallExpression> | null
): node is CallExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "CallExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isCatchClause(
  node: Node | null | undefined,
  opts?: Partial<CatchClause> | null
): node is CatchClause {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "CatchClause") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isConditionalExpression(
  node: Node | null | undefined,
  opts?: Partial<ConditionalExpression> | null
): node is ConditionalExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ConditionalExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isContinueStatement(
  node: Node | null | undefined,
  opts?: Partial<ContinueStatement> | null
): node is ContinueStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ContinueStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDebuggerStatement(
  node: Node | null | undefined,
  opts?: Partial<DebuggerStatement> | null
): node is DebuggerStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DebuggerStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDoWhileStatement(
  node: Node | null | undefined,
  opts?: Partial<DoWhileStatement> | null
): node is DoWhileStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DoWhileStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEmptyStatement(
  node: Node | null | undefined,
  opts?: Partial<EmptyStatement> | null
): node is EmptyStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EmptyStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExpressionStatement(
  node: Node | null | undefined,
  opts?: Partial<ExpressionStatement> | null
): node is ExpressionStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExpressionStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFile(
  node: Node | null | undefined,
  opts?: Partial<File> | null
): node is File {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "File") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isForInStatement(
  node: Node | null | undefined,
  opts?: Partial<ForInStatement> | null
): node is ForInStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ForInStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isForStatement(
  node: Node | null | undefined,
  opts?: Partial<ForStatement> | null
): node is ForStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ForStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunctionDeclaration(
  node: Node | null | undefined,
  opts?: Partial<FunctionDeclaration> | null
): node is FunctionDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "FunctionDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunctionExpression(
  node: Node | null | undefined,
  opts?: Partial<FunctionExpression> | null
): node is FunctionExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "FunctionExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isIdentifier(
  node: Node | null | undefined,
  opts?: Partial<Identifier> | null
): node is Identifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Identifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isIfStatement(
  node: Node | null | undefined,
  opts?: Partial<IfStatement> | null
): node is IfStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "IfStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isLabeledStatement(
  node: Node | null | undefined,
  opts?: Partial<LabeledStatement> | null
): node is LabeledStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "LabeledStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isStringLiteral(
  node: Node | null | undefined,
  opts?: Partial<StringLiteral> | null
): node is StringLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "StringLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNumericLiteral(
  node: Node | null | undefined,
  opts?: Partial<NumericLiteral> | null
): node is NumericLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NumericLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNullLiteral(
  node: Node | null | undefined,
  opts?: Partial<NullLiteral> | null
): node is NullLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NullLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBooleanLiteral(
  node: Node | null | undefined,
  opts?: Partial<BooleanLiteral> | null
): node is BooleanLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BooleanLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isRegExpLiteral(
  node: Node | null | undefined,
  opts?: Partial<RegExpLiteral> | null
): node is RegExpLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "RegExpLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isLogicalExpression(
  node: Node | null | undefined,
  opts?: Partial<LogicalExpression> | null
): node is LogicalExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "LogicalExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<MemberExpression> | null
): node is MemberExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "MemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNewExpression(
  node: Node | null | undefined,
  opts?: Partial<NewExpression> | null
): node is NewExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NewExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isProgram(
  node: Node | null | undefined,
  opts?: Partial<Program> | null
): node is Program {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Program") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectExpression(
  node: Node | null | undefined,
  opts?: Partial<ObjectExpression> | null
): node is ObjectExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectMethod(
  node: Node | null | undefined,
  opts?: Partial<ObjectMethod> | null
): node is ObjectMethod {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectProperty> | null
): node is ObjectProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isRestElement(
  node: Node | null | undefined,
  opts?: Partial<RestElement> | null
): node is RestElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "RestElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isReturnStatement(
  node: Node | null | undefined,
  opts?: Partial<ReturnStatement> | null
): node is ReturnStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ReturnStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSequenceExpression(
  node: Node | null | undefined,
  opts?: Partial<SequenceExpression> | null
): node is SequenceExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SequenceExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isParenthesizedExpression(
  node: Node | null | undefined,
  opts?: Partial<ParenthesizedExpression> | null
): node is ParenthesizedExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ParenthesizedExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSwitchCase(
  node: Node | null | undefined,
  opts?: Partial<SwitchCase> | null
): node is SwitchCase {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SwitchCase") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSwitchStatement(
  node: Node | null | undefined,
  opts?: Partial<SwitchStatement> | null
): node is SwitchStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SwitchStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isThisExpression(
  node: Node | null | undefined,
  opts?: Partial<ThisExpression> | null
): node is ThisExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ThisExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isThrowStatement(
  node: Node | null | undefined,
  opts?: Partial<ThrowStatement> | null
): node is ThrowStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ThrowStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTryStatement(
  node: Node | null | undefined,
  opts?: Partial<TryStatement> | null
): node is TryStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TryStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isUnaryExpression(
  node: Node | null | undefined,
  opts?: Partial<UnaryExpression> | null
): node is UnaryExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "UnaryExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isUpdateExpression(
  node: Node | null | undefined,
  opts?: Partial<UpdateExpression> | null
): node is UpdateExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "UpdateExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isVariableDeclaration(
  node: Node | null | undefined,
  opts?: Partial<VariableDeclaration> | null
): node is VariableDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "VariableDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isVariableDeclarator(
  node: Node | null | undefined,
  opts?: Partial<VariableDeclarator> | null
): node is VariableDeclarator {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "VariableDeclarator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isWhileStatement(
  node: Node | null | undefined,
  opts?: Partial<WhileStatement> | null
): node is WhileStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "WhileStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isWithStatement(
  node: Node | null | undefined,
  opts?: Partial<WithStatement> | null
): node is WithStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "WithStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isAssignmentPattern(
  node: Node | null | undefined,
  opts?: Partial<AssignmentPattern> | null
): node is AssignmentPattern {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "AssignmentPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isArrayPattern(
  node: Node | null | undefined,
  opts?: Partial<ArrayPattern> | null
): node is ArrayPattern {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ArrayPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isArrowFunctionExpression(
  node: Node | null | undefined,
  opts?: Partial<ArrowFunctionExpression> | null
): node is ArrowFunctionExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ArrowFunctionExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassBody(
  node: Node | null | undefined,
  opts?: Partial<ClassBody> | null
): node is ClassBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassExpression(
  node: Node | null | undefined,
  opts?: Partial<ClassExpression> | null
): node is ClassExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ClassDeclaration> | null
): node is ClassDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportAllDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportAllDeclaration> | null
): node is ExportAllDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportAllDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportDefaultDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportDefaultDeclaration> | null
): node is ExportDefaultDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportDefaultDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportNamedDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportNamedDeclaration> | null
): node is ExportNamedDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportNamedDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportSpecifier> | null
): node is ExportSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isForOfStatement(
  node: Node | null | undefined,
  opts?: Partial<ForOfStatement> | null
): node is ForOfStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ForOfStatement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ImportDeclaration> | null
): node is ImportDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ImportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImportDefaultSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportDefaultSpecifier> | null
): node is ImportDefaultSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ImportDefaultSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImportNamespaceSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportNamespaceSpecifier> | null
): node is ImportNamespaceSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ImportNamespaceSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImportSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportSpecifier> | null
): node is ImportSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ImportSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isMetaProperty(
  node: Node | null | undefined,
  opts?: Partial<MetaProperty> | null
): node is MetaProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "MetaProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassMethod(
  node: Node | null | undefined,
  opts?: Partial<ClassMethod> | null
): node is ClassMethod {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectPattern(
  node: Node | null | undefined,
  opts?: Partial<ObjectPattern> | null
): node is ObjectPattern {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectPattern") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSpreadElement(
  node: Node | null | undefined,
  opts?: Partial<SpreadElement> | null
): node is SpreadElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SpreadElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSuper(
  node: Node | null | undefined,
  opts?: Partial<Super> | null
): node is Super {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Super") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTaggedTemplateExpression(
  node: Node | null | undefined,
  opts?: Partial<TaggedTemplateExpression> | null
): node is TaggedTemplateExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TaggedTemplateExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTemplateElement(
  node: Node | null | undefined,
  opts?: Partial<TemplateElement> | null
): node is TemplateElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TemplateElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTemplateLiteral(
  node: Node | null | undefined,
  opts?: Partial<TemplateLiteral> | null
): node is TemplateLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TemplateLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isYieldExpression(
  node: Node | null | undefined,
  opts?: Partial<YieldExpression> | null
): node is YieldExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "YieldExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isAwaitExpression(
  node: Node | null | undefined,
  opts?: Partial<AwaitExpression> | null
): node is AwaitExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "AwaitExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImport(
  node: Node | null | undefined,
  opts?: Partial<Import> | null
): node is Import {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Import") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBigIntLiteral(
  node: Node | null | undefined,
  opts?: Partial<BigIntLiteral> | null
): node is BigIntLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BigIntLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportNamespaceSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportNamespaceSpecifier> | null
): node is ExportNamespaceSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportNamespaceSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isOptionalMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<OptionalMemberExpression> | null
): node is OptionalMemberExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "OptionalMemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isOptionalCallExpression(
  node: Node | null | undefined,
  opts?: Partial<OptionalCallExpression> | null
): node is OptionalCallExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "OptionalCallExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isAnyTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<AnyTypeAnnotation> | null
): node is AnyTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "AnyTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isArrayTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ArrayTypeAnnotation> | null
): node is ArrayTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ArrayTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBooleanTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<BooleanTypeAnnotation> | null
): node is BooleanTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BooleanTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBooleanLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<BooleanLiteralTypeAnnotation> | null
): node is BooleanLiteralTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BooleanLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNullLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NullLiteralTypeAnnotation> | null
): node is NullLiteralTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NullLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassImplements(
  node: Node | null | undefined,
  opts?: Partial<ClassImplements> | null
): node is ClassImplements {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassImplements") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareClass(
  node: Node | null | undefined,
  opts?: Partial<DeclareClass> | null
): node is DeclareClass {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareClass") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareFunction(
  node: Node | null | undefined,
  opts?: Partial<DeclareFunction> | null
): node is DeclareFunction {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareInterface(
  node: Node | null | undefined,
  opts?: Partial<DeclareInterface> | null
): node is DeclareInterface {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareInterface") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareModule(
  node: Node | null | undefined,
  opts?: Partial<DeclareModule> | null
): node is DeclareModule {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareModule") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareModuleExports(
  node: Node | null | undefined,
  opts?: Partial<DeclareModuleExports> | null
): node is DeclareModuleExports {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareModuleExports") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareTypeAlias(
  node: Node | null | undefined,
  opts?: Partial<DeclareTypeAlias> | null
): node is DeclareTypeAlias {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareTypeAlias") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareOpaqueType(
  node: Node | null | undefined,
  opts?: Partial<DeclareOpaqueType> | null
): node is DeclareOpaqueType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareOpaqueType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareVariable(
  node: Node | null | undefined,
  opts?: Partial<DeclareVariable> | null
): node is DeclareVariable {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareVariable") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<DeclareExportDeclaration> | null
): node is DeclareExportDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareExportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclareExportAllDeclaration(
  node: Node | null | undefined,
  opts?: Partial<DeclareExportAllDeclaration> | null
): node is DeclareExportAllDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclareExportAllDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclaredPredicate(
  node: Node | null | undefined,
  opts?: Partial<DeclaredPredicate> | null
): node is DeclaredPredicate {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DeclaredPredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExistsTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ExistsTypeAnnotation> | null
): node is ExistsTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExistsTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunctionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<FunctionTypeAnnotation> | null
): node is FunctionTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "FunctionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunctionTypeParam(
  node: Node | null | undefined,
  opts?: Partial<FunctionTypeParam> | null
): node is FunctionTypeParam {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "FunctionTypeParam") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isGenericTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<GenericTypeAnnotation> | null
): node is GenericTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "GenericTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isInferredPredicate(
  node: Node | null | undefined,
  opts?: Partial<InferredPredicate> | null
): node is InferredPredicate {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "InferredPredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isInterfaceExtends(
  node: Node | null | undefined,
  opts?: Partial<InterfaceExtends> | null
): node is InterfaceExtends {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "InterfaceExtends") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isInterfaceDeclaration(
  node: Node | null | undefined,
  opts?: Partial<InterfaceDeclaration> | null
): node is InterfaceDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "InterfaceDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isInterfaceTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<InterfaceTypeAnnotation> | null
): node is InterfaceTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "InterfaceTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isIntersectionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<IntersectionTypeAnnotation> | null
): node is IntersectionTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "IntersectionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isMixedTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<MixedTypeAnnotation> | null
): node is MixedTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "MixedTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEmptyTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<EmptyTypeAnnotation> | null
): node is EmptyTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EmptyTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNullableTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NullableTypeAnnotation> | null
): node is NullableTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NullableTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNumberLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NumberLiteralTypeAnnotation> | null
): node is NumberLiteralTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NumberLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNumberTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NumberTypeAnnotation> | null
): node is NumberTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NumberTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeAnnotation> | null
): node is ObjectTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeInternalSlot(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeInternalSlot> | null
): node is ObjectTypeInternalSlot {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeInternalSlot") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeCallProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeCallProperty> | null
): node is ObjectTypeCallProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeCallProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeIndexer(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeIndexer> | null
): node is ObjectTypeIndexer {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeIndexer") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeProperty> | null
): node is ObjectTypeProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectTypeSpreadProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeSpreadProperty> | null
): node is ObjectTypeSpreadProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ObjectTypeSpreadProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isOpaqueType(
  node: Node | null | undefined,
  opts?: Partial<OpaqueType> | null
): node is OpaqueType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "OpaqueType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isQualifiedTypeIdentifier(
  node: Node | null | undefined,
  opts?: Partial<QualifiedTypeIdentifier> | null
): node is QualifiedTypeIdentifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "QualifiedTypeIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isStringLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<StringLiteralTypeAnnotation> | null
): node is StringLiteralTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "StringLiteralTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isStringTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<StringTypeAnnotation> | null
): node is StringTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "StringTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSymbolTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<SymbolTypeAnnotation> | null
): node is SymbolTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SymbolTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isThisTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ThisTypeAnnotation> | null
): node is ThisTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ThisTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTupleTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TupleTypeAnnotation> | null
): node is TupleTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TupleTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeofTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TypeofTypeAnnotation> | null
): node is TypeofTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeofTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeAlias(
  node: Node | null | undefined,
  opts?: Partial<TypeAlias> | null
): node is TypeAlias {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeAlias") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TypeAnnotation> | null
): node is TypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeCastExpression(
  node: Node | null | undefined,
  opts?: Partial<TypeCastExpression> | null
): node is TypeCastExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeCastExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeParameter(
  node: Node | null | undefined,
  opts?: Partial<TypeParameter> | null
): node is TypeParameter {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeParameter") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeParameterDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TypeParameterDeclaration> | null
): node is TypeParameterDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeParameterDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTypeParameterInstantiation(
  node: Node | null | undefined,
  opts?: Partial<TypeParameterInstantiation> | null
): node is TypeParameterInstantiation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TypeParameterInstantiation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isUnionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<UnionTypeAnnotation> | null
): node is UnionTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "UnionTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isVariance(
  node: Node | null | undefined,
  opts?: Partial<Variance> | null
): node is Variance {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Variance") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isVoidTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<VoidTypeAnnotation> | null
): node is VoidTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "VoidTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumDeclaration(
  node: Node | null | undefined,
  opts?: Partial<EnumDeclaration> | null
): node is EnumDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumBooleanBody(
  node: Node | null | undefined,
  opts?: Partial<EnumBooleanBody> | null
): node is EnumBooleanBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumBooleanBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumNumberBody(
  node: Node | null | undefined,
  opts?: Partial<EnumNumberBody> | null
): node is EnumNumberBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumNumberBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumStringBody(
  node: Node | null | undefined,
  opts?: Partial<EnumStringBody> | null
): node is EnumStringBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumStringBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumSymbolBody(
  node: Node | null | undefined,
  opts?: Partial<EnumSymbolBody> | null
): node is EnumSymbolBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumSymbolBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumBooleanMember(
  node: Node | null | undefined,
  opts?: Partial<EnumBooleanMember> | null
): node is EnumBooleanMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumBooleanMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumNumberMember(
  node: Node | null | undefined,
  opts?: Partial<EnumNumberMember> | null
): node is EnumNumberMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumNumberMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumStringMember(
  node: Node | null | undefined,
  opts?: Partial<EnumStringMember> | null
): node is EnumStringMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumStringMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumDefaultedMember(
  node: Node | null | undefined,
  opts?: Partial<EnumDefaultedMember> | null
): node is EnumDefaultedMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "EnumDefaultedMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXAttribute(
  node: Node | null | undefined,
  opts?: Partial<JSXAttribute> | null
): node is JSXAttribute {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXClosingElement(
  node: Node | null | undefined,
  opts?: Partial<JSXClosingElement> | null
): node is JSXClosingElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXClosingElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXElement(
  node: Node | null | undefined,
  opts?: Partial<JSXElement> | null
): node is JSXElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXEmptyExpression(
  node: Node | null | undefined,
  opts?: Partial<JSXEmptyExpression> | null
): node is JSXEmptyExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXEmptyExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXExpressionContainer(
  node: Node | null | undefined,
  opts?: Partial<JSXExpressionContainer> | null
): node is JSXExpressionContainer {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXExpressionContainer") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXSpreadChild(
  node: Node | null | undefined,
  opts?: Partial<JSXSpreadChild> | null
): node is JSXSpreadChild {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXSpreadChild") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXIdentifier(
  node: Node | null | undefined,
  opts?: Partial<JSXIdentifier> | null
): node is JSXIdentifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<JSXMemberExpression> | null
): node is JSXMemberExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXMemberExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXNamespacedName(
  node: Node | null | undefined,
  opts?: Partial<JSXNamespacedName> | null
): node is JSXNamespacedName {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXNamespacedName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXOpeningElement(
  node: Node | null | undefined,
  opts?: Partial<JSXOpeningElement> | null
): node is JSXOpeningElement {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXOpeningElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXSpreadAttribute(
  node: Node | null | undefined,
  opts?: Partial<JSXSpreadAttribute> | null
): node is JSXSpreadAttribute {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXSpreadAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXText(
  node: Node | null | undefined,
  opts?: Partial<JSXText> | null
): node is JSXText {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXText") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXFragment> | null
): node is JSXFragment {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXOpeningFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXOpeningFragment> | null
): node is JSXOpeningFragment {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXOpeningFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSXClosingFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXClosingFragment> | null
): node is JSXClosingFragment {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "JSXClosingFragment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNoop(
  node: Node | null | undefined,
  opts?: Partial<Noop> | null
): node is Noop {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Noop") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPlaceholder(
  node: Node | null | undefined,
  opts?: Partial<Placeholder> | null
): node is Placeholder {
  if (!node) return false;

  const nodeType = node.type;
  if (isPlaceholder(node)) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isV8IntrinsicIdentifier(
  node: Node | null | undefined,
  opts?: Partial<V8IntrinsicIdentifier> | null
): node is V8IntrinsicIdentifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "V8IntrinsicIdentifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isArgumentPlaceholder(
  node: Node | null | undefined,
  opts?: Partial<ArgumentPlaceholder> | null
): node is ArgumentPlaceholder {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ArgumentPlaceholder") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBindExpression(
  node: Node | null | undefined,
  opts?: Partial<BindExpression> | null
): node is BindExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "BindExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassProperty(
  node: Node | null | undefined,
  opts?: Partial<ClassProperty> | null
): node is ClassProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPipelineTopicExpression(
  node: Node | null | undefined,
  opts?: Partial<PipelineTopicExpression> | null
): node is PipelineTopicExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "PipelineTopicExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPipelineBareFunction(
  node: Node | null | undefined,
  opts?: Partial<PipelineBareFunction> | null
): node is PipelineBareFunction {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "PipelineBareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPipelinePrimaryTopicReference(
  node: Node | null | undefined,
  opts?: Partial<PipelinePrimaryTopicReference> | null
): node is PipelinePrimaryTopicReference {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "PipelinePrimaryTopicReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassPrivateProperty(
  node: Node | null | undefined,
  opts?: Partial<ClassPrivateProperty> | null
): node is ClassPrivateProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassPrivateProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClassPrivateMethod(
  node: Node | null | undefined,
  opts?: Partial<ClassPrivateMethod> | null
): node is ClassPrivateMethod {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ClassPrivateMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImportAttribute(
  node: Node | null | undefined,
  opts?: Partial<ImportAttribute> | null
): node is ImportAttribute {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ImportAttribute") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDecorator(
  node: Node | null | undefined,
  opts?: Partial<Decorator> | null
): node is Decorator {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "Decorator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDoExpression(
  node: Node | null | undefined,
  opts?: Partial<DoExpression> | null
): node is DoExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DoExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportDefaultSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportDefaultSpecifier> | null
): node is ExportDefaultSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "ExportDefaultSpecifier") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPrivateName(
  node: Node | null | undefined,
  opts?: Partial<PrivateName> | null
): node is PrivateName {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "PrivateName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isRecordExpression(
  node: Node | null | undefined,
  opts?: Partial<RecordExpression> | null
): node is RecordExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "RecordExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTupleExpression(
  node: Node | null | undefined,
  opts?: Partial<TupleExpression> | null
): node is TupleExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TupleExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDecimalLiteral(
  node: Node | null | undefined,
  opts?: Partial<DecimalLiteral> | null
): node is DecimalLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "DecimalLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSParameterProperty(
  node: Node | null | undefined,
  opts?: Partial<TSParameterProperty> | null
): node is TSParameterProperty {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSParameterProperty") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSDeclareFunction(
  node: Node | null | undefined,
  opts?: Partial<TSDeclareFunction> | null
): node is TSDeclareFunction {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSDeclareFunction") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSDeclareMethod(
  node: Node | null | undefined,
  opts?: Partial<TSDeclareMethod> | null
): node is TSDeclareMethod {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSDeclareMethod") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSQualifiedName(
  node: Node | null | undefined,
  opts?: Partial<TSQualifiedName> | null
): node is TSQualifiedName {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSQualifiedName") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSCallSignatureDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSCallSignatureDeclaration> | null
): node is TSCallSignatureDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSCallSignatureDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSConstructSignatureDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSConstructSignatureDeclaration> | null
): node is TSConstructSignatureDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSConstructSignatureDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSPropertySignature(
  node: Node | null | undefined,
  opts?: Partial<TSPropertySignature> | null
): node is TSPropertySignature {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSPropertySignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSMethodSignature(
  node: Node | null | undefined,
  opts?: Partial<TSMethodSignature> | null
): node is TSMethodSignature {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSMethodSignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSIndexSignature(
  node: Node | null | undefined,
  opts?: Partial<TSIndexSignature> | null
): node is TSIndexSignature {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSIndexSignature") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSAnyKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSAnyKeyword> | null
): node is TSAnyKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSAnyKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSBooleanKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSBooleanKeyword> | null
): node is TSBooleanKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSBooleanKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSBigIntKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSBigIntKeyword> | null
): node is TSBigIntKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSBigIntKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNeverKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNeverKeyword> | null
): node is TSNeverKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNeverKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNullKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNullKeyword> | null
): node is TSNullKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNullKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNumberKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNumberKeyword> | null
): node is TSNumberKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNumberKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSObjectKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSObjectKeyword> | null
): node is TSObjectKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSObjectKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSStringKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSStringKeyword> | null
): node is TSStringKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSStringKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSSymbolKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSSymbolKeyword> | null
): node is TSSymbolKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSSymbolKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSUndefinedKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSUndefinedKeyword> | null
): node is TSUndefinedKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSUndefinedKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSUnknownKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSUnknownKeyword> | null
): node is TSUnknownKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSUnknownKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSVoidKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSVoidKeyword> | null
): node is TSVoidKeyword {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSVoidKeyword") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSThisType(
  node: Node | null | undefined,
  opts?: Partial<TSThisType> | null
): node is TSThisType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSThisType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSFunctionType(
  node: Node | null | undefined,
  opts?: Partial<TSFunctionType> | null
): node is TSFunctionType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSFunctionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSConstructorType(
  node: Node | null | undefined,
  opts?: Partial<TSConstructorType> | null
): node is TSConstructorType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSConstructorType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeReference(
  node: Node | null | undefined,
  opts?: Partial<TSTypeReference> | null
): node is TSTypeReference {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypePredicate(
  node: Node | null | undefined,
  opts?: Partial<TSTypePredicate> | null
): node is TSTypePredicate {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypePredicate") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeQuery(
  node: Node | null | undefined,
  opts?: Partial<TSTypeQuery> | null
): node is TSTypeQuery {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeQuery") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeLiteral(
  node: Node | null | undefined,
  opts?: Partial<TSTypeLiteral> | null
): node is TSTypeLiteral {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSArrayType(
  node: Node | null | undefined,
  opts?: Partial<TSArrayType> | null
): node is TSArrayType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSArrayType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTupleType(
  node: Node | null | undefined,
  opts?: Partial<TSTupleType> | null
): node is TSTupleType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTupleType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSOptionalType(
  node: Node | null | undefined,
  opts?: Partial<TSOptionalType> | null
): node is TSOptionalType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSOptionalType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSRestType(
  node: Node | null | undefined,
  opts?: Partial<TSRestType> | null
): node is TSRestType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSRestType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNamedTupleMember(
  node: Node | null | undefined,
  opts?: Partial<TSNamedTupleMember> | null
): node is TSNamedTupleMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNamedTupleMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSUnionType(
  node: Node | null | undefined,
  opts?: Partial<TSUnionType> | null
): node is TSUnionType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSUnionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSIntersectionType(
  node: Node | null | undefined,
  opts?: Partial<TSIntersectionType> | null
): node is TSIntersectionType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSIntersectionType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSConditionalType(
  node: Node | null | undefined,
  opts?: Partial<TSConditionalType> | null
): node is TSConditionalType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSConditionalType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSInferType(
  node: Node | null | undefined,
  opts?: Partial<TSInferType> | null
): node is TSInferType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSInferType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSParenthesizedType(
  node: Node | null | undefined,
  opts?: Partial<TSParenthesizedType> | null
): node is TSParenthesizedType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSParenthesizedType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeOperator(
  node: Node | null | undefined,
  opts?: Partial<TSTypeOperator> | null
): node is TSTypeOperator {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeOperator") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSIndexedAccessType(
  node: Node | null | undefined,
  opts?: Partial<TSIndexedAccessType> | null
): node is TSIndexedAccessType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSIndexedAccessType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSMappedType(
  node: Node | null | undefined,
  opts?: Partial<TSMappedType> | null
): node is TSMappedType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSMappedType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSLiteralType(
  node: Node | null | undefined,
  opts?: Partial<TSLiteralType> | null
): node is TSLiteralType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSLiteralType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSExpressionWithTypeArguments(
  node: Node | null | undefined,
  opts?: Partial<TSExpressionWithTypeArguments> | null
): node is TSExpressionWithTypeArguments {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSExpressionWithTypeArguments") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSInterfaceDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSInterfaceDeclaration> | null
): node is TSInterfaceDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSInterfaceDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSInterfaceBody(
  node: Node | null | undefined,
  opts?: Partial<TSInterfaceBody> | null
): node is TSInterfaceBody {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSInterfaceBody") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeAliasDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAliasDeclaration> | null
): node is TSTypeAliasDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeAliasDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSAsExpression(
  node: Node | null | undefined,
  opts?: Partial<TSAsExpression> | null
): node is TSAsExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSAsExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeAssertion(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAssertion> | null
): node is TSTypeAssertion {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeAssertion") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSEnumDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSEnumDeclaration> | null
): node is TSEnumDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSEnumDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSEnumMember(
  node: Node | null | undefined,
  opts?: Partial<TSEnumMember> | null
): node is TSEnumMember {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSEnumMember") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSModuleDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSModuleDeclaration> | null
): node is TSModuleDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSModuleDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSModuleBlock(
  node: Node | null | undefined,
  opts?: Partial<TSModuleBlock> | null
): node is TSModuleBlock {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSModuleBlock") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSImportType(
  node: Node | null | undefined,
  opts?: Partial<TSImportType> | null
): node is TSImportType {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSImportType") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSImportEqualsDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSImportEqualsDeclaration> | null
): node is TSImportEqualsDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSImportEqualsDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSExternalModuleReference(
  node: Node | null | undefined,
  opts?: Partial<TSExternalModuleReference> | null
): node is TSExternalModuleReference {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSExternalModuleReference") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNonNullExpression(
  node: Node | null | undefined,
  opts?: Partial<TSNonNullExpression> | null
): node is TSNonNullExpression {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNonNullExpression") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSExportAssignment(
  node: Node | null | undefined,
  opts?: Partial<TSExportAssignment> | null
): node is TSExportAssignment {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSExportAssignment") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSNamespaceExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSNamespaceExportDeclaration> | null
): node is TSNamespaceExportDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSNamespaceExportDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAnnotation> | null
): node is TSTypeAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeAnnotation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeParameterInstantiation(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameterInstantiation> | null
): node is TSTypeParameterInstantiation {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeParameterInstantiation") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeParameterDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameterDeclaration> | null
): node is TSTypeParameterDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeParameterDeclaration") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeParameter(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameter> | null
): node is TSTypeParameter {
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "TSTypeParameter") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExpression(
  node: Node | null | undefined,
  opts?: Partial<Expression> | null
): node is Expression {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Expression" ||
    "ArrayExpression" === nodeType ||
    "AssignmentExpression" === nodeType ||
    "BinaryExpression" === nodeType ||
    "CallExpression" === nodeType ||
    "ConditionalExpression" === nodeType ||
    "FunctionExpression" === nodeType ||
    "Identifier" === nodeType ||
    "StringLiteral" === nodeType ||
    "NumericLiteral" === nodeType ||
    "NullLiteral" === nodeType ||
    "BooleanLiteral" === nodeType ||
    "RegExpLiteral" === nodeType ||
    "LogicalExpression" === nodeType ||
    "MemberExpression" === nodeType ||
    "NewExpression" === nodeType ||
    "ObjectExpression" === nodeType ||
    "SequenceExpression" === nodeType ||
    "ParenthesizedExpression" === nodeType ||
    "ThisExpression" === nodeType ||
    "UnaryExpression" === nodeType ||
    "UpdateExpression" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ClassExpression" === nodeType ||
    "MetaProperty" === nodeType ||
    "Super" === nodeType ||
    "TaggedTemplateExpression" === nodeType ||
    "TemplateLiteral" === nodeType ||
    "YieldExpression" === nodeType ||
    "AwaitExpression" === nodeType ||
    "Import" === nodeType ||
    "BigIntLiteral" === nodeType ||
    "OptionalMemberExpression" === nodeType ||
    "OptionalCallExpression" === nodeType ||
    "TypeCastExpression" === nodeType ||
    "JSXElement" === nodeType ||
    "JSXFragment" === nodeType ||
    "BindExpression" === nodeType ||
    "PipelinePrimaryTopicReference" === nodeType ||
    "DoExpression" === nodeType ||
    "RecordExpression" === nodeType ||
    "TupleExpression" === nodeType ||
    "DecimalLiteral" === nodeType ||
    "TSAsExpression" === nodeType ||
    "TSTypeAssertion" === nodeType ||
    "TSNonNullExpression" === nodeType ||
    (isPlaceholder(node) &&
      ("Expression" === node.expectedNode ||
        "Identifier" === node.expectedNode ||
        "StringLiteral" === node.expectedNode))
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBinary(
  node: Node | null | undefined,
  opts?: Partial<Binary> | null
): node is Binary {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Binary" ||
    "BinaryExpression" === nodeType ||
    "LogicalExpression" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isScopable(
  node: Node | null | undefined,
  opts?: Partial<Scopable> | null
): node is Scopable {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Scopable" ||
    "BlockStatement" === nodeType ||
    "CatchClause" === nodeType ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "Program" === nodeType ||
    "ObjectMethod" === nodeType ||
    "SwitchStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ClassExpression" === nodeType ||
    "ClassDeclaration" === nodeType ||
    "ForOfStatement" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType ||
    "TSModuleBlock" === nodeType ||
    (isPlaceholder(node) && "BlockStatement" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBlockParent(
  node: Node | null | undefined,
  opts?: Partial<BlockParent> | null
): node is BlockParent {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "BlockParent" ||
    "BlockStatement" === nodeType ||
    "CatchClause" === nodeType ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "Program" === nodeType ||
    "ObjectMethod" === nodeType ||
    "SwitchStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ForOfStatement" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType ||
    "TSModuleBlock" === nodeType ||
    (isPlaceholder(node) && "BlockStatement" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isBlock(
  node: Node | null | undefined,
  opts?: Partial<Block> | null
): node is Block {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Block" ||
    "BlockStatement" === nodeType ||
    "Program" === nodeType ||
    "TSModuleBlock" === nodeType ||
    (isPlaceholder(node) && "BlockStatement" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isStatement(
  node: Node | null | undefined,
  opts?: Partial<Statement> | null
): node is Statement {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Statement" ||
    "BlockStatement" === nodeType ||
    "BreakStatement" === nodeType ||
    "ContinueStatement" === nodeType ||
    "DebuggerStatement" === nodeType ||
    "DoWhileStatement" === nodeType ||
    "EmptyStatement" === nodeType ||
    "ExpressionStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "FunctionDeclaration" === nodeType ||
    "IfStatement" === nodeType ||
    "LabeledStatement" === nodeType ||
    "ReturnStatement" === nodeType ||
    "SwitchStatement" === nodeType ||
    "ThrowStatement" === nodeType ||
    "TryStatement" === nodeType ||
    "VariableDeclaration" === nodeType ||
    "WhileStatement" === nodeType ||
    "WithStatement" === nodeType ||
    "ClassDeclaration" === nodeType ||
    "ExportAllDeclaration" === nodeType ||
    "ExportDefaultDeclaration" === nodeType ||
    "ExportNamedDeclaration" === nodeType ||
    "ForOfStatement" === nodeType ||
    "ImportDeclaration" === nodeType ||
    "DeclareClass" === nodeType ||
    "DeclareFunction" === nodeType ||
    "DeclareInterface" === nodeType ||
    "DeclareModule" === nodeType ||
    "DeclareModuleExports" === nodeType ||
    "DeclareTypeAlias" === nodeType ||
    "DeclareOpaqueType" === nodeType ||
    "DeclareVariable" === nodeType ||
    "DeclareExportDeclaration" === nodeType ||
    "DeclareExportAllDeclaration" === nodeType ||
    "InterfaceDeclaration" === nodeType ||
    "OpaqueType" === nodeType ||
    "TypeAlias" === nodeType ||
    "EnumDeclaration" === nodeType ||
    "TSDeclareFunction" === nodeType ||
    "TSInterfaceDeclaration" === nodeType ||
    "TSTypeAliasDeclaration" === nodeType ||
    "TSEnumDeclaration" === nodeType ||
    "TSModuleDeclaration" === nodeType ||
    "TSImportEqualsDeclaration" === nodeType ||
    "TSExportAssignment" === nodeType ||
    "TSNamespaceExportDeclaration" === nodeType ||
    (isPlaceholder(node) &&
      ("Statement" === node.expectedNode ||
        "Declaration" === node.expectedNode ||
        "BlockStatement" === node.expectedNode))
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTerminatorless(
  node: Node | null | undefined,
  opts?: Partial<Terminatorless> | null
): node is Terminatorless {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Terminatorless" ||
    "BreakStatement" === nodeType ||
    "ContinueStatement" === nodeType ||
    "ReturnStatement" === nodeType ||
    "ThrowStatement" === nodeType ||
    "YieldExpression" === nodeType ||
    "AwaitExpression" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isCompletionStatement(
  node: Node | null | undefined,
  opts?: Partial<CompletionStatement> | null
): node is CompletionStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "CompletionStatement" ||
    "BreakStatement" === nodeType ||
    "ContinueStatement" === nodeType ||
    "ReturnStatement" === nodeType ||
    "ThrowStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isConditional(
  node: Node | null | undefined,
  opts?: Partial<Conditional> | null
): node is Conditional {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Conditional" ||
    "ConditionalExpression" === nodeType ||
    "IfStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isLoop(
  node: Node | null | undefined,
  opts?: Partial<Loop> | null
): node is Loop {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Loop" ||
    "DoWhileStatement" === nodeType ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "WhileStatement" === nodeType ||
    "ForOfStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isWhile(
  node: Node | null | undefined,
  opts?: Partial<While> | null
): node is While {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "While" ||
    "DoWhileStatement" === nodeType ||
    "WhileStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExpressionWrapper(
  node: Node | null | undefined,
  opts?: Partial<ExpressionWrapper> | null
): node is ExpressionWrapper {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ExpressionWrapper" ||
    "ExpressionStatement" === nodeType ||
    "ParenthesizedExpression" === nodeType ||
    "TypeCastExpression" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFor(
  node: Node | null | undefined,
  opts?: Partial<For> | null
): node is For {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "For" ||
    "ForInStatement" === nodeType ||
    "ForStatement" === nodeType ||
    "ForOfStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isForXStatement(
  node: Node | null | undefined,
  opts?: Partial<ForXStatement> | null
): node is ForXStatement {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ForXStatement" ||
    "ForInStatement" === nodeType ||
    "ForOfStatement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunction(
  node: Node | null | undefined,
  opts?: Record<string, unknown> | null
  // eslint-disable-next-line @typescript-eslint/ban-types
): node is Function {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Function" ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "ObjectMethod" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFunctionParent(
  node: Node | null | undefined,
  opts?: Partial<FunctionParent> | null
): node is FunctionParent {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "FunctionParent" ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "ObjectMethod" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPureish(
  node: Node | null | undefined,
  opts?: Partial<Pureish> | null
): node is Pureish {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Pureish" ||
    "FunctionDeclaration" === nodeType ||
    "FunctionExpression" === nodeType ||
    "StringLiteral" === nodeType ||
    "NumericLiteral" === nodeType ||
    "NullLiteral" === nodeType ||
    "BooleanLiteral" === nodeType ||
    "RegExpLiteral" === nodeType ||
    "ArrowFunctionExpression" === nodeType ||
    "BigIntLiteral" === nodeType ||
    "DecimalLiteral" === nodeType ||
    (isPlaceholder(node) && "StringLiteral" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isDeclaration(
  node: Node | null | undefined,
  opts?: Partial<Declaration> | null
): node is Declaration {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Declaration" ||
    "FunctionDeclaration" === nodeType ||
    "VariableDeclaration" === nodeType ||
    "ClassDeclaration" === nodeType ||
    "ExportAllDeclaration" === nodeType ||
    "ExportDefaultDeclaration" === nodeType ||
    "ExportNamedDeclaration" === nodeType ||
    "ImportDeclaration" === nodeType ||
    "DeclareClass" === nodeType ||
    "DeclareFunction" === nodeType ||
    "DeclareInterface" === nodeType ||
    "DeclareModule" === nodeType ||
    "DeclareModuleExports" === nodeType ||
    "DeclareTypeAlias" === nodeType ||
    "DeclareOpaqueType" === nodeType ||
    "DeclareVariable" === nodeType ||
    "DeclareExportDeclaration" === nodeType ||
    "DeclareExportAllDeclaration" === nodeType ||
    "InterfaceDeclaration" === nodeType ||
    "OpaqueType" === nodeType ||
    "TypeAlias" === nodeType ||
    "EnumDeclaration" === nodeType ||
    "TSDeclareFunction" === nodeType ||
    "TSInterfaceDeclaration" === nodeType ||
    "TSTypeAliasDeclaration" === nodeType ||
    "TSEnumDeclaration" === nodeType ||
    "TSModuleDeclaration" === nodeType ||
    (isPlaceholder(node) && "Declaration" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPatternLike(
  node: Node | null | undefined,
  opts?: Partial<PatternLike> | null
): node is PatternLike {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "PatternLike" ||
    "Identifier" === nodeType ||
    "RestElement" === nodeType ||
    "AssignmentPattern" === nodeType ||
    "ArrayPattern" === nodeType ||
    "ObjectPattern" === nodeType ||
    (isPlaceholder(node) &&
      ("Pattern" === node.expectedNode || "Identifier" === node.expectedNode))
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isLVal(
  node: Node | null | undefined,
  opts?: Partial<LVal> | null
): node is LVal {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "LVal" ||
    "Identifier" === nodeType ||
    "MemberExpression" === nodeType ||
    "RestElement" === nodeType ||
    "AssignmentPattern" === nodeType ||
    "ArrayPattern" === nodeType ||
    "ObjectPattern" === nodeType ||
    "TSParameterProperty" === nodeType ||
    (isPlaceholder(node) &&
      ("Pattern" === node.expectedNode || "Identifier" === node.expectedNode))
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSEntityName(
  node: Node | null | undefined,
  opts?: Partial<TSEntityName> | null
): node is TSEntityName {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "TSEntityName" ||
    "Identifier" === nodeType ||
    "TSQualifiedName" === nodeType ||
    (isPlaceholder(node) && "Identifier" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isLiteral(
  node: Node | null | undefined,
  opts?: Partial<Literal> | null
): node is Literal {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Literal" ||
    "StringLiteral" === nodeType ||
    "NumericLiteral" === nodeType ||
    "NullLiteral" === nodeType ||
    "BooleanLiteral" === nodeType ||
    "RegExpLiteral" === nodeType ||
    "TemplateLiteral" === nodeType ||
    "BigIntLiteral" === nodeType ||
    "DecimalLiteral" === nodeType ||
    (isPlaceholder(node) && "StringLiteral" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isImmutable(
  node: Node | null | undefined,
  opts?: Partial<Immutable> | null
): node is Immutable {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Immutable" ||
    "StringLiteral" === nodeType ||
    "NumericLiteral" === nodeType ||
    "NullLiteral" === nodeType ||
    "BooleanLiteral" === nodeType ||
    "BigIntLiteral" === nodeType ||
    "JSXAttribute" === nodeType ||
    "JSXClosingElement" === nodeType ||
    "JSXElement" === nodeType ||
    "JSXExpressionContainer" === nodeType ||
    "JSXSpreadChild" === nodeType ||
    "JSXOpeningElement" === nodeType ||
    "JSXText" === nodeType ||
    "JSXFragment" === nodeType ||
    "JSXOpeningFragment" === nodeType ||
    "JSXClosingFragment" === nodeType ||
    "DecimalLiteral" === nodeType ||
    (isPlaceholder(node) && "StringLiteral" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isUserWhitespacable(
  node: Node | null | undefined,
  opts?: Partial<UserWhitespacable> | null
): node is UserWhitespacable {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "UserWhitespacable" ||
    "ObjectMethod" === nodeType ||
    "ObjectProperty" === nodeType ||
    "ObjectTypeInternalSlot" === nodeType ||
    "ObjectTypeCallProperty" === nodeType ||
    "ObjectTypeIndexer" === nodeType ||
    "ObjectTypeProperty" === nodeType ||
    "ObjectTypeSpreadProperty" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isMethod(
  node: Node | null | undefined,
  opts?: Partial<Method> | null
): node is Method {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Method" ||
    "ObjectMethod" === nodeType ||
    "ClassMethod" === nodeType ||
    "ClassPrivateMethod" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isObjectMember(
  node: Node | null | undefined,
  opts?: Partial<ObjectMember> | null
): node is ObjectMember {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ObjectMember" ||
    "ObjectMethod" === nodeType ||
    "ObjectProperty" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isProperty(
  node: Node | null | undefined,
  opts?: Partial<Property> | null
): node is Property {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Property" ||
    "ObjectProperty" === nodeType ||
    "ClassProperty" === nodeType ||
    "ClassPrivateProperty" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isUnaryLike(
  node: Node | null | undefined,
  opts?: Partial<UnaryLike> | null
): node is UnaryLike {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "UnaryLike" ||
    "UnaryExpression" === nodeType ||
    "SpreadElement" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPattern(
  node: Node | null | undefined,
  opts?: Partial<Pattern> | null
): node is Pattern {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Pattern" ||
    "AssignmentPattern" === nodeType ||
    "ArrayPattern" === nodeType ||
    "ObjectPattern" === nodeType ||
    (isPlaceholder(node) && "Pattern" === node.expectedNode)
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isClass(
  node: Node | null | undefined,
  opts?: Partial<Class> | null
): node is Class {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Class" ||
    "ClassExpression" === nodeType ||
    "ClassDeclaration" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isModuleDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ModuleDeclaration> | null
): node is ModuleDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ModuleDeclaration" ||
    "ExportAllDeclaration" === nodeType ||
    "ExportDefaultDeclaration" === nodeType ||
    "ExportNamedDeclaration" === nodeType ||
    "ImportDeclaration" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportDeclaration> | null
): node is ExportDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ExportDeclaration" ||
    "ExportAllDeclaration" === nodeType ||
    "ExportDefaultDeclaration" === nodeType ||
    "ExportNamedDeclaration" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isModuleSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ModuleSpecifier> | null
): node is ModuleSpecifier {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "ModuleSpecifier" ||
    "ExportSpecifier" === nodeType ||
    "ImportDefaultSpecifier" === nodeType ||
    "ImportNamespaceSpecifier" === nodeType ||
    "ImportSpecifier" === nodeType ||
    "ExportNamespaceSpecifier" === nodeType ||
    "ExportDefaultSpecifier" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFlow(
  node: Node | null | undefined,
  opts?: Partial<Flow> | null
): node is Flow {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Flow" ||
    "AnyTypeAnnotation" === nodeType ||
    "ArrayTypeAnnotation" === nodeType ||
    "BooleanTypeAnnotation" === nodeType ||
    "BooleanLiteralTypeAnnotation" === nodeType ||
    "NullLiteralTypeAnnotation" === nodeType ||
    "ClassImplements" === nodeType ||
    "DeclareClass" === nodeType ||
    "DeclareFunction" === nodeType ||
    "DeclareInterface" === nodeType ||
    "DeclareModule" === nodeType ||
    "DeclareModuleExports" === nodeType ||
    "DeclareTypeAlias" === nodeType ||
    "DeclareOpaqueType" === nodeType ||
    "DeclareVariable" === nodeType ||
    "DeclareExportDeclaration" === nodeType ||
    "DeclareExportAllDeclaration" === nodeType ||
    "DeclaredPredicate" === nodeType ||
    "ExistsTypeAnnotation" === nodeType ||
    "FunctionTypeAnnotation" === nodeType ||
    "FunctionTypeParam" === nodeType ||
    "GenericTypeAnnotation" === nodeType ||
    "InferredPredicate" === nodeType ||
    "InterfaceExtends" === nodeType ||
    "InterfaceDeclaration" === nodeType ||
    "InterfaceTypeAnnotation" === nodeType ||
    "IntersectionTypeAnnotation" === nodeType ||
    "MixedTypeAnnotation" === nodeType ||
    "EmptyTypeAnnotation" === nodeType ||
    "NullableTypeAnnotation" === nodeType ||
    "NumberLiteralTypeAnnotation" === nodeType ||
    "NumberTypeAnnotation" === nodeType ||
    "ObjectTypeAnnotation" === nodeType ||
    "ObjectTypeInternalSlot" === nodeType ||
    "ObjectTypeCallProperty" === nodeType ||
    "ObjectTypeIndexer" === nodeType ||
    "ObjectTypeProperty" === nodeType ||
    "ObjectTypeSpreadProperty" === nodeType ||
    "OpaqueType" === nodeType ||
    "QualifiedTypeIdentifier" === nodeType ||
    "StringLiteralTypeAnnotation" === nodeType ||
    "StringTypeAnnotation" === nodeType ||
    "SymbolTypeAnnotation" === nodeType ||
    "ThisTypeAnnotation" === nodeType ||
    "TupleTypeAnnotation" === nodeType ||
    "TypeofTypeAnnotation" === nodeType ||
    "TypeAlias" === nodeType ||
    "TypeAnnotation" === nodeType ||
    "TypeCastExpression" === nodeType ||
    "TypeParameter" === nodeType ||
    "TypeParameterDeclaration" === nodeType ||
    "TypeParameterInstantiation" === nodeType ||
    "UnionTypeAnnotation" === nodeType ||
    "Variance" === nodeType ||
    "VoidTypeAnnotation" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFlowType(
  node: Node | null | undefined,
  opts?: Partial<FlowType> | null
): node is FlowType {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "FlowType" ||
    "AnyTypeAnnotation" === nodeType ||
    "ArrayTypeAnnotation" === nodeType ||
    "BooleanTypeAnnotation" === nodeType ||
    "BooleanLiteralTypeAnnotation" === nodeType ||
    "NullLiteralTypeAnnotation" === nodeType ||
    "ExistsTypeAnnotation" === nodeType ||
    "FunctionTypeAnnotation" === nodeType ||
    "GenericTypeAnnotation" === nodeType ||
    "InterfaceTypeAnnotation" === nodeType ||
    "IntersectionTypeAnnotation" === nodeType ||
    "MixedTypeAnnotation" === nodeType ||
    "EmptyTypeAnnotation" === nodeType ||
    "NullableTypeAnnotation" === nodeType ||
    "NumberLiteralTypeAnnotation" === nodeType ||
    "NumberTypeAnnotation" === nodeType ||
    "ObjectTypeAnnotation" === nodeType ||
    "StringLiteralTypeAnnotation" === nodeType ||
    "StringTypeAnnotation" === nodeType ||
    "SymbolTypeAnnotation" === nodeType ||
    "ThisTypeAnnotation" === nodeType ||
    "TupleTypeAnnotation" === nodeType ||
    "TypeofTypeAnnotation" === nodeType ||
    "UnionTypeAnnotation" === nodeType ||
    "VoidTypeAnnotation" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFlowBaseAnnotation(
  node: Node | null | undefined,
  opts?: Partial<FlowBaseAnnotation> | null
): node is FlowBaseAnnotation {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "FlowBaseAnnotation" ||
    "AnyTypeAnnotation" === nodeType ||
    "BooleanTypeAnnotation" === nodeType ||
    "NullLiteralTypeAnnotation" === nodeType ||
    "MixedTypeAnnotation" === nodeType ||
    "EmptyTypeAnnotation" === nodeType ||
    "NumberTypeAnnotation" === nodeType ||
    "StringTypeAnnotation" === nodeType ||
    "SymbolTypeAnnotation" === nodeType ||
    "ThisTypeAnnotation" === nodeType ||
    "VoidTypeAnnotation" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFlowDeclaration(
  node: Node | null | undefined,
  opts?: Partial<FlowDeclaration> | null
): node is FlowDeclaration {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "FlowDeclaration" ||
    "DeclareClass" === nodeType ||
    "DeclareFunction" === nodeType ||
    "DeclareInterface" === nodeType ||
    "DeclareModule" === nodeType ||
    "DeclareModuleExports" === nodeType ||
    "DeclareTypeAlias" === nodeType ||
    "DeclareOpaqueType" === nodeType ||
    "DeclareVariable" === nodeType ||
    "DeclareExportDeclaration" === nodeType ||
    "DeclareExportAllDeclaration" === nodeType ||
    "InterfaceDeclaration" === nodeType ||
    "OpaqueType" === nodeType ||
    "TypeAlias" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isFlowPredicate(
  node: Node | null | undefined,
  opts?: Partial<FlowPredicate> | null
): node is FlowPredicate {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "FlowPredicate" ||
    "DeclaredPredicate" === nodeType ||
    "InferredPredicate" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumBody(
  node: Node | null | undefined,
  opts?: Partial<EnumBody> | null
): node is EnumBody {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "EnumBody" ||
    "EnumBooleanBody" === nodeType ||
    "EnumNumberBody" === nodeType ||
    "EnumStringBody" === nodeType ||
    "EnumSymbolBody" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isEnumMember(
  node: Node | null | undefined,
  opts?: Partial<EnumMember> | null
): node is EnumMember {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "EnumMember" ||
    "EnumBooleanMember" === nodeType ||
    "EnumNumberMember" === nodeType ||
    "EnumStringMember" === nodeType ||
    "EnumDefaultedMember" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isJSX(
  node: Node | null | undefined,
  opts?: Partial<JSX> | null
): node is JSX {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "JSX" ||
    "JSXAttribute" === nodeType ||
    "JSXClosingElement" === nodeType ||
    "JSXElement" === nodeType ||
    "JSXEmptyExpression" === nodeType ||
    "JSXExpressionContainer" === nodeType ||
    "JSXSpreadChild" === nodeType ||
    "JSXIdentifier" === nodeType ||
    "JSXMemberExpression" === nodeType ||
    "JSXNamespacedName" === nodeType ||
    "JSXOpeningElement" === nodeType ||
    "JSXSpreadAttribute" === nodeType ||
    "JSXText" === nodeType ||
    "JSXFragment" === nodeType ||
    "JSXOpeningFragment" === nodeType ||
    "JSXClosingFragment" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isPrivate(
  node: Node | null | undefined,
  opts?: Partial<Private> | null
): node is Private {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "Private" ||
    "ClassPrivateProperty" === nodeType ||
    "ClassPrivateMethod" === nodeType ||
    "PrivateName" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSTypeElement(
  node: Node | null | undefined,
  opts?: Partial<TSTypeElement> | null
): node is TSTypeElement {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "TSTypeElement" ||
    "TSCallSignatureDeclaration" === nodeType ||
    "TSConstructSignatureDeclaration" === nodeType ||
    "TSPropertySignature" === nodeType ||
    "TSMethodSignature" === nodeType ||
    "TSIndexSignature" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSType(
  node: Node | null | undefined,
  opts?: Partial<TSType> | null
): node is TSType {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "TSType" ||
    "TSAnyKeyword" === nodeType ||
    "TSBooleanKeyword" === nodeType ||
    "TSBigIntKeyword" === nodeType ||
    "TSNeverKeyword" === nodeType ||
    "TSNullKeyword" === nodeType ||
    "TSNumberKeyword" === nodeType ||
    "TSObjectKeyword" === nodeType ||
    "TSStringKeyword" === nodeType ||
    "TSSymbolKeyword" === nodeType ||
    "TSUndefinedKeyword" === nodeType ||
    "TSUnknownKeyword" === nodeType ||
    "TSVoidKeyword" === nodeType ||
    "TSThisType" === nodeType ||
    "TSFunctionType" === nodeType ||
    "TSConstructorType" === nodeType ||
    "TSTypeReference" === nodeType ||
    "TSTypePredicate" === nodeType ||
    "TSTypeQuery" === nodeType ||
    "TSTypeLiteral" === nodeType ||
    "TSArrayType" === nodeType ||
    "TSTupleType" === nodeType ||
    "TSOptionalType" === nodeType ||
    "TSRestType" === nodeType ||
    "TSUnionType" === nodeType ||
    "TSIntersectionType" === nodeType ||
    "TSConditionalType" === nodeType ||
    "TSInferType" === nodeType ||
    "TSParenthesizedType" === nodeType ||
    "TSTypeOperator" === nodeType ||
    "TSIndexedAccessType" === nodeType ||
    "TSMappedType" === nodeType ||
    "TSLiteralType" === nodeType ||
    "TSExpressionWithTypeArguments" === nodeType ||
    "TSImportType" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isTSBaseType(
  node: Node | null | undefined,
  opts?: Partial<TSBaseType> | null
): node is TSBaseType {
  if (!node) return false;

  const nodeType = node.type;
  if (
    // nodeType === "TSBaseType" ||
    "TSAnyKeyword" === nodeType ||
    "TSBooleanKeyword" === nodeType ||
    "TSBigIntKeyword" === nodeType ||
    "TSNeverKeyword" === nodeType ||
    "TSNullKeyword" === nodeType ||
    "TSNumberKeyword" === nodeType ||
    "TSObjectKeyword" === nodeType ||
    "TSStringKeyword" === nodeType ||
    "TSSymbolKeyword" === nodeType ||
    "TSUndefinedKeyword" === nodeType ||
    "TSUnknownKeyword" === nodeType ||
    "TSVoidKeyword" === nodeType ||
    "TSThisType" === nodeType ||
    "TSLiteralType" === nodeType
  ) {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isNumberLiteral(
  node: Node | null | undefined,
  opts?: Partial<NumberLiteral> | null
): node is NumberLiteral {
  console.trace(
    "The node type NumberLiteral has been renamed to NumericLiteral"
  );
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "NumericLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isRegexLiteral(
  node: Node | null | undefined,
  opts?: Partial<RegexLiteral> | null
): node is RegexLiteral {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "RegExpLiteral") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isRestProperty(
  node: Node | null | undefined,
  opts?: Partial<RestProperty> | null
): node is RestProperty {
  console.trace("The node type RestProperty has been renamed to RestElement");
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "RestElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
export function isSpreadProperty(
  node: Node | null | undefined,
  opts?: Partial<SpreadProperty> | null
): node is SpreadProperty {
  console.trace(
    "The node type SpreadProperty has been renamed to SpreadElement"
  );
  if (!node) return false;

  const nodeType = node.type;
  if (nodeType === "SpreadElement") {
    if (typeof opts === "undefined") {
      return true;
    } else {
      return shallowEqual(node, opts);
    }
  }

  return false;
}
