/* eslint-disable @typescript-eslint/ban-types */
/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import is from "../../validators/is";
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
  Aliases,
} from "../../types";

function assert(
  type: Node["type"] | keyof Aliases,
  node: Node | { type: string } | null | undefined,
  opts?: Partial<Node>
): void {
  if (!is(type, node, opts)) {
    throw new Error(
      `Expected type "${type}" with option ${JSON.stringify(opts)}, ` +
        `but instead got "${node.type}".`
    );
  }
}

export function assertArrayExpression(
  node: Node | null | undefined,
  opts?: Partial<ArrayExpression>
): asserts node is ArrayExpression {
  assert("ArrayExpression", node, opts);
}
export function assertAssignmentExpression(
  node: Node | null | undefined,
  opts?: Partial<AssignmentExpression>
): asserts node is AssignmentExpression {
  assert("AssignmentExpression", node, opts);
}
export function assertBinaryExpression(
  node: Node | null | undefined,
  opts?: Partial<BinaryExpression>
): asserts node is BinaryExpression {
  assert("BinaryExpression", node, opts);
}
export function assertInterpreterDirective(
  node: Node | null | undefined,
  opts?: Partial<InterpreterDirective>
): asserts node is InterpreterDirective {
  assert("InterpreterDirective", node, opts);
}
export function assertDirective(
  node: Node | null | undefined,
  opts?: Partial<Directive>
): asserts node is Directive {
  assert("Directive", node, opts);
}
export function assertDirectiveLiteral(
  node: Node | null | undefined,
  opts?: Partial<DirectiveLiteral>
): asserts node is DirectiveLiteral {
  assert("DirectiveLiteral", node, opts);
}
export function assertBlockStatement(
  node: Node | null | undefined,
  opts?: Partial<BlockStatement>
): asserts node is BlockStatement {
  assert("BlockStatement", node, opts);
}
export function assertBreakStatement(
  node: Node | null | undefined,
  opts?: Partial<BreakStatement>
): asserts node is BreakStatement {
  assert("BreakStatement", node, opts);
}
export function assertCallExpression(
  node: Node | null | undefined,
  opts?: Partial<CallExpression>
): asserts node is CallExpression {
  assert("CallExpression", node, opts);
}
export function assertCatchClause(
  node: Node | null | undefined,
  opts?: Partial<CatchClause>
): asserts node is CatchClause {
  assert("CatchClause", node, opts);
}
export function assertConditionalExpression(
  node: Node | null | undefined,
  opts?: Partial<ConditionalExpression>
): asserts node is ConditionalExpression {
  assert("ConditionalExpression", node, opts);
}
export function assertContinueStatement(
  node: Node | null | undefined,
  opts?: Partial<ContinueStatement>
): asserts node is ContinueStatement {
  assert("ContinueStatement", node, opts);
}
export function assertDebuggerStatement(
  node: Node | null | undefined,
  opts?: Partial<DebuggerStatement>
): asserts node is DebuggerStatement {
  assert("DebuggerStatement", node, opts);
}
export function assertDoWhileStatement(
  node: Node | null | undefined,
  opts?: Partial<DoWhileStatement>
): asserts node is DoWhileStatement {
  assert("DoWhileStatement", node, opts);
}
export function assertEmptyStatement(
  node: Node | null | undefined,
  opts?: Partial<EmptyStatement>
): asserts node is EmptyStatement {
  assert("EmptyStatement", node, opts);
}
export function assertExpressionStatement(
  node: Node | null | undefined,
  opts?: Partial<ExpressionStatement>
): asserts node is ExpressionStatement {
  assert("ExpressionStatement", node, opts);
}
export function assertFile(
  node: Node | null | undefined,
  opts?: Partial<File>
): asserts node is File {
  assert("File", node, opts);
}
export function assertForInStatement(
  node: Node | null | undefined,
  opts?: Partial<ForInStatement>
): asserts node is ForInStatement {
  assert("ForInStatement", node, opts);
}
export function assertForStatement(
  node: Node | null | undefined,
  opts?: Partial<ForStatement>
): asserts node is ForStatement {
  assert("ForStatement", node, opts);
}
export function assertFunctionDeclaration(
  node: Node | null | undefined,
  opts?: Partial<FunctionDeclaration>
): asserts node is FunctionDeclaration {
  assert("FunctionDeclaration", node, opts);
}
export function assertFunctionExpression(
  node: Node | null | undefined,
  opts?: Partial<FunctionExpression>
): asserts node is FunctionExpression {
  assert("FunctionExpression", node, opts);
}
export function assertIdentifier(
  node: Node | null | undefined,
  opts?: Partial<Identifier>
): asserts node is Identifier {
  assert("Identifier", node, opts);
}
export function assertIfStatement(
  node: Node | null | undefined,
  opts?: Partial<IfStatement>
): asserts node is IfStatement {
  assert("IfStatement", node, opts);
}
export function assertLabeledStatement(
  node: Node | null | undefined,
  opts?: Partial<LabeledStatement>
): asserts node is LabeledStatement {
  assert("LabeledStatement", node, opts);
}
export function assertStringLiteral(
  node: Node | null | undefined,
  opts?: Partial<StringLiteral>
): asserts node is StringLiteral {
  assert("StringLiteral", node, opts);
}
export function assertNumericLiteral(
  node: Node | null | undefined,
  opts?: Partial<NumericLiteral>
): asserts node is NumericLiteral {
  assert("NumericLiteral", node, opts);
}
export function assertNullLiteral(
  node: Node | null | undefined,
  opts?: Partial<NullLiteral>
): asserts node is NullLiteral {
  assert("NullLiteral", node, opts);
}
export function assertBooleanLiteral(
  node: Node | null | undefined,
  opts?: Partial<BooleanLiteral>
): asserts node is BooleanLiteral {
  assert("BooleanLiteral", node, opts);
}
export function assertRegExpLiteral(
  node: Node | null | undefined,
  opts?: Partial<RegExpLiteral>
): asserts node is RegExpLiteral {
  assert("RegExpLiteral", node, opts);
}
export function assertLogicalExpression(
  node: Node | null | undefined,
  opts?: Partial<LogicalExpression>
): asserts node is LogicalExpression {
  assert("LogicalExpression", node, opts);
}
export function assertMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<MemberExpression>
): asserts node is MemberExpression {
  assert("MemberExpression", node, opts);
}
export function assertNewExpression(
  node: Node | null | undefined,
  opts?: Partial<NewExpression>
): asserts node is NewExpression {
  assert("NewExpression", node, opts);
}
export function assertProgram(
  node: Node | null | undefined,
  opts?: Partial<Program>
): asserts node is Program {
  assert("Program", node, opts);
}
export function assertObjectExpression(
  node: Node | null | undefined,
  opts?: Partial<ObjectExpression>
): asserts node is ObjectExpression {
  assert("ObjectExpression", node, opts);
}
export function assertObjectMethod(
  node: Node | null | undefined,
  opts?: Partial<ObjectMethod>
): asserts node is ObjectMethod {
  assert("ObjectMethod", node, opts);
}
export function assertObjectProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectProperty>
): asserts node is ObjectProperty {
  assert("ObjectProperty", node, opts);
}
export function assertRestElement(
  node: Node | null | undefined,
  opts?: Partial<RestElement>
): asserts node is RestElement {
  assert("RestElement", node, opts);
}
export function assertReturnStatement(
  node: Node | null | undefined,
  opts?: Partial<ReturnStatement>
): asserts node is ReturnStatement {
  assert("ReturnStatement", node, opts);
}
export function assertSequenceExpression(
  node: Node | null | undefined,
  opts?: Partial<SequenceExpression>
): asserts node is SequenceExpression {
  assert("SequenceExpression", node, opts);
}
export function assertParenthesizedExpression(
  node: Node | null | undefined,
  opts?: Partial<ParenthesizedExpression>
): asserts node is ParenthesizedExpression {
  assert("ParenthesizedExpression", node, opts);
}
export function assertSwitchCase(
  node: Node | null | undefined,
  opts?: Partial<SwitchCase>
): asserts node is SwitchCase {
  assert("SwitchCase", node, opts);
}
export function assertSwitchStatement(
  node: Node | null | undefined,
  opts?: Partial<SwitchStatement>
): asserts node is SwitchStatement {
  assert("SwitchStatement", node, opts);
}
export function assertThisExpression(
  node: Node | null | undefined,
  opts?: Partial<ThisExpression>
): asserts node is ThisExpression {
  assert("ThisExpression", node, opts);
}
export function assertThrowStatement(
  node: Node | null | undefined,
  opts?: Partial<ThrowStatement>
): asserts node is ThrowStatement {
  assert("ThrowStatement", node, opts);
}
export function assertTryStatement(
  node: Node | null | undefined,
  opts?: Partial<TryStatement>
): asserts node is TryStatement {
  assert("TryStatement", node, opts);
}
export function assertUnaryExpression(
  node: Node | null | undefined,
  opts?: Partial<UnaryExpression>
): asserts node is UnaryExpression {
  assert("UnaryExpression", node, opts);
}
export function assertUpdateExpression(
  node: Node | null | undefined,
  opts?: Partial<UpdateExpression>
): asserts node is UpdateExpression {
  assert("UpdateExpression", node, opts);
}
export function assertVariableDeclaration(
  node: Node | null | undefined,
  opts?: Partial<VariableDeclaration>
): asserts node is VariableDeclaration {
  assert("VariableDeclaration", node, opts);
}
export function assertVariableDeclarator(
  node: Node | null | undefined,
  opts?: Partial<VariableDeclarator>
): asserts node is VariableDeclarator {
  assert("VariableDeclarator", node, opts);
}
export function assertWhileStatement(
  node: Node | null | undefined,
  opts?: Partial<WhileStatement>
): asserts node is WhileStatement {
  assert("WhileStatement", node, opts);
}
export function assertWithStatement(
  node: Node | null | undefined,
  opts?: Partial<WithStatement>
): asserts node is WithStatement {
  assert("WithStatement", node, opts);
}
export function assertAssignmentPattern(
  node: Node | null | undefined,
  opts?: Partial<AssignmentPattern>
): asserts node is AssignmentPattern {
  assert("AssignmentPattern", node, opts);
}
export function assertArrayPattern(
  node: Node | null | undefined,
  opts?: Partial<ArrayPattern>
): asserts node is ArrayPattern {
  assert("ArrayPattern", node, opts);
}
export function assertArrowFunctionExpression(
  node: Node | null | undefined,
  opts?: Partial<ArrowFunctionExpression>
): asserts node is ArrowFunctionExpression {
  assert("ArrowFunctionExpression", node, opts);
}
export function assertClassBody(
  node: Node | null | undefined,
  opts?: Partial<ClassBody>
): asserts node is ClassBody {
  assert("ClassBody", node, opts);
}
export function assertClassExpression(
  node: Node | null | undefined,
  opts?: Partial<ClassExpression>
): asserts node is ClassExpression {
  assert("ClassExpression", node, opts);
}
export function assertClassDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ClassDeclaration>
): asserts node is ClassDeclaration {
  assert("ClassDeclaration", node, opts);
}
export function assertExportAllDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportAllDeclaration>
): asserts node is ExportAllDeclaration {
  assert("ExportAllDeclaration", node, opts);
}
export function assertExportDefaultDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportDefaultDeclaration>
): asserts node is ExportDefaultDeclaration {
  assert("ExportDefaultDeclaration", node, opts);
}
export function assertExportNamedDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportNamedDeclaration>
): asserts node is ExportNamedDeclaration {
  assert("ExportNamedDeclaration", node, opts);
}
export function assertExportSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportSpecifier>
): asserts node is ExportSpecifier {
  assert("ExportSpecifier", node, opts);
}
export function assertForOfStatement(
  node: Node | null | undefined,
  opts?: Partial<ForOfStatement>
): asserts node is ForOfStatement {
  assert("ForOfStatement", node, opts);
}
export function assertImportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ImportDeclaration>
): asserts node is ImportDeclaration {
  assert("ImportDeclaration", node, opts);
}
export function assertImportDefaultSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportDefaultSpecifier>
): asserts node is ImportDefaultSpecifier {
  assert("ImportDefaultSpecifier", node, opts);
}
export function assertImportNamespaceSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportNamespaceSpecifier>
): asserts node is ImportNamespaceSpecifier {
  assert("ImportNamespaceSpecifier", node, opts);
}
export function assertImportSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ImportSpecifier>
): asserts node is ImportSpecifier {
  assert("ImportSpecifier", node, opts);
}
export function assertMetaProperty(
  node: Node | null | undefined,
  opts?: Partial<MetaProperty>
): asserts node is MetaProperty {
  assert("MetaProperty", node, opts);
}
export function assertClassMethod(
  node: Node | null | undefined,
  opts?: Partial<ClassMethod>
): asserts node is ClassMethod {
  assert("ClassMethod", node, opts);
}
export function assertObjectPattern(
  node: Node | null | undefined,
  opts?: Partial<ObjectPattern>
): asserts node is ObjectPattern {
  assert("ObjectPattern", node, opts);
}
export function assertSpreadElement(
  node: Node | null | undefined,
  opts?: Partial<SpreadElement>
): asserts node is SpreadElement {
  assert("SpreadElement", node, opts);
}
export function assertSuper(
  node: Node | null | undefined,
  opts?: Partial<Super>
): asserts node is Super {
  assert("Super", node, opts);
}
export function assertTaggedTemplateExpression(
  node: Node | null | undefined,
  opts?: Partial<TaggedTemplateExpression>
): asserts node is TaggedTemplateExpression {
  assert("TaggedTemplateExpression", node, opts);
}
export function assertTemplateElement(
  node: Node | null | undefined,
  opts?: Partial<TemplateElement>
): asserts node is TemplateElement {
  assert("TemplateElement", node, opts);
}
export function assertTemplateLiteral(
  node: Node | null | undefined,
  opts?: Partial<TemplateLiteral>
): asserts node is TemplateLiteral {
  assert("TemplateLiteral", node, opts);
}
export function assertYieldExpression(
  node: Node | null | undefined,
  opts?: Partial<YieldExpression>
): asserts node is YieldExpression {
  assert("YieldExpression", node, opts);
}
export function assertAwaitExpression(
  node: Node | null | undefined,
  opts?: Partial<AwaitExpression>
): asserts node is AwaitExpression {
  assert("AwaitExpression", node, opts);
}
export function assertImport(
  node: Node | null | undefined,
  opts?: Partial<Import>
): asserts node is Import {
  assert("Import", node, opts);
}
export function assertBigIntLiteral(
  node: Node | null | undefined,
  opts?: Partial<BigIntLiteral>
): asserts node is BigIntLiteral {
  assert("BigIntLiteral", node, opts);
}
export function assertExportNamespaceSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportNamespaceSpecifier>
): asserts node is ExportNamespaceSpecifier {
  assert("ExportNamespaceSpecifier", node, opts);
}
export function assertOptionalMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<OptionalMemberExpression>
): asserts node is OptionalMemberExpression {
  assert("OptionalMemberExpression", node, opts);
}
export function assertOptionalCallExpression(
  node: Node | null | undefined,
  opts?: Partial<OptionalCallExpression>
): asserts node is OptionalCallExpression {
  assert("OptionalCallExpression", node, opts);
}
export function assertAnyTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<AnyTypeAnnotation>
): asserts node is AnyTypeAnnotation {
  assert("AnyTypeAnnotation", node, opts);
}
export function assertArrayTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ArrayTypeAnnotation>
): asserts node is ArrayTypeAnnotation {
  assert("ArrayTypeAnnotation", node, opts);
}
export function assertBooleanTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<BooleanTypeAnnotation>
): asserts node is BooleanTypeAnnotation {
  assert("BooleanTypeAnnotation", node, opts);
}
export function assertBooleanLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<BooleanLiteralTypeAnnotation>
): asserts node is BooleanLiteralTypeAnnotation {
  assert("BooleanLiteralTypeAnnotation", node, opts);
}
export function assertNullLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NullLiteralTypeAnnotation>
): asserts node is NullLiteralTypeAnnotation {
  assert("NullLiteralTypeAnnotation", node, opts);
}
export function assertClassImplements(
  node: Node | null | undefined,
  opts?: Partial<ClassImplements>
): asserts node is ClassImplements {
  assert("ClassImplements", node, opts);
}
export function assertDeclareClass(
  node: Node | null | undefined,
  opts?: Partial<DeclareClass>
): asserts node is DeclareClass {
  assert("DeclareClass", node, opts);
}
export function assertDeclareFunction(
  node: Node | null | undefined,
  opts?: Partial<DeclareFunction>
): asserts node is DeclareFunction {
  assert("DeclareFunction", node, opts);
}
export function assertDeclareInterface(
  node: Node | null | undefined,
  opts?: Partial<DeclareInterface>
): asserts node is DeclareInterface {
  assert("DeclareInterface", node, opts);
}
export function assertDeclareModule(
  node: Node | null | undefined,
  opts?: Partial<DeclareModule>
): asserts node is DeclareModule {
  assert("DeclareModule", node, opts);
}
export function assertDeclareModuleExports(
  node: Node | null | undefined,
  opts?: Partial<DeclareModuleExports>
): asserts node is DeclareModuleExports {
  assert("DeclareModuleExports", node, opts);
}
export function assertDeclareTypeAlias(
  node: Node | null | undefined,
  opts?: Partial<DeclareTypeAlias>
): asserts node is DeclareTypeAlias {
  assert("DeclareTypeAlias", node, opts);
}
export function assertDeclareOpaqueType(
  node: Node | null | undefined,
  opts?: Partial<DeclareOpaqueType>
): asserts node is DeclareOpaqueType {
  assert("DeclareOpaqueType", node, opts);
}
export function assertDeclareVariable(
  node: Node | null | undefined,
  opts?: Partial<DeclareVariable>
): asserts node is DeclareVariable {
  assert("DeclareVariable", node, opts);
}
export function assertDeclareExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<DeclareExportDeclaration>
): asserts node is DeclareExportDeclaration {
  assert("DeclareExportDeclaration", node, opts);
}
export function assertDeclareExportAllDeclaration(
  node: Node | null | undefined,
  opts?: Partial<DeclareExportAllDeclaration>
): asserts node is DeclareExportAllDeclaration {
  assert("DeclareExportAllDeclaration", node, opts);
}
export function assertDeclaredPredicate(
  node: Node | null | undefined,
  opts?: Partial<DeclaredPredicate>
): asserts node is DeclaredPredicate {
  assert("DeclaredPredicate", node, opts);
}
export function assertExistsTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ExistsTypeAnnotation>
): asserts node is ExistsTypeAnnotation {
  assert("ExistsTypeAnnotation", node, opts);
}
export function assertFunctionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<FunctionTypeAnnotation>
): asserts node is FunctionTypeAnnotation {
  assert("FunctionTypeAnnotation", node, opts);
}
export function assertFunctionTypeParam(
  node: Node | null | undefined,
  opts?: Partial<FunctionTypeParam>
): asserts node is FunctionTypeParam {
  assert("FunctionTypeParam", node, opts);
}
export function assertGenericTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<GenericTypeAnnotation>
): asserts node is GenericTypeAnnotation {
  assert("GenericTypeAnnotation", node, opts);
}
export function assertInferredPredicate(
  node: Node | null | undefined,
  opts?: Partial<InferredPredicate>
): asserts node is InferredPredicate {
  assert("InferredPredicate", node, opts);
}
export function assertInterfaceExtends(
  node: Node | null | undefined,
  opts?: Partial<InterfaceExtends>
): asserts node is InterfaceExtends {
  assert("InterfaceExtends", node, opts);
}
export function assertInterfaceDeclaration(
  node: Node | null | undefined,
  opts?: Partial<InterfaceDeclaration>
): asserts node is InterfaceDeclaration {
  assert("InterfaceDeclaration", node, opts);
}
export function assertInterfaceTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<InterfaceTypeAnnotation>
): asserts node is InterfaceTypeAnnotation {
  assert("InterfaceTypeAnnotation", node, opts);
}
export function assertIntersectionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<IntersectionTypeAnnotation>
): asserts node is IntersectionTypeAnnotation {
  assert("IntersectionTypeAnnotation", node, opts);
}
export function assertMixedTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<MixedTypeAnnotation>
): asserts node is MixedTypeAnnotation {
  assert("MixedTypeAnnotation", node, opts);
}
export function assertEmptyTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<EmptyTypeAnnotation>
): asserts node is EmptyTypeAnnotation {
  assert("EmptyTypeAnnotation", node, opts);
}
export function assertNullableTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NullableTypeAnnotation>
): asserts node is NullableTypeAnnotation {
  assert("NullableTypeAnnotation", node, opts);
}
export function assertNumberLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NumberLiteralTypeAnnotation>
): asserts node is NumberLiteralTypeAnnotation {
  assert("NumberLiteralTypeAnnotation", node, opts);
}
export function assertNumberTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<NumberTypeAnnotation>
): asserts node is NumberTypeAnnotation {
  assert("NumberTypeAnnotation", node, opts);
}
export function assertObjectTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeAnnotation>
): asserts node is ObjectTypeAnnotation {
  assert("ObjectTypeAnnotation", node, opts);
}
export function assertObjectTypeInternalSlot(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeInternalSlot>
): asserts node is ObjectTypeInternalSlot {
  assert("ObjectTypeInternalSlot", node, opts);
}
export function assertObjectTypeCallProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeCallProperty>
): asserts node is ObjectTypeCallProperty {
  assert("ObjectTypeCallProperty", node, opts);
}
export function assertObjectTypeIndexer(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeIndexer>
): asserts node is ObjectTypeIndexer {
  assert("ObjectTypeIndexer", node, opts);
}
export function assertObjectTypeProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeProperty>
): asserts node is ObjectTypeProperty {
  assert("ObjectTypeProperty", node, opts);
}
export function assertObjectTypeSpreadProperty(
  node: Node | null | undefined,
  opts?: Partial<ObjectTypeSpreadProperty>
): asserts node is ObjectTypeSpreadProperty {
  assert("ObjectTypeSpreadProperty", node, opts);
}
export function assertOpaqueType(
  node: Node | null | undefined,
  opts?: Partial<OpaqueType>
): asserts node is OpaqueType {
  assert("OpaqueType", node, opts);
}
export function assertQualifiedTypeIdentifier(
  node: Node | null | undefined,
  opts?: Partial<QualifiedTypeIdentifier>
): asserts node is QualifiedTypeIdentifier {
  assert("QualifiedTypeIdentifier", node, opts);
}
export function assertStringLiteralTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<StringLiteralTypeAnnotation>
): asserts node is StringLiteralTypeAnnotation {
  assert("StringLiteralTypeAnnotation", node, opts);
}
export function assertStringTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<StringTypeAnnotation>
): asserts node is StringTypeAnnotation {
  assert("StringTypeAnnotation", node, opts);
}
export function assertSymbolTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<SymbolTypeAnnotation>
): asserts node is SymbolTypeAnnotation {
  assert("SymbolTypeAnnotation", node, opts);
}
export function assertThisTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<ThisTypeAnnotation>
): asserts node is ThisTypeAnnotation {
  assert("ThisTypeAnnotation", node, opts);
}
export function assertTupleTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TupleTypeAnnotation>
): asserts node is TupleTypeAnnotation {
  assert("TupleTypeAnnotation", node, opts);
}
export function assertTypeofTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TypeofTypeAnnotation>
): asserts node is TypeofTypeAnnotation {
  assert("TypeofTypeAnnotation", node, opts);
}
export function assertTypeAlias(
  node: Node | null | undefined,
  opts?: Partial<TypeAlias>
): asserts node is TypeAlias {
  assert("TypeAlias", node, opts);
}
export function assertTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TypeAnnotation>
): asserts node is TypeAnnotation {
  assert("TypeAnnotation", node, opts);
}
export function assertTypeCastExpression(
  node: Node | null | undefined,
  opts?: Partial<TypeCastExpression>
): asserts node is TypeCastExpression {
  assert("TypeCastExpression", node, opts);
}
export function assertTypeParameter(
  node: Node | null | undefined,
  opts?: Partial<TypeParameter>
): asserts node is TypeParameter {
  assert("TypeParameter", node, opts);
}
export function assertTypeParameterDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TypeParameterDeclaration>
): asserts node is TypeParameterDeclaration {
  assert("TypeParameterDeclaration", node, opts);
}
export function assertTypeParameterInstantiation(
  node: Node | null | undefined,
  opts?: Partial<TypeParameterInstantiation>
): asserts node is TypeParameterInstantiation {
  assert("TypeParameterInstantiation", node, opts);
}
export function assertUnionTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<UnionTypeAnnotation>
): asserts node is UnionTypeAnnotation {
  assert("UnionTypeAnnotation", node, opts);
}
export function assertVariance(
  node: Node | null | undefined,
  opts?: Partial<Variance>
): asserts node is Variance {
  assert("Variance", node, opts);
}
export function assertVoidTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<VoidTypeAnnotation>
): asserts node is VoidTypeAnnotation {
  assert("VoidTypeAnnotation", node, opts);
}
export function assertEnumDeclaration(
  node: Node | null | undefined,
  opts?: Partial<EnumDeclaration>
): asserts node is EnumDeclaration {
  assert("EnumDeclaration", node, opts);
}
export function assertEnumBooleanBody(
  node: Node | null | undefined,
  opts?: Partial<EnumBooleanBody>
): asserts node is EnumBooleanBody {
  assert("EnumBooleanBody", node, opts);
}
export function assertEnumNumberBody(
  node: Node | null | undefined,
  opts?: Partial<EnumNumberBody>
): asserts node is EnumNumberBody {
  assert("EnumNumberBody", node, opts);
}
export function assertEnumStringBody(
  node: Node | null | undefined,
  opts?: Partial<EnumStringBody>
): asserts node is EnumStringBody {
  assert("EnumStringBody", node, opts);
}
export function assertEnumSymbolBody(
  node: Node | null | undefined,
  opts?: Partial<EnumSymbolBody>
): asserts node is EnumSymbolBody {
  assert("EnumSymbolBody", node, opts);
}
export function assertEnumBooleanMember(
  node: Node | null | undefined,
  opts?: Partial<EnumBooleanMember>
): asserts node is EnumBooleanMember {
  assert("EnumBooleanMember", node, opts);
}
export function assertEnumNumberMember(
  node: Node | null | undefined,
  opts?: Partial<EnumNumberMember>
): asserts node is EnumNumberMember {
  assert("EnumNumberMember", node, opts);
}
export function assertEnumStringMember(
  node: Node | null | undefined,
  opts?: Partial<EnumStringMember>
): asserts node is EnumStringMember {
  assert("EnumStringMember", node, opts);
}
export function assertEnumDefaultedMember(
  node: Node | null | undefined,
  opts?: Partial<EnumDefaultedMember>
): asserts node is EnumDefaultedMember {
  assert("EnumDefaultedMember", node, opts);
}
export function assertJSXAttribute(
  node: Node | null | undefined,
  opts?: Partial<JSXAttribute>
): asserts node is JSXAttribute {
  assert("JSXAttribute", node, opts);
}
export function assertJSXClosingElement(
  node: Node | null | undefined,
  opts?: Partial<JSXClosingElement>
): asserts node is JSXClosingElement {
  assert("JSXClosingElement", node, opts);
}
export function assertJSXElement(
  node: Node | null | undefined,
  opts?: Partial<JSXElement>
): asserts node is JSXElement {
  assert("JSXElement", node, opts);
}
export function assertJSXEmptyExpression(
  node: Node | null | undefined,
  opts?: Partial<JSXEmptyExpression>
): asserts node is JSXEmptyExpression {
  assert("JSXEmptyExpression", node, opts);
}
export function assertJSXExpressionContainer(
  node: Node | null | undefined,
  opts?: Partial<JSXExpressionContainer>
): asserts node is JSXExpressionContainer {
  assert("JSXExpressionContainer", node, opts);
}
export function assertJSXSpreadChild(
  node: Node | null | undefined,
  opts?: Partial<JSXSpreadChild>
): asserts node is JSXSpreadChild {
  assert("JSXSpreadChild", node, opts);
}
export function assertJSXIdentifier(
  node: Node | null | undefined,
  opts?: Partial<JSXIdentifier>
): asserts node is JSXIdentifier {
  assert("JSXIdentifier", node, opts);
}
export function assertJSXMemberExpression(
  node: Node | null | undefined,
  opts?: Partial<JSXMemberExpression>
): asserts node is JSXMemberExpression {
  assert("JSXMemberExpression", node, opts);
}
export function assertJSXNamespacedName(
  node: Node | null | undefined,
  opts?: Partial<JSXNamespacedName>
): asserts node is JSXNamespacedName {
  assert("JSXNamespacedName", node, opts);
}
export function assertJSXOpeningElement(
  node: Node | null | undefined,
  opts?: Partial<JSXOpeningElement>
): asserts node is JSXOpeningElement {
  assert("JSXOpeningElement", node, opts);
}
export function assertJSXSpreadAttribute(
  node: Node | null | undefined,
  opts?: Partial<JSXSpreadAttribute>
): asserts node is JSXSpreadAttribute {
  assert("JSXSpreadAttribute", node, opts);
}
export function assertJSXText(
  node: Node | null | undefined,
  opts?: Partial<JSXText>
): asserts node is JSXText {
  assert("JSXText", node, opts);
}
export function assertJSXFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXFragment>
): asserts node is JSXFragment {
  assert("JSXFragment", node, opts);
}
export function assertJSXOpeningFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXOpeningFragment>
): asserts node is JSXOpeningFragment {
  assert("JSXOpeningFragment", node, opts);
}
export function assertJSXClosingFragment(
  node: Node | null | undefined,
  opts?: Partial<JSXClosingFragment>
): asserts node is JSXClosingFragment {
  assert("JSXClosingFragment", node, opts);
}
export function assertNoop(
  node: Node | null | undefined,
  opts?: Partial<Noop>
): asserts node is Noop {
  assert("Noop", node, opts);
}
export function assertPlaceholder(
  node: Node | null | undefined,
  opts?: Partial<Placeholder>
): asserts node is Placeholder {
  assert("Placeholder", node, opts);
}
export function assertV8IntrinsicIdentifier(
  node: Node | null | undefined,
  opts?: Partial<V8IntrinsicIdentifier>
): asserts node is V8IntrinsicIdentifier {
  assert("V8IntrinsicIdentifier", node, opts);
}
export function assertArgumentPlaceholder(
  node: Node | null | undefined,
  opts?: Partial<ArgumentPlaceholder>
): asserts node is ArgumentPlaceholder {
  assert("ArgumentPlaceholder", node, opts);
}
export function assertBindExpression(
  node: Node | null | undefined,
  opts?: Partial<BindExpression>
): asserts node is BindExpression {
  assert("BindExpression", node, opts);
}
export function assertClassProperty(
  node: Node | null | undefined,
  opts?: Partial<ClassProperty>
): asserts node is ClassProperty {
  assert("ClassProperty", node, opts);
}
export function assertPipelineTopicExpression(
  node: Node | null | undefined,
  opts?: Partial<PipelineTopicExpression>
): asserts node is PipelineTopicExpression {
  assert("PipelineTopicExpression", node, opts);
}
export function assertPipelineBareFunction(
  node: Node | null | undefined,
  opts?: Partial<PipelineBareFunction>
): asserts node is PipelineBareFunction {
  assert("PipelineBareFunction", node, opts);
}
export function assertPipelinePrimaryTopicReference(
  node: Node | null | undefined,
  opts?: Partial<PipelinePrimaryTopicReference>
): asserts node is PipelinePrimaryTopicReference {
  assert("PipelinePrimaryTopicReference", node, opts);
}
export function assertClassPrivateProperty(
  node: Node | null | undefined,
  opts?: Partial<ClassPrivateProperty>
): asserts node is ClassPrivateProperty {
  assert("ClassPrivateProperty", node, opts);
}
export function assertClassPrivateMethod(
  node: Node | null | undefined,
  opts?: Partial<ClassPrivateMethod>
): asserts node is ClassPrivateMethod {
  assert("ClassPrivateMethod", node, opts);
}
export function assertImportAttribute(
  node: Node | null | undefined,
  opts?: Partial<ImportAttribute>
): asserts node is ImportAttribute {
  assert("ImportAttribute", node, opts);
}
export function assertDecorator(
  node: Node | null | undefined,
  opts?: Partial<Decorator>
): asserts node is Decorator {
  assert("Decorator", node, opts);
}
export function assertDoExpression(
  node: Node | null | undefined,
  opts?: Partial<DoExpression>
): asserts node is DoExpression {
  assert("DoExpression", node, opts);
}
export function assertExportDefaultSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ExportDefaultSpecifier>
): asserts node is ExportDefaultSpecifier {
  assert("ExportDefaultSpecifier", node, opts);
}
export function assertPrivateName(
  node: Node | null | undefined,
  opts?: Partial<PrivateName>
): asserts node is PrivateName {
  assert("PrivateName", node, opts);
}
export function assertRecordExpression(
  node: Node | null | undefined,
  opts?: Partial<RecordExpression>
): asserts node is RecordExpression {
  assert("RecordExpression", node, opts);
}
export function assertTupleExpression(
  node: Node | null | undefined,
  opts?: Partial<TupleExpression>
): asserts node is TupleExpression {
  assert("TupleExpression", node, opts);
}
export function assertDecimalLiteral(
  node: Node | null | undefined,
  opts?: Partial<DecimalLiteral>
): asserts node is DecimalLiteral {
  assert("DecimalLiteral", node, opts);
}
export function assertTSParameterProperty(
  node: Node | null | undefined,
  opts?: Partial<TSParameterProperty>
): asserts node is TSParameterProperty {
  assert("TSParameterProperty", node, opts);
}
export function assertTSDeclareFunction(
  node: Node | null | undefined,
  opts?: Partial<TSDeclareFunction>
): asserts node is TSDeclareFunction {
  assert("TSDeclareFunction", node, opts);
}
export function assertTSDeclareMethod(
  node: Node | null | undefined,
  opts?: Partial<TSDeclareMethod>
): asserts node is TSDeclareMethod {
  assert("TSDeclareMethod", node, opts);
}
export function assertTSQualifiedName(
  node: Node | null | undefined,
  opts?: Partial<TSQualifiedName>
): asserts node is TSQualifiedName {
  assert("TSQualifiedName", node, opts);
}
export function assertTSCallSignatureDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSCallSignatureDeclaration>
): asserts node is TSCallSignatureDeclaration {
  assert("TSCallSignatureDeclaration", node, opts);
}
export function assertTSConstructSignatureDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSConstructSignatureDeclaration>
): asserts node is TSConstructSignatureDeclaration {
  assert("TSConstructSignatureDeclaration", node, opts);
}
export function assertTSPropertySignature(
  node: Node | null | undefined,
  opts?: Partial<TSPropertySignature>
): asserts node is TSPropertySignature {
  assert("TSPropertySignature", node, opts);
}
export function assertTSMethodSignature(
  node: Node | null | undefined,
  opts?: Partial<TSMethodSignature>
): asserts node is TSMethodSignature {
  assert("TSMethodSignature", node, opts);
}
export function assertTSIndexSignature(
  node: Node | null | undefined,
  opts?: Partial<TSIndexSignature>
): asserts node is TSIndexSignature {
  assert("TSIndexSignature", node, opts);
}
export function assertTSAnyKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSAnyKeyword>
): asserts node is TSAnyKeyword {
  assert("TSAnyKeyword", node, opts);
}
export function assertTSBooleanKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSBooleanKeyword>
): asserts node is TSBooleanKeyword {
  assert("TSBooleanKeyword", node, opts);
}
export function assertTSBigIntKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSBigIntKeyword>
): asserts node is TSBigIntKeyword {
  assert("TSBigIntKeyword", node, opts);
}
export function assertTSNeverKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNeverKeyword>
): asserts node is TSNeverKeyword {
  assert("TSNeverKeyword", node, opts);
}
export function assertTSNullKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNullKeyword>
): asserts node is TSNullKeyword {
  assert("TSNullKeyword", node, opts);
}
export function assertTSNumberKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSNumberKeyword>
): asserts node is TSNumberKeyword {
  assert("TSNumberKeyword", node, opts);
}
export function assertTSObjectKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSObjectKeyword>
): asserts node is TSObjectKeyword {
  assert("TSObjectKeyword", node, opts);
}
export function assertTSStringKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSStringKeyword>
): asserts node is TSStringKeyword {
  assert("TSStringKeyword", node, opts);
}
export function assertTSSymbolKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSSymbolKeyword>
): asserts node is TSSymbolKeyword {
  assert("TSSymbolKeyword", node, opts);
}
export function assertTSUndefinedKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSUndefinedKeyword>
): asserts node is TSUndefinedKeyword {
  assert("TSUndefinedKeyword", node, opts);
}
export function assertTSUnknownKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSUnknownKeyword>
): asserts node is TSUnknownKeyword {
  assert("TSUnknownKeyword", node, opts);
}
export function assertTSVoidKeyword(
  node: Node | null | undefined,
  opts?: Partial<TSVoidKeyword>
): asserts node is TSVoidKeyword {
  assert("TSVoidKeyword", node, opts);
}
export function assertTSThisType(
  node: Node | null | undefined,
  opts?: Partial<TSThisType>
): asserts node is TSThisType {
  assert("TSThisType", node, opts);
}
export function assertTSFunctionType(
  node: Node | null | undefined,
  opts?: Partial<TSFunctionType>
): asserts node is TSFunctionType {
  assert("TSFunctionType", node, opts);
}
export function assertTSConstructorType(
  node: Node | null | undefined,
  opts?: Partial<TSConstructorType>
): asserts node is TSConstructorType {
  assert("TSConstructorType", node, opts);
}
export function assertTSTypeReference(
  node: Node | null | undefined,
  opts?: Partial<TSTypeReference>
): asserts node is TSTypeReference {
  assert("TSTypeReference", node, opts);
}
export function assertTSTypePredicate(
  node: Node | null | undefined,
  opts?: Partial<TSTypePredicate>
): asserts node is TSTypePredicate {
  assert("TSTypePredicate", node, opts);
}
export function assertTSTypeQuery(
  node: Node | null | undefined,
  opts?: Partial<TSTypeQuery>
): asserts node is TSTypeQuery {
  assert("TSTypeQuery", node, opts);
}
export function assertTSTypeLiteral(
  node: Node | null | undefined,
  opts?: Partial<TSTypeLiteral>
): asserts node is TSTypeLiteral {
  assert("TSTypeLiteral", node, opts);
}
export function assertTSArrayType(
  node: Node | null | undefined,
  opts?: Partial<TSArrayType>
): asserts node is TSArrayType {
  assert("TSArrayType", node, opts);
}
export function assertTSTupleType(
  node: Node | null | undefined,
  opts?: Partial<TSTupleType>
): asserts node is TSTupleType {
  assert("TSTupleType", node, opts);
}
export function assertTSOptionalType(
  node: Node | null | undefined,
  opts?: Partial<TSOptionalType>
): asserts node is TSOptionalType {
  assert("TSOptionalType", node, opts);
}
export function assertTSRestType(
  node: Node | null | undefined,
  opts?: Partial<TSRestType>
): asserts node is TSRestType {
  assert("TSRestType", node, opts);
}
export function assertTSNamedTupleMember(
  node: Node | null | undefined,
  opts?: Partial<TSNamedTupleMember>
): asserts node is TSNamedTupleMember {
  assert("TSNamedTupleMember", node, opts);
}
export function assertTSUnionType(
  node: Node | null | undefined,
  opts?: Partial<TSUnionType>
): asserts node is TSUnionType {
  assert("TSUnionType", node, opts);
}
export function assertTSIntersectionType(
  node: Node | null | undefined,
  opts?: Partial<TSIntersectionType>
): asserts node is TSIntersectionType {
  assert("TSIntersectionType", node, opts);
}
export function assertTSConditionalType(
  node: Node | null | undefined,
  opts?: Partial<TSConditionalType>
): asserts node is TSConditionalType {
  assert("TSConditionalType", node, opts);
}
export function assertTSInferType(
  node: Node | null | undefined,
  opts?: Partial<TSInferType>
): asserts node is TSInferType {
  assert("TSInferType", node, opts);
}
export function assertTSParenthesizedType(
  node: Node | null | undefined,
  opts?: Partial<TSParenthesizedType>
): asserts node is TSParenthesizedType {
  assert("TSParenthesizedType", node, opts);
}
export function assertTSTypeOperator(
  node: Node | null | undefined,
  opts?: Partial<TSTypeOperator>
): asserts node is TSTypeOperator {
  assert("TSTypeOperator", node, opts);
}
export function assertTSIndexedAccessType(
  node: Node | null | undefined,
  opts?: Partial<TSIndexedAccessType>
): asserts node is TSIndexedAccessType {
  assert("TSIndexedAccessType", node, opts);
}
export function assertTSMappedType(
  node: Node | null | undefined,
  opts?: Partial<TSMappedType>
): asserts node is TSMappedType {
  assert("TSMappedType", node, opts);
}
export function assertTSLiteralType(
  node: Node | null | undefined,
  opts?: Partial<TSLiteralType>
): asserts node is TSLiteralType {
  assert("TSLiteralType", node, opts);
}
export function assertTSExpressionWithTypeArguments(
  node: Node | null | undefined,
  opts?: Partial<TSExpressionWithTypeArguments>
): asserts node is TSExpressionWithTypeArguments {
  assert("TSExpressionWithTypeArguments", node, opts);
}
export function assertTSInterfaceDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSInterfaceDeclaration>
): asserts node is TSInterfaceDeclaration {
  assert("TSInterfaceDeclaration", node, opts);
}
export function assertTSInterfaceBody(
  node: Node | null | undefined,
  opts?: Partial<TSInterfaceBody>
): asserts node is TSInterfaceBody {
  assert("TSInterfaceBody", node, opts);
}
export function assertTSTypeAliasDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAliasDeclaration>
): asserts node is TSTypeAliasDeclaration {
  assert("TSTypeAliasDeclaration", node, opts);
}
export function assertTSAsExpression(
  node: Node | null | undefined,
  opts?: Partial<TSAsExpression>
): asserts node is TSAsExpression {
  assert("TSAsExpression", node, opts);
}
export function assertTSTypeAssertion(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAssertion>
): asserts node is TSTypeAssertion {
  assert("TSTypeAssertion", node, opts);
}
export function assertTSEnumDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSEnumDeclaration>
): asserts node is TSEnumDeclaration {
  assert("TSEnumDeclaration", node, opts);
}
export function assertTSEnumMember(
  node: Node | null | undefined,
  opts?: Partial<TSEnumMember>
): asserts node is TSEnumMember {
  assert("TSEnumMember", node, opts);
}
export function assertTSModuleDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSModuleDeclaration>
): asserts node is TSModuleDeclaration {
  assert("TSModuleDeclaration", node, opts);
}
export function assertTSModuleBlock(
  node: Node | null | undefined,
  opts?: Partial<TSModuleBlock>
): asserts node is TSModuleBlock {
  assert("TSModuleBlock", node, opts);
}
export function assertTSImportType(
  node: Node | null | undefined,
  opts?: Partial<TSImportType>
): asserts node is TSImportType {
  assert("TSImportType", node, opts);
}
export function assertTSImportEqualsDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSImportEqualsDeclaration>
): asserts node is TSImportEqualsDeclaration {
  assert("TSImportEqualsDeclaration", node, opts);
}
export function assertTSExternalModuleReference(
  node: Node | null | undefined,
  opts?: Partial<TSExternalModuleReference>
): asserts node is TSExternalModuleReference {
  assert("TSExternalModuleReference", node, opts);
}
export function assertTSNonNullExpression(
  node: Node | null | undefined,
  opts?: Partial<TSNonNullExpression>
): asserts node is TSNonNullExpression {
  assert("TSNonNullExpression", node, opts);
}
export function assertTSExportAssignment(
  node: Node | null | undefined,
  opts?: Partial<TSExportAssignment>
): asserts node is TSExportAssignment {
  assert("TSExportAssignment", node, opts);
}
export function assertTSNamespaceExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSNamespaceExportDeclaration>
): asserts node is TSNamespaceExportDeclaration {
  assert("TSNamespaceExportDeclaration", node, opts);
}
export function assertTSTypeAnnotation(
  node: Node | null | undefined,
  opts?: Partial<TSTypeAnnotation>
): asserts node is TSTypeAnnotation {
  assert("TSTypeAnnotation", node, opts);
}
export function assertTSTypeParameterInstantiation(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameterInstantiation>
): asserts node is TSTypeParameterInstantiation {
  assert("TSTypeParameterInstantiation", node, opts);
}
export function assertTSTypeParameterDeclaration(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameterDeclaration>
): asserts node is TSTypeParameterDeclaration {
  assert("TSTypeParameterDeclaration", node, opts);
}
export function assertTSTypeParameter(
  node: Node | null | undefined,
  opts?: Partial<TSTypeParameter>
): asserts node is TSTypeParameter {
  assert("TSTypeParameter", node, opts);
}
export function assertExpression(
  node: Node | null | undefined,
  opts?: Partial<Expression>
): asserts node is Expression {
  assert("Expression", node, opts);
}
export function assertBinary(
  node: Node | null | undefined,
  opts?: Partial<Binary>
): asserts node is Binary {
  assert("Binary", node, opts);
}
export function assertScopable(
  node: Node | null | undefined,
  opts?: Partial<Scopable>
): asserts node is Scopable {
  assert("Scopable", node, opts);
}
export function assertBlockParent(
  node: Node | null | undefined,
  opts?: Partial<BlockParent>
): asserts node is BlockParent {
  assert("BlockParent", node, opts);
}
export function assertBlock(
  node: Node | null | undefined,
  opts?: Partial<Block>
): asserts node is Block {
  assert("Block", node, opts);
}
export function assertStatement(
  node: Node | null | undefined,
  opts?: Partial<Statement>
): asserts node is Statement {
  assert("Statement", node, opts);
}
export function assertTerminatorless(
  node: Node | null | undefined,
  opts?: Partial<Terminatorless>
): asserts node is Terminatorless {
  assert("Terminatorless", node, opts);
}
export function assertCompletionStatement(
  node: Node | null | undefined,
  opts?: Partial<CompletionStatement>
): asserts node is CompletionStatement {
  assert("CompletionStatement", node, opts);
}
export function assertConditional(
  node: Node | null | undefined,
  opts?: Partial<Conditional>
): asserts node is Conditional {
  assert("Conditional", node, opts);
}
export function assertLoop(
  node: Node | null | undefined,
  opts?: Partial<Loop>
): asserts node is Loop {
  assert("Loop", node, opts);
}
export function assertWhile(
  node: Node | null | undefined,
  opts?: Partial<While>
): asserts node is While {
  assert("While", node, opts);
}
export function assertExpressionWrapper(
  node: Node | null | undefined,
  opts?: Partial<ExpressionWrapper>
): asserts node is ExpressionWrapper {
  assert("ExpressionWrapper", node, opts);
}
export function assertFor(
  node: Node | null | undefined,
  opts?: Partial<For>
): asserts node is For {
  assert("For", node, opts);
}
export function assertForXStatement(
  node: Node | null | undefined,
  opts?: Partial<ForXStatement>
): asserts node is ForXStatement {
  assert("ForXStatement", node, opts);
}
export function assertFunction(
  node: Node | null | undefined,
  opts?: Partial<Function>
): asserts node is Function {
  assert("Function", node, opts);
}
export function assertFunctionParent(
  node: Node | null | undefined,
  opts?: Partial<FunctionParent>
): asserts node is FunctionParent {
  assert("FunctionParent", node, opts);
}
export function assertPureish(
  node: Node | null | undefined,
  opts?: Partial<Pureish>
): asserts node is Pureish {
  assert("Pureish", node, opts);
}
export function assertDeclaration(
  node: Node | null | undefined,
  opts?: Partial<Declaration>
): asserts node is Declaration {
  assert("Declaration", node, opts);
}
export function assertPatternLike(
  node: Node | null | undefined,
  opts?: Partial<PatternLike>
): asserts node is PatternLike {
  assert("PatternLike", node, opts);
}
export function assertLVal(
  node: Node | null | undefined,
  opts?: Partial<LVal>
): asserts node is LVal {
  assert("LVal", node, opts);
}
export function assertTSEntityName(
  node: Node | null | undefined,
  opts?: Partial<TSEntityName>
): asserts node is TSEntityName {
  assert("TSEntityName", node, opts);
}
export function assertLiteral(
  node: Node | null | undefined,
  opts?: Partial<Literal>
): asserts node is Literal {
  assert("Literal", node, opts);
}
export function assertImmutable(
  node: Node | null | undefined,
  opts?: Partial<Immutable>
): asserts node is Immutable {
  assert("Immutable", node, opts);
}
export function assertUserWhitespacable(
  node: Node | null | undefined,
  opts?: Partial<UserWhitespacable>
): asserts node is UserWhitespacable {
  assert("UserWhitespacable", node, opts);
}
export function assertMethod(
  node: Node | null | undefined,
  opts?: Partial<Method>
): asserts node is Method {
  assert("Method", node, opts);
}
export function assertObjectMember(
  node: Node | null | undefined,
  opts?: Partial<ObjectMember>
): asserts node is ObjectMember {
  assert("ObjectMember", node, opts);
}
export function assertProperty(
  node: Node | null | undefined,
  opts?: Partial<Property>
): asserts node is Property {
  assert("Property", node, opts);
}
export function assertUnaryLike(
  node: Node | null | undefined,
  opts?: Partial<UnaryLike>
): asserts node is UnaryLike {
  assert("UnaryLike", node, opts);
}
export function assertPattern(
  node: Node | null | undefined,
  opts?: Partial<Pattern>
): asserts node is Pattern {
  assert("Pattern", node, opts);
}
export function assertClass(
  node: Node | null | undefined,
  opts?: Partial<Class>
): asserts node is Class {
  assert("Class", node, opts);
}
export function assertModuleDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ModuleDeclaration>
): asserts node is ModuleDeclaration {
  assert("ModuleDeclaration", node, opts);
}
export function assertExportDeclaration(
  node: Node | null | undefined,
  opts?: Partial<ExportDeclaration>
): asserts node is ExportDeclaration {
  assert("ExportDeclaration", node, opts);
}
export function assertModuleSpecifier(
  node: Node | null | undefined,
  opts?: Partial<ModuleSpecifier>
): asserts node is ModuleSpecifier {
  assert("ModuleSpecifier", node, opts);
}
export function assertFlow(
  node: Node | null | undefined,
  opts?: Partial<Flow>
): asserts node is Flow {
  assert("Flow", node, opts);
}
export function assertFlowType(
  node: Node | null | undefined,
  opts?: Partial<FlowType>
): asserts node is FlowType {
  assert("FlowType", node, opts);
}
export function assertFlowBaseAnnotation(
  node: Node | null | undefined,
  opts?: Partial<FlowBaseAnnotation>
): asserts node is FlowBaseAnnotation {
  assert("FlowBaseAnnotation", node, opts);
}
export function assertFlowDeclaration(
  node: Node | null | undefined,
  opts?: Partial<FlowDeclaration>
): asserts node is FlowDeclaration {
  assert("FlowDeclaration", node, opts);
}
export function assertFlowPredicate(
  node: Node | null | undefined,
  opts?: Partial<FlowPredicate>
): asserts node is FlowPredicate {
  assert("FlowPredicate", node, opts);
}
export function assertEnumBody(
  node: Node | null | undefined,
  opts?: Partial<EnumBody>
): asserts node is EnumBody {
  assert("EnumBody", node, opts);
}
export function assertEnumMember(
  node: Node | null | undefined,
  opts?: Partial<EnumMember>
): asserts node is EnumMember {
  assert("EnumMember", node, opts);
}
export function assertJSX(
  node: Node | null | undefined,
  opts?: Partial<JSX>
): asserts node is JSX {
  assert("JSX", node, opts);
}
export function assertPrivate(
  node: Node | null | undefined,
  opts?: Partial<Private>
): asserts node is Private {
  assert("Private", node, opts);
}
export function assertTSTypeElement(
  node: Node | null | undefined,
  opts?: Partial<TSTypeElement>
): asserts node is TSTypeElement {
  assert("TSTypeElement", node, opts);
}
export function assertTSType(
  node: Node | null | undefined,
  opts?: Partial<TSType>
): asserts node is TSType {
  assert("TSType", node, opts);
}
export function assertTSBaseType(
  node: Node | null | undefined,
  opts?: Partial<TSBaseType>
): asserts node is TSBaseType {
  assert("TSBaseType", node, opts);
}
export function assertNumberLiteral(
  node: Node | null | undefined,
  opts: Partial<NumberLiteral>
): asserts node is NumberLiteral {
  console.trace(
    "The node type NumberLiteral has been renamed to NumericLiteral"
  );
  assert("NumericLiteral", node, opts);
}
export function assertRegexLiteral(
  node: Node | null | undefined,
  opts: Partial<RegexLiteral>
): asserts node is RegexLiteral {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  assert("RegExpLiteral", node, opts);
}
export function assertRestProperty(
  node: Node | null | undefined,
  opts: Partial<RestProperty>
): asserts node is RestProperty {
  console.trace("The node type RestProperty has been renamed to RestElement");
  assert("RestElement", node, opts);
}
export function assertSpreadProperty(
  node: Node | null | undefined,
  opts: Partial<SpreadProperty>
): asserts node is SpreadProperty {
  console.trace(
    "The node type SpreadProperty has been renamed to SpreadElement"
  );
  assert("SpreadElement", node, opts);
}
