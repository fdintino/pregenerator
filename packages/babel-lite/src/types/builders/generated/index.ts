/*
 * This file is auto-generated! Do not modify it directly.
 * To re-generate run 'make build'
 */
import loClone from "lodash/clone";
import { NODE_FIELDS, BUILDER_KEYS } from "../../definitions";
import validate from "../../validators/validate";

import type {
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
  Expression,
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
  Statement,
  Pattern,
  FlowType,
  LVal,
  PatternLike,
  CommentBlock,
  CommentLine,
  Declaration,
  Flow,
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
  TSEntityName,
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
  TSType,
  TSTypeAnnotation,
  TSTypeElement,
  TSTypeParameterInstantiation,
  TSTypeParameterDeclaration,
  TSTypeParameter,
  Node,
} from "../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function builder<
  T extends Node["type"],
  P extends Extract<Node, { type: T }>,
  K extends Extract<keyof P, string>
>(type: T, ...args: Array<any>): P {
  const keys = BUILDER_KEYS[type] as unknown as K[];
  const countArgs = args.length;
  if (countArgs > keys.length) {
    throw new Error(
      `${type}: Too many arguments passed. Received ${countArgs} but can receive no more than ${keys.length}`
    );
  }

  const node = { type } as P;

  let i = 0;
  keys.forEach((key) => {
    const field = NODE_FIELDS[type][key];

    let arg;
    if (i < countArgs) arg = args[i];
    if (arg === undefined) arg = loClone(field.default);

    node[key] = arg;
    i++;
  });

  for (const key of Object.keys(node)) {
    validate(node, (key as K), node[key]);
  }

  return node;
}

export function arrayExpression(
  elements?: Array<null | Expression | SpreadElement>
): ArrayExpression {
  return builder("ArrayExpression", elements);
}
export { arrayExpression as ArrayExpression };
export function assignmentExpression(
  operator: string,
  left: LVal,
  right: Expression
): AssignmentExpression {
  return builder("AssignmentExpression", operator, left, right);
}
export { assignmentExpression as AssignmentExpression };
export function binaryExpression(
  operator:
    | "+"
    | "-"
    | "/"
    | "%"
    | "*"
    | "**"
    | "&"
    | "|"
    | ">>"
    | ">>>"
    | "<<"
    | "^"
    | "=="
    | "==="
    | "!="
    | "!=="
    | "in"
    | "instanceof"
    | ">"
    | "<"
    | ">="
    | "<=",
  left: Expression | PrivateName,
  right: Expression
): BinaryExpression {
  return builder("BinaryExpression", operator, left, right);
}
export { binaryExpression as BinaryExpression };
export function interpreterDirective(value: string): InterpreterDirective {
  return builder("InterpreterDirective", value);
}
export { interpreterDirective as InterpreterDirective };
export function directive(value: DirectiveLiteral): Directive {
  return builder("Directive", value);
}
export { directive as Directive };
export function directiveLiteral(value: string): DirectiveLiteral {
  return builder("DirectiveLiteral", value);
}
export { directiveLiteral as DirectiveLiteral };
export function blockStatement(
  body: Array<Statement>,
  directives?: Array<Directive>
): BlockStatement {
  return builder("BlockStatement", body, directives);
}
export { blockStatement as BlockStatement };
export function breakStatement(label?: Identifier | null): BreakStatement {
  return builder("BreakStatement", label);
}
export { breakStatement as BreakStatement };
export function callExpression(
  callee: Expression | V8IntrinsicIdentifier,
  _arguments: Array<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >
): CallExpression {
  return builder("CallExpression", callee, _arguments);
}
export { callExpression as CallExpression };
export function catchClause(
  param: Identifier | ArrayPattern | ObjectPattern | null | undefined,
  body: BlockStatement
): CatchClause {
  return builder("CatchClause", param, body);
}
export { catchClause as CatchClause };
export function conditionalExpression(
  test: Expression,
  consequent: Expression,
  alternate: Expression
): ConditionalExpression {
  return builder("ConditionalExpression", test, consequent, alternate);
}
export { conditionalExpression as ConditionalExpression };
export function continueStatement(
  label?: Identifier | null
): ContinueStatement {
  return builder("ContinueStatement", label);
}
export { continueStatement as ContinueStatement };
export function debuggerStatement(): DebuggerStatement {
  return builder("DebuggerStatement");
}
export { debuggerStatement as DebuggerStatement };
export function doWhileStatement(
  test: Expression,
  body: Statement
): DoWhileStatement {
  return builder("DoWhileStatement", test, body);
}
export { doWhileStatement as DoWhileStatement };
export function emptyStatement(): EmptyStatement {
  return builder("EmptyStatement");
}
export { emptyStatement as EmptyStatement };
export function expressionStatement(
  expression: Expression
): ExpressionStatement {
  return builder("ExpressionStatement", expression);
}
export { expressionStatement as ExpressionStatement };
export function file(
  program: Program,
  comments?: Array<CommentBlock | CommentLine> | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokens?: Array<any> | null
): File {
  return builder("File", program, comments, tokens);
}
export { file as File };
export function forInStatement(
  left: VariableDeclaration | LVal,
  right: Expression,
  body: Statement
): ForInStatement {
  return builder("ForInStatement", left, right, body);
}
export { forInStatement as ForInStatement };
export function forStatement(
  init: VariableDeclaration | Expression | null | undefined,
  test: Expression | null | undefined,
  update: Expression | null | undefined,
  body: Statement
): ForStatement {
  return builder("ForStatement", init, test, update, body);
}
export { forStatement as ForStatement };
export function functionDeclaration(
  id: Identifier | null | undefined,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement,
  generator?: boolean,
  async?: boolean
): FunctionDeclaration {
  return builder("FunctionDeclaration", id, params, body, generator, async);
}
export { functionDeclaration as FunctionDeclaration };
export function functionExpression(
  id: Identifier | null | undefined,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement,
  generator?: boolean,
  async?: boolean
): FunctionExpression {
  return builder("FunctionExpression", id, params, body, generator, async);
}
export { functionExpression as FunctionExpression };
export function identifier(name: string): Identifier {
  return builder("Identifier", name);
}
export { identifier as Identifier };
export function ifStatement(
  test: Expression,
  consequent: Statement,
  alternate?: Statement | null
): IfStatement {
  return builder("IfStatement", test, consequent, alternate);
}
export { ifStatement as IfStatement };
export function labeledStatement(
  label: Identifier,
  body: Statement
): LabeledStatement {
  return builder("LabeledStatement", label, body);
}
export { labeledStatement as LabeledStatement };
export function stringLiteral(value: string): StringLiteral {
  return builder("StringLiteral", value);
}
export { stringLiteral as StringLiteral };
export function numericLiteral(value: number): NumericLiteral {
  return builder("NumericLiteral", value);
}
export { numericLiteral as NumericLiteral };
export function nullLiteral(): NullLiteral {
  return builder("NullLiteral");
}
export { nullLiteral as NullLiteral };
export function booleanLiteral(value: boolean): BooleanLiteral {
  return builder("BooleanLiteral", value);
}
export { booleanLiteral as BooleanLiteral };
export function regExpLiteral(pattern: string, flags?: string): RegExpLiteral {
  return builder("RegExpLiteral", pattern, flags);
}
export { regExpLiteral as RegExpLiteral };
export function logicalExpression(
  operator: "||" | "&&" | "??",
  left: Expression,
  right: Expression
): LogicalExpression {
  return builder("LogicalExpression", operator, left, right);
}
export { logicalExpression as LogicalExpression };
export function memberExpression(
  object: Expression,
  property: Expression | Identifier | PrivateName,
  computed?: boolean,
  optional?: true | false | null
): MemberExpression {
  return builder("MemberExpression", object, property, computed, optional);
}
export { memberExpression as MemberExpression };
export function newExpression(
  callee: Expression | V8IntrinsicIdentifier,
  _arguments: Array<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >
): NewExpression {
  return builder("NewExpression", callee, _arguments);
}
export { newExpression as NewExpression };
export function program(
  body: Array<Statement>,
  directives?: Array<Directive>,
  sourceType?: "script" | "module",
  interpreter?: InterpreterDirective | null
): Program {
  return builder("Program", body, directives, sourceType, interpreter);
}
export { program as Program };
export function objectExpression(
  properties: Array<ObjectMethod | ObjectProperty | SpreadElement>
): ObjectExpression {
  return builder("ObjectExpression", properties);
}
export { objectExpression as ObjectExpression };
export function objectMethod(
  kind: "method" | "get" | "set" | undefined,
  key: Expression | Identifier | StringLiteral | NumericLiteral,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement,
  computed?: boolean,
  generator?: boolean,
  async?: boolean
): ObjectMethod {
  return builder(
    "ObjectMethod",
    kind,
    key,
    params,
    body,
    computed,
    generator,
    async
  );
}
export { objectMethod as ObjectMethod };
export function objectProperty(
  key: Expression | Identifier | StringLiteral | NumericLiteral,
  value: Expression | PatternLike,
  computed?: boolean,
  shorthand?: boolean,
  decorators?: Array<Decorator> | null
): ObjectProperty {
  return builder("ObjectProperty", key, value, computed, shorthand, decorators);
}
export { objectProperty as ObjectProperty };
export function restElement(argument: LVal): RestElement {
  return builder("RestElement", argument);
}
export { restElement as RestElement };
export function returnStatement(argument?: Expression | null): ReturnStatement {
  return builder("ReturnStatement", argument);
}
export { returnStatement as ReturnStatement };
export function sequenceExpression(
  expressions: Array<Expression>
): SequenceExpression {
  return builder("SequenceExpression", expressions);
}
export { sequenceExpression as SequenceExpression };
export function parenthesizedExpression(
  expression: Expression
): ParenthesizedExpression {
  return builder("ParenthesizedExpression", expression);
}
export { parenthesizedExpression as ParenthesizedExpression };
export function switchCase(
  test: Expression | null | undefined,
  consequent: Array<Statement>
): SwitchCase {
  return builder("SwitchCase", test, consequent);
}
export { switchCase as SwitchCase };
export function switchStatement(
  discriminant: Expression,
  cases: Array<SwitchCase>
): SwitchStatement {
  return builder("SwitchStatement", discriminant, cases);
}
export { switchStatement as SwitchStatement };
export function thisExpression(): ThisExpression {
  return builder("ThisExpression");
}
export { thisExpression as ThisExpression };
export function throwStatement(argument: Expression): ThrowStatement {
  return builder("ThrowStatement", argument);
}
export { throwStatement as ThrowStatement };
export function tryStatement(
  block: BlockStatement,
  handler?: CatchClause | null,
  finalizer?: BlockStatement | null
): TryStatement {
  return builder("TryStatement", block, handler, finalizer);
}
export { tryStatement as TryStatement };
export function unaryExpression(
  operator: "void" | "throw" | "delete" | "!" | "+" | "-" | "~" | "typeof",
  argument: Expression,
  prefix?: boolean
): UnaryExpression {
  return builder("UnaryExpression", operator, argument, prefix);
}
export { unaryExpression as UnaryExpression };
export function updateExpression(
  operator: "++" | "--",
  argument: Expression,
  prefix?: boolean
): UpdateExpression {
  return builder("UpdateExpression", operator, argument, prefix);
}
export { updateExpression as UpdateExpression };
export function variableDeclaration(
  kind: "var" | "let" | "const",
  declarations: Array<VariableDeclarator>
): VariableDeclaration {
  return builder("VariableDeclaration", kind, declarations);
}
export { variableDeclaration as VariableDeclaration };
export function variableDeclarator(
  id: LVal,
  init?: Expression | null
): VariableDeclarator {
  return builder("VariableDeclarator", id, init);
}
export { variableDeclarator as VariableDeclarator };
export function whileStatement(
  test: Expression,
  body: Statement
): WhileStatement {
  return builder("WhileStatement", test, body);
}
export { whileStatement as WhileStatement };
export function withStatement(
  object: Expression,
  body: Statement
): WithStatement {
  return builder("WithStatement", object, body);
}
export { withStatement as WithStatement };
export function assignmentPattern(
  left: Identifier | ObjectPattern | ArrayPattern | MemberExpression,
  right: Expression
): AssignmentPattern {
  return builder("AssignmentPattern", left, right);
}
export { assignmentPattern as AssignmentPattern };
export function arrayPattern(
  elements: Array<null | PatternLike>
): ArrayPattern {
  return builder("ArrayPattern", elements);
}
export { arrayPattern as ArrayPattern };
export function arrowFunctionExpression(
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement | Expression,
  async?: boolean
): ArrowFunctionExpression {
  return builder("ArrowFunctionExpression", params, body, async);
}
export { arrowFunctionExpression as ArrowFunctionExpression };
export function classBody(
  body: Array<
    | ClassMethod
    | ClassPrivateMethod
    | ClassProperty
    | ClassPrivateProperty
    | TSDeclareMethod
    | TSIndexSignature
  >
): ClassBody {
  return builder("ClassBody", body);
}
export { classBody as ClassBody };
export function classExpression(
  id: Identifier | null | undefined,
  superClass: Expression | null | undefined,
  body: ClassBody,
  decorators?: Array<Decorator> | null
): ClassExpression {
  return builder("ClassExpression", id, superClass, body, decorators);
}
export { classExpression as ClassExpression };
export function classDeclaration(
  id: Identifier,
  superClass: Expression | null | undefined,
  body: ClassBody,
  decorators?: Array<Decorator> | null
): ClassDeclaration {
  return builder("ClassDeclaration", id, superClass, body, decorators);
}
export { classDeclaration as ClassDeclaration };
export function exportAllDeclaration(
  source: StringLiteral
): ExportAllDeclaration {
  return builder("ExportAllDeclaration", source);
}
export { exportAllDeclaration as ExportAllDeclaration };
export function exportDefaultDeclaration(
  declaration:
    | FunctionDeclaration
    | TSDeclareFunction
    | ClassDeclaration
    | Expression
): ExportDefaultDeclaration {
  return builder("ExportDefaultDeclaration", declaration);
}
export { exportDefaultDeclaration as ExportDefaultDeclaration };
export function exportNamedDeclaration(
  declaration?: Declaration | null,
  specifiers?: Array<
    ExportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier
  >,
  source?: StringLiteral | null
): ExportNamedDeclaration {
  return builder("ExportNamedDeclaration", declaration, specifiers, source);
}
export { exportNamedDeclaration as ExportNamedDeclaration };
export function exportSpecifier(
  local: Identifier,
  exported: Identifier
): ExportSpecifier {
  return builder("ExportSpecifier", local, exported);
}
export { exportSpecifier as ExportSpecifier };
export function forOfStatement(
  left: VariableDeclaration | LVal,
  right: Expression,
  body: Statement,
  _await?: boolean
): ForOfStatement {
  return builder("ForOfStatement", left, right, body, _await);
}
export { forOfStatement as ForOfStatement };
export function importDeclaration(
  specifiers: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >,
  source: StringLiteral
): ImportDeclaration {
  return builder("ImportDeclaration", specifiers, source);
}
export { importDeclaration as ImportDeclaration };
export function importDefaultSpecifier(
  local: Identifier
): ImportDefaultSpecifier {
  return builder("ImportDefaultSpecifier", local);
}
export { importDefaultSpecifier as ImportDefaultSpecifier };
export function importNamespaceSpecifier(
  local: Identifier
): ImportNamespaceSpecifier {
  return builder("ImportNamespaceSpecifier", local);
}
export { importNamespaceSpecifier as ImportNamespaceSpecifier };
export function importSpecifier(
  local: Identifier,
  imported: Identifier
): ImportSpecifier {
  return builder("ImportSpecifier", local, imported);
}
export { importSpecifier as ImportSpecifier };
export function metaProperty(
  meta: Identifier,
  property: Identifier
): MetaProperty {
  return builder("MetaProperty", meta, property);
}
export { metaProperty as MetaProperty };
export function classMethod(
  kind: "get" | "set" | "method" | "constructor" | undefined,
  key: Identifier | StringLiteral | NumericLiteral | Expression,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement,
  computed?: boolean,
  _static?: boolean,
  generator?: boolean,
  async?: boolean
): ClassMethod {
  return builder(
    "ClassMethod",
    kind,
    key,
    params,
    body,
    computed,
    _static,
    generator,
    async
  );
}
export { classMethod as ClassMethod };
export function objectPattern(
  properties: Array<RestElement | ObjectProperty>
): ObjectPattern {
  return builder("ObjectPattern", properties);
}
export { objectPattern as ObjectPattern };
export function spreadElement(argument: Expression): SpreadElement {
  return builder("SpreadElement", argument);
}
export { spreadElement as SpreadElement };
function _super(): Super {
  return builder("Super");
}
export { _super as super };
export { _super as Super };
export function taggedTemplateExpression(
  tag: Expression,
  quasi: TemplateLiteral
): TaggedTemplateExpression {
  return builder("TaggedTemplateExpression", tag, quasi);
}
export { taggedTemplateExpression as TaggedTemplateExpression };
export function templateElement(
  value: { raw: string; cooked?: string },
  tail?: boolean
): TemplateElement {
  return builder("TemplateElement", value, tail);
}
export { templateElement as TemplateElement };
export function templateLiteral(
  quasis: Array<TemplateElement>,
  expressions: Array<Expression>
): TemplateLiteral {
  return builder("TemplateLiteral", quasis, expressions);
}
export { templateLiteral as TemplateLiteral };
export function yieldExpression(
  argument?: Expression | null,
  delegate?: boolean
): YieldExpression {
  return builder("YieldExpression", argument, delegate);
}
export { yieldExpression as YieldExpression };
export function awaitExpression(argument: Expression): AwaitExpression {
  return builder("AwaitExpression", argument);
}
export { awaitExpression as AwaitExpression };
function _import(): Import {
  return builder("Import");
}
export { _import as import };
export { _import as Import };
export function bigIntLiteral(value: string): BigIntLiteral {
  return builder("BigIntLiteral", value);
}
export { bigIntLiteral as BigIntLiteral };
export function exportNamespaceSpecifier(
  exported: Identifier
): ExportNamespaceSpecifier {
  return builder("ExportNamespaceSpecifier", exported);
}
export { exportNamespaceSpecifier as ExportNamespaceSpecifier };
export function optionalMemberExpression(
  object: Expression,
  property: Expression | Identifier,
  computed: boolean | undefined,
  optional: boolean
): OptionalMemberExpression {
  return builder(
    "OptionalMemberExpression",
    object,
    property,
    computed,
    optional
  );
}
export { optionalMemberExpression as OptionalMemberExpression };
export function optionalCallExpression(
  callee: Expression,
  _arguments: Array<Expression | SpreadElement | JSXNamespacedName>,
  optional: boolean
): OptionalCallExpression {
  return builder("OptionalCallExpression", callee, _arguments, optional);
}
export { optionalCallExpression as OptionalCallExpression };
export function anyTypeAnnotation(): AnyTypeAnnotation {
  return builder("AnyTypeAnnotation");
}
export { anyTypeAnnotation as AnyTypeAnnotation };
export function arrayTypeAnnotation(
  elementType: FlowType
): ArrayTypeAnnotation {
  return builder("ArrayTypeAnnotation", elementType);
}
export { arrayTypeAnnotation as ArrayTypeAnnotation };
export function booleanTypeAnnotation(): BooleanTypeAnnotation {
  return builder("BooleanTypeAnnotation");
}
export { booleanTypeAnnotation as BooleanTypeAnnotation };
export function booleanLiteralTypeAnnotation(
  value: boolean
): BooleanLiteralTypeAnnotation {
  return builder("BooleanLiteralTypeAnnotation", value);
}
export { booleanLiteralTypeAnnotation as BooleanLiteralTypeAnnotation };
export function nullLiteralTypeAnnotation(): NullLiteralTypeAnnotation {
  return builder("NullLiteralTypeAnnotation");
}
export { nullLiteralTypeAnnotation as NullLiteralTypeAnnotation };
export function classImplements(
  id: Identifier,
  typeParameters?: TypeParameterInstantiation | null
): ClassImplements {
  return builder("ClassImplements", id, typeParameters);
}
export { classImplements as ClassImplements };
export function declareClass(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  _extends: Array<InterfaceExtends> | null | undefined,
  body: ObjectTypeAnnotation
): DeclareClass {
  return builder("DeclareClass", id, typeParameters, _extends, body);
}
export { declareClass as DeclareClass };
export function declareFunction(id: Identifier): DeclareFunction {
  return builder("DeclareFunction", id);
}
export { declareFunction as DeclareFunction };
export function declareInterface(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  _extends: Array<InterfaceExtends> | null | undefined,
  body: ObjectTypeAnnotation
): DeclareInterface {
  return builder("DeclareInterface", id, typeParameters, _extends, body);
}
export { declareInterface as DeclareInterface };
export function declareModule(
  id: Identifier | StringLiteral,
  body: BlockStatement,
  kind?: "CommonJS" | "ES" | null
): DeclareModule {
  return builder("DeclareModule", id, body, kind);
}
export { declareModule as DeclareModule };
export function declareModuleExports(
  typeAnnotation: TypeAnnotation
): DeclareModuleExports {
  return builder("DeclareModuleExports", typeAnnotation);
}
export { declareModuleExports as DeclareModuleExports };
export function declareTypeAlias(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  right: FlowType
): DeclareTypeAlias {
  return builder("DeclareTypeAlias", id, typeParameters, right);
}
export { declareTypeAlias as DeclareTypeAlias };
export function declareOpaqueType(
  id: Identifier,
  typeParameters?: TypeParameterDeclaration | null,
  supertype?: FlowType | null
): DeclareOpaqueType {
  return builder("DeclareOpaqueType", id, typeParameters, supertype);
}
export { declareOpaqueType as DeclareOpaqueType };
export function declareVariable(id: Identifier): DeclareVariable {
  return builder("DeclareVariable", id);
}
export { declareVariable as DeclareVariable };
export function declareExportDeclaration(
  declaration?: Flow | null,
  specifiers?: Array<ExportSpecifier | ExportNamespaceSpecifier> | null,
  source?: StringLiteral | null
): DeclareExportDeclaration {
  return builder("DeclareExportDeclaration", declaration, specifiers, source);
}
export { declareExportDeclaration as DeclareExportDeclaration };
export function declareExportAllDeclaration(
  source: StringLiteral
): DeclareExportAllDeclaration {
  return builder("DeclareExportAllDeclaration", source);
}
export { declareExportAllDeclaration as DeclareExportAllDeclaration };
export function declaredPredicate(value: Flow): DeclaredPredicate {
  return builder("DeclaredPredicate", value);
}
export { declaredPredicate as DeclaredPredicate };
export function existsTypeAnnotation(): ExistsTypeAnnotation {
  return builder("ExistsTypeAnnotation");
}
export { existsTypeAnnotation as ExistsTypeAnnotation };
export function functionTypeAnnotation(
  typeParameters: TypeParameterDeclaration | null | undefined,
  params: Array<FunctionTypeParam>,
  rest: FunctionTypeParam | null | undefined,
  returnType: FlowType
): FunctionTypeAnnotation {
  return builder(
    "FunctionTypeAnnotation",
    typeParameters,
    params,
    rest,
    returnType
  );
}
export { functionTypeAnnotation as FunctionTypeAnnotation };
export function functionTypeParam(
  name: Identifier | null | undefined,
  typeAnnotation: FlowType
): FunctionTypeParam {
  return builder("FunctionTypeParam", name, typeAnnotation);
}
export { functionTypeParam as FunctionTypeParam };
export function genericTypeAnnotation(
  id: Identifier | QualifiedTypeIdentifier,
  typeParameters?: TypeParameterInstantiation | null
): GenericTypeAnnotation {
  return builder("GenericTypeAnnotation", id, typeParameters);
}
export { genericTypeAnnotation as GenericTypeAnnotation };
export function inferredPredicate(): InferredPredicate {
  return builder("InferredPredicate");
}
export { inferredPredicate as InferredPredicate };
export function interfaceExtends(
  id: Identifier | QualifiedTypeIdentifier,
  typeParameters?: TypeParameterInstantiation | null
): InterfaceExtends {
  return builder("InterfaceExtends", id, typeParameters);
}
export { interfaceExtends as InterfaceExtends };
export function interfaceDeclaration(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  _extends: Array<InterfaceExtends> | null | undefined,
  body: ObjectTypeAnnotation
): InterfaceDeclaration {
  return builder("InterfaceDeclaration", id, typeParameters, _extends, body);
}
export { interfaceDeclaration as InterfaceDeclaration };
export function interfaceTypeAnnotation(
  _extends: Array<InterfaceExtends> | null | undefined,
  body: ObjectTypeAnnotation
): InterfaceTypeAnnotation {
  return builder("InterfaceTypeAnnotation", _extends, body);
}
export { interfaceTypeAnnotation as InterfaceTypeAnnotation };
export function intersectionTypeAnnotation(
  types: Array<FlowType>
): IntersectionTypeAnnotation {
  return builder("IntersectionTypeAnnotation", types);
}
export { intersectionTypeAnnotation as IntersectionTypeAnnotation };
export function mixedTypeAnnotation(): MixedTypeAnnotation {
  return builder("MixedTypeAnnotation");
}
export { mixedTypeAnnotation as MixedTypeAnnotation };
export function emptyTypeAnnotation(): EmptyTypeAnnotation {
  return builder("EmptyTypeAnnotation");
}
export { emptyTypeAnnotation as EmptyTypeAnnotation };
export function nullableTypeAnnotation(
  typeAnnotation: FlowType
): NullableTypeAnnotation {
  return builder("NullableTypeAnnotation", typeAnnotation);
}
export { nullableTypeAnnotation as NullableTypeAnnotation };
export function numberLiteralTypeAnnotation(
  value: number
): NumberLiteralTypeAnnotation {
  return builder("NumberLiteralTypeAnnotation", value);
}
export { numberLiteralTypeAnnotation as NumberLiteralTypeAnnotation };
export function numberTypeAnnotation(): NumberTypeAnnotation {
  return builder("NumberTypeAnnotation");
}
export { numberTypeAnnotation as NumberTypeAnnotation };
export function objectTypeAnnotation(
  properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>,
  indexers?: Array<ObjectTypeIndexer> | null,
  callProperties?: Array<ObjectTypeCallProperty> | null,
  internalSlots?: Array<ObjectTypeInternalSlot> | null,
  exact?: boolean
): ObjectTypeAnnotation {
  return builder(
    "ObjectTypeAnnotation",
    properties,
    indexers,
    callProperties,
    internalSlots,
    exact
  );
}
export { objectTypeAnnotation as ObjectTypeAnnotation };
export function objectTypeInternalSlot(
  id: Identifier,
  value: FlowType,
  optional: boolean,
  _static: boolean,
  method: boolean
): ObjectTypeInternalSlot {
  return builder(
    "ObjectTypeInternalSlot",
    id,
    value,
    optional,
    _static,
    method
  );
}
export { objectTypeInternalSlot as ObjectTypeInternalSlot };
export function objectTypeCallProperty(
  value: FlowType
): ObjectTypeCallProperty {
  return builder("ObjectTypeCallProperty", value);
}
export { objectTypeCallProperty as ObjectTypeCallProperty };
export function objectTypeIndexer(
  id: Identifier | null | undefined,
  key: FlowType,
  value: FlowType,
  variance?: Variance | null
): ObjectTypeIndexer {
  return builder("ObjectTypeIndexer", id, key, value, variance);
}
export { objectTypeIndexer as ObjectTypeIndexer };
export function objectTypeProperty(
  key: Identifier | StringLiteral,
  value: FlowType,
  variance?: Variance | null
): ObjectTypeProperty {
  return builder("ObjectTypeProperty", key, value, variance);
}
export { objectTypeProperty as ObjectTypeProperty };
export function objectTypeSpreadProperty(
  argument: FlowType
): ObjectTypeSpreadProperty {
  return builder("ObjectTypeSpreadProperty", argument);
}
export { objectTypeSpreadProperty as ObjectTypeSpreadProperty };
export function opaqueType(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  supertype: FlowType | null | undefined,
  impltype: FlowType
): OpaqueType {
  return builder("OpaqueType", id, typeParameters, supertype, impltype);
}
export { opaqueType as OpaqueType };
export function qualifiedTypeIdentifier(
  id: Identifier,
  qualification: Identifier | QualifiedTypeIdentifier
): QualifiedTypeIdentifier {
  return builder("QualifiedTypeIdentifier", id, qualification);
}
export { qualifiedTypeIdentifier as QualifiedTypeIdentifier };
export function stringLiteralTypeAnnotation(
  value: string
): StringLiteralTypeAnnotation {
  return builder("StringLiteralTypeAnnotation", value);
}
export { stringLiteralTypeAnnotation as StringLiteralTypeAnnotation };
export function stringTypeAnnotation(): StringTypeAnnotation {
  return builder("StringTypeAnnotation");
}
export { stringTypeAnnotation as StringTypeAnnotation };
export function symbolTypeAnnotation(): SymbolTypeAnnotation {
  return builder("SymbolTypeAnnotation");
}
export { symbolTypeAnnotation as SymbolTypeAnnotation };
export function thisTypeAnnotation(): ThisTypeAnnotation {
  return builder("ThisTypeAnnotation");
}
export { thisTypeAnnotation as ThisTypeAnnotation };
export function tupleTypeAnnotation(
  types: Array<FlowType>
): TupleTypeAnnotation {
  return builder("TupleTypeAnnotation", types);
}
export { tupleTypeAnnotation as TupleTypeAnnotation };
export function typeofTypeAnnotation(argument: FlowType): TypeofTypeAnnotation {
  return builder("TypeofTypeAnnotation", argument);
}
export { typeofTypeAnnotation as TypeofTypeAnnotation };
export function typeAlias(
  id: Identifier,
  typeParameters: TypeParameterDeclaration | null | undefined,
  right: FlowType
): TypeAlias {
  return builder("TypeAlias", id, typeParameters, right);
}
export { typeAlias as TypeAlias };
export function typeAnnotation(typeAnnotation: FlowType): TypeAnnotation {
  return builder("TypeAnnotation", typeAnnotation);
}
export { typeAnnotation as TypeAnnotation };
export function typeCastExpression(
  expression: Expression,
  typeAnnotation: TypeAnnotation
): TypeCastExpression {
  return builder("TypeCastExpression", expression, typeAnnotation);
}
export { typeCastExpression as TypeCastExpression };
export function typeParameter(
  bound?: TypeAnnotation | null,
  _default?: FlowType | null,
  variance?: Variance | null
): TypeParameter {
  return builder("TypeParameter", bound, _default, variance);
}
export { typeParameter as TypeParameter };
export function typeParameterDeclaration(
  params: Array<TypeParameter>
): TypeParameterDeclaration {
  return builder("TypeParameterDeclaration", params);
}
export { typeParameterDeclaration as TypeParameterDeclaration };
export function typeParameterInstantiation(
  params: Array<FlowType>
): TypeParameterInstantiation {
  return builder("TypeParameterInstantiation", params);
}
export { typeParameterInstantiation as TypeParameterInstantiation };
export function unionTypeAnnotation(
  types: Array<FlowType>
): UnionTypeAnnotation {
  return builder("UnionTypeAnnotation", types);
}
export { unionTypeAnnotation as UnionTypeAnnotation };
export function variance(kind: "minus" | "plus"): Variance {
  return builder("Variance", kind);
}
export { variance as Variance };
export function voidTypeAnnotation(): VoidTypeAnnotation {
  return builder("VoidTypeAnnotation");
}
export { voidTypeAnnotation as VoidTypeAnnotation };
export function enumDeclaration(
  id: Identifier,
  body: EnumBooleanBody | EnumNumberBody | EnumStringBody | EnumSymbolBody
): EnumDeclaration {
  return builder("EnumDeclaration", id, body);
}
export { enumDeclaration as EnumDeclaration };
export function enumBooleanBody(
  members: Array<EnumBooleanMember>
): EnumBooleanBody {
  return builder("EnumBooleanBody", members);
}
export { enumBooleanBody as EnumBooleanBody };
export function enumNumberBody(
  members: Array<EnumNumberMember>
): EnumNumberBody {
  return builder("EnumNumberBody", members);
}
export { enumNumberBody as EnumNumberBody };
export function enumStringBody(
  members: Array<EnumStringMember | EnumDefaultedMember>
): EnumStringBody {
  return builder("EnumStringBody", members);
}
export { enumStringBody as EnumStringBody };
export function enumSymbolBody(
  members: Array<EnumDefaultedMember>
): EnumSymbolBody {
  return builder("EnumSymbolBody", members);
}
export { enumSymbolBody as EnumSymbolBody };
export function enumBooleanMember(id: Identifier): EnumBooleanMember {
  return builder("EnumBooleanMember", id);
}
export { enumBooleanMember as EnumBooleanMember };
export function enumNumberMember(
  id: Identifier,
  init: NumericLiteral
): EnumNumberMember {
  return builder("EnumNumberMember", id, init);
}
export { enumNumberMember as EnumNumberMember };
export function enumStringMember(
  id: Identifier,
  init: StringLiteral
): EnumStringMember {
  return builder("EnumStringMember", id, init);
}
export { enumStringMember as EnumStringMember };
export function enumDefaultedMember(id: Identifier): EnumDefaultedMember {
  return builder("EnumDefaultedMember", id);
}
export { enumDefaultedMember as EnumDefaultedMember };
export function jsxAttribute(
  name: JSXIdentifier | JSXNamespacedName,
  value?:
    | JSXElement
    | JSXFragment
    | StringLiteral
    | JSXExpressionContainer
    | null
): JSXAttribute {
  return builder("JSXAttribute", name, value);
}
export { jsxAttribute as JSXAttribute };
export function jsxClosingElement(
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
): JSXClosingElement {
  return builder("JSXClosingElement", name);
}
export { jsxClosingElement as JSXClosingElement };
export function jsxElement(
  openingElement: JSXOpeningElement,
  closingElement: JSXClosingElement | null | undefined,
  children: Array<
    JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
  >,
  selfClosing?: boolean | null
): JSXElement {
  return builder(
    "JSXElement",
    openingElement,
    closingElement,
    children,
    selfClosing
  );
}
export { jsxElement as JSXElement };
export function jsxEmptyExpression(): JSXEmptyExpression {
  return builder("JSXEmptyExpression");
}
export { jsxEmptyExpression as JSXEmptyExpression };
export function jsxExpressionContainer(
  expression: Expression | JSXEmptyExpression
): JSXExpressionContainer {
  return builder("JSXExpressionContainer", expression);
}
export { jsxExpressionContainer as JSXExpressionContainer };
export function jsxSpreadChild(expression: Expression): JSXSpreadChild {
  return builder("JSXSpreadChild", expression);
}
export { jsxSpreadChild as JSXSpreadChild };
export function jsxIdentifier(name: string): JSXIdentifier {
  return builder("JSXIdentifier", name);
}
export { jsxIdentifier as JSXIdentifier };
export function jsxMemberExpression(
  object: JSXMemberExpression | JSXIdentifier,
  property: JSXIdentifier
): JSXMemberExpression {
  return builder("JSXMemberExpression", object, property);
}
export { jsxMemberExpression as JSXMemberExpression };
export function jsxNamespacedName(
  namespace: JSXIdentifier,
  name: JSXIdentifier
): JSXNamespacedName {
  return builder("JSXNamespacedName", namespace, name);
}
export { jsxNamespacedName as JSXNamespacedName };
export function jsxOpeningElement(
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName,
  attributes: Array<JSXAttribute | JSXSpreadAttribute>,
  selfClosing?: boolean
): JSXOpeningElement {
  return builder("JSXOpeningElement", name, attributes, selfClosing);
}
export { jsxOpeningElement as JSXOpeningElement };
export function jsxSpreadAttribute(argument: Expression): JSXSpreadAttribute {
  return builder("JSXSpreadAttribute", argument);
}
export { jsxSpreadAttribute as JSXSpreadAttribute };
export function jsxText(value: string): JSXText {
  return builder("JSXText", value);
}
export { jsxText as JSXText };
export function jsxFragment(
  openingFragment: JSXOpeningFragment,
  closingFragment: JSXClosingFragment,
  children: Array<
    JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
  >
): JSXFragment {
  return builder("JSXFragment", openingFragment, closingFragment, children);
}
export { jsxFragment as JSXFragment };
export function jsxOpeningFragment(): JSXOpeningFragment {
  return builder("JSXOpeningFragment");
}
export { jsxOpeningFragment as JSXOpeningFragment };
export function jsxClosingFragment(): JSXClosingFragment {
  return builder("JSXClosingFragment");
}
export { jsxClosingFragment as JSXClosingFragment };
export function noop(): Noop {
  return builder("Noop");
}
export { noop as Noop };
export function placeholder(
  expectedNode:
    | "Identifier"
    | "StringLiteral"
    | "Expression"
    | "Statement"
    | "Declaration"
    | "BlockStatement"
    | "ClassBody"
    | "Pattern",
  name: Identifier
): Placeholder {
  return builder("Placeholder", expectedNode, name);
}
export { placeholder as Placeholder };
export function v8IntrinsicIdentifier(name: string): V8IntrinsicIdentifier {
  return builder("V8IntrinsicIdentifier", name);
}
export { v8IntrinsicIdentifier as V8IntrinsicIdentifier };
export function argumentPlaceholder(): ArgumentPlaceholder {
  return builder("ArgumentPlaceholder");
}
export { argumentPlaceholder as ArgumentPlaceholder };
export function bindExpression(
  object: Expression,
  callee: Expression
): BindExpression {
  return builder("BindExpression", object, callee);
}
export { bindExpression as BindExpression };
export function classProperty(
  key: Identifier | StringLiteral | NumericLiteral | Expression,
  value?: Expression | null,
  typeAnnotation?: TypeAnnotation | TSTypeAnnotation | Noop | null,
  decorators?: Array<Decorator> | null,
  computed?: boolean,
  _static?: boolean
): ClassProperty {
  return builder(
    "ClassProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    _static
  );
}
export { classProperty as ClassProperty };
export function pipelineTopicExpression(
  expression: Expression
): PipelineTopicExpression {
  return builder("PipelineTopicExpression", expression);
}
export { pipelineTopicExpression as PipelineTopicExpression };
export function pipelineBareFunction(callee: Expression): PipelineBareFunction {
  return builder("PipelineBareFunction", callee);
}
export { pipelineBareFunction as PipelineBareFunction };
export function pipelinePrimaryTopicReference(): PipelinePrimaryTopicReference {
  return builder("PipelinePrimaryTopicReference");
}
export { pipelinePrimaryTopicReference as PipelinePrimaryTopicReference };
export function classPrivateProperty(
  key: PrivateName,
  value?: Expression | null,
  decorators?: Array<Decorator> | null
): ClassPrivateProperty {
  return builder("ClassPrivateProperty", key, value, decorators);
}
export { classPrivateProperty as ClassPrivateProperty };
export function classPrivateMethod(
  kind: "get" | "set" | "method" | "constructor" | undefined,
  key: PrivateName,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  body: BlockStatement,
  _static?: boolean
): ClassPrivateMethod {
  return builder("ClassPrivateMethod", kind, key, params, body, _static);
}
export { classPrivateMethod as ClassPrivateMethod };
export function importAttribute(
  key: Identifier,
  value: StringLiteral
): ImportAttribute {
  return builder("ImportAttribute", key, value);
}
export { importAttribute as ImportAttribute };
export function decorator(expression: Expression): Decorator {
  return builder("Decorator", expression);
}
export { decorator as Decorator };
export function doExpression(body: BlockStatement): DoExpression {
  return builder("DoExpression", body);
}
export { doExpression as DoExpression };
export function exportDefaultSpecifier(
  exported: Identifier
): ExportDefaultSpecifier {
  return builder("ExportDefaultSpecifier", exported);
}
export { exportDefaultSpecifier as ExportDefaultSpecifier };
export function privateName(id: Identifier): PrivateName {
  return builder("PrivateName", id);
}
export { privateName as PrivateName };
export function recordExpression(
  properties: Array<ObjectProperty | SpreadElement>
): RecordExpression {
  return builder("RecordExpression", properties);
}
export { recordExpression as RecordExpression };
export function tupleExpression(
  elements?: Array<Expression | SpreadElement>
): TupleExpression {
  return builder("TupleExpression", elements);
}
export { tupleExpression as TupleExpression };
export function decimalLiteral(value: string): DecimalLiteral {
  return builder("DecimalLiteral", value);
}
export { decimalLiteral as DecimalLiteral };
export function tsParameterProperty(
  parameter: Identifier | AssignmentPattern
): TSParameterProperty {
  return builder("TSParameterProperty", parameter);
}
export { tsParameterProperty as TSParameterProperty };
export { tsParameterProperty as tSParameterProperty };
export function tsDeclareFunction(
  id: Identifier | null | undefined,
  typeParameters: TSTypeParameterDeclaration | Noop | null | undefined,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  returnType?: TSTypeAnnotation | Noop | null
): TSDeclareFunction {
  return builder("TSDeclareFunction", id, typeParameters, params, returnType);
}
export { tsDeclareFunction as TSDeclareFunction };
export { tsDeclareFunction as tSDeclareFunction };
export function tsDeclareMethod(
  decorators: Array<Decorator> | null | undefined,
  key: Identifier | StringLiteral | NumericLiteral | Expression,
  typeParameters: TSTypeParameterDeclaration | Noop | null | undefined,
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
  returnType?: TSTypeAnnotation | Noop | null
): TSDeclareMethod {
  return builder(
    "TSDeclareMethod",
    decorators,
    key,
    typeParameters,
    params,
    returnType
  );
}
export { tsDeclareMethod as TSDeclareMethod };
export { tsDeclareMethod as tSDeclareMethod };
export function tsQualifiedName(
  left: TSEntityName,
  right: Identifier
): TSQualifiedName {
  return builder("TSQualifiedName", left, right);
}
export { tsQualifiedName as TSQualifiedName };
export { tsQualifiedName as tSQualifiedName };
export function tsCallSignatureDeclaration(
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  parameters: Array<Identifier | RestElement>,
  typeAnnotation?: TSTypeAnnotation | null
): TSCallSignatureDeclaration {
  return builder(
    "TSCallSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  );
}
export { tsCallSignatureDeclaration as TSCallSignatureDeclaration };
export { tsCallSignatureDeclaration as tSCallSignatureDeclaration };
export function tsConstructSignatureDeclaration(
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  parameters: Array<Identifier | RestElement>,
  typeAnnotation?: TSTypeAnnotation | null
): TSConstructSignatureDeclaration {
  return builder(
    "TSConstructSignatureDeclaration",
    typeParameters,
    parameters,
    typeAnnotation
  );
}
export { tsConstructSignatureDeclaration as TSConstructSignatureDeclaration };
export { tsConstructSignatureDeclaration as tSConstructSignatureDeclaration };
export function tsPropertySignature(
  key: Expression,
  typeAnnotation?: TSTypeAnnotation | null,
  initializer?: Expression | null
): TSPropertySignature {
  return builder("TSPropertySignature", key, typeAnnotation, initializer);
}
export { tsPropertySignature as TSPropertySignature };
export { tsPropertySignature as tSPropertySignature };
export function tsMethodSignature(
  key: Expression,
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  parameters: Array<Identifier | RestElement>,
  typeAnnotation?: TSTypeAnnotation | null
): TSMethodSignature {
  return builder(
    "TSMethodSignature",
    key,
    typeParameters,
    parameters,
    typeAnnotation
  );
}
export { tsMethodSignature as TSMethodSignature };
export { tsMethodSignature as tSMethodSignature };
export function tsIndexSignature(
  parameters: Array<Identifier>,
  typeAnnotation?: TSTypeAnnotation | null
): TSIndexSignature {
  return builder("TSIndexSignature", parameters, typeAnnotation);
}
export { tsIndexSignature as TSIndexSignature };
export { tsIndexSignature as tSIndexSignature };
export function tsAnyKeyword(): TSAnyKeyword {
  return builder("TSAnyKeyword");
}
export { tsAnyKeyword as TSAnyKeyword };
export { tsAnyKeyword as tSAnyKeyword };
export function tsBooleanKeyword(): TSBooleanKeyword {
  return builder("TSBooleanKeyword");
}
export { tsBooleanKeyword as TSBooleanKeyword };
export { tsBooleanKeyword as tSBooleanKeyword };
export function tsBigIntKeyword(): TSBigIntKeyword {
  return builder("TSBigIntKeyword");
}
export { tsBigIntKeyword as TSBigIntKeyword };
export { tsBigIntKeyword as tSBigIntKeyword };
export function tsNeverKeyword(): TSNeverKeyword {
  return builder("TSNeverKeyword");
}
export { tsNeverKeyword as TSNeverKeyword };
export { tsNeverKeyword as tSNeverKeyword };
export function tsNullKeyword(): TSNullKeyword {
  return builder("TSNullKeyword");
}
export { tsNullKeyword as TSNullKeyword };
export { tsNullKeyword as tSNullKeyword };
export function tsNumberKeyword(): TSNumberKeyword {
  return builder("TSNumberKeyword");
}
export { tsNumberKeyword as TSNumberKeyword };
export { tsNumberKeyword as tSNumberKeyword };
export function tsObjectKeyword(): TSObjectKeyword {
  return builder("TSObjectKeyword");
}
export { tsObjectKeyword as TSObjectKeyword };
export { tsObjectKeyword as tSObjectKeyword };
export function tsStringKeyword(): TSStringKeyword {
  return builder("TSStringKeyword");
}
export { tsStringKeyword as TSStringKeyword };
export { tsStringKeyword as tSStringKeyword };
export function tsSymbolKeyword(): TSSymbolKeyword {
  return builder("TSSymbolKeyword");
}
export { tsSymbolKeyword as TSSymbolKeyword };
export { tsSymbolKeyword as tSSymbolKeyword };
export function tsUndefinedKeyword(): TSUndefinedKeyword {
  return builder("TSUndefinedKeyword");
}
export { tsUndefinedKeyword as TSUndefinedKeyword };
export { tsUndefinedKeyword as tSUndefinedKeyword };
export function tsUnknownKeyword(): TSUnknownKeyword {
  return builder("TSUnknownKeyword");
}
export { tsUnknownKeyword as TSUnknownKeyword };
export { tsUnknownKeyword as tSUnknownKeyword };
export function tsVoidKeyword(): TSVoidKeyword {
  return builder("TSVoidKeyword");
}
export { tsVoidKeyword as TSVoidKeyword };
export { tsVoidKeyword as tSVoidKeyword };
export function tsThisType(): TSThisType {
  return builder("TSThisType");
}
export { tsThisType as TSThisType };
export { tsThisType as tSThisType };
export function tsFunctionType(
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  parameters: Array<Identifier | RestElement>,
  typeAnnotation?: TSTypeAnnotation | null
): TSFunctionType {
  return builder("TSFunctionType", typeParameters, parameters, typeAnnotation);
}
export { tsFunctionType as TSFunctionType };
export { tsFunctionType as tSFunctionType };
export function tsConstructorType(
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  parameters: Array<Identifier | RestElement>,
  typeAnnotation?: TSTypeAnnotation | null
): TSConstructorType {
  return builder(
    "TSConstructorType",
    typeParameters,
    parameters,
    typeAnnotation
  );
}
export { tsConstructorType as TSConstructorType };
export { tsConstructorType as tSConstructorType };
export function tsTypeReference(
  typeName: TSEntityName,
  typeParameters?: TSTypeParameterInstantiation | null
): TSTypeReference {
  return builder("TSTypeReference", typeName, typeParameters);
}
export { tsTypeReference as TSTypeReference };
export { tsTypeReference as tSTypeReference };
export function tsTypePredicate(
  parameterName: Identifier | TSThisType,
  typeAnnotation?: TSTypeAnnotation | null,
  asserts?: boolean | null
): TSTypePredicate {
  return builder("TSTypePredicate", parameterName, typeAnnotation, asserts);
}
export { tsTypePredicate as TSTypePredicate };
export { tsTypePredicate as tSTypePredicate };
export function tsTypeQuery(
  exprName: TSEntityName | TSImportType
): TSTypeQuery {
  return builder("TSTypeQuery", exprName);
}
export { tsTypeQuery as TSTypeQuery };
export { tsTypeQuery as tSTypeQuery };
export function tsTypeLiteral(members: Array<TSTypeElement>): TSTypeLiteral {
  return builder("TSTypeLiteral", members);
}
export { tsTypeLiteral as TSTypeLiteral };
export { tsTypeLiteral as tSTypeLiteral };
export function tsArrayType(elementType: TSType): TSArrayType {
  return builder("TSArrayType", elementType);
}
export { tsArrayType as TSArrayType };
export { tsArrayType as tSArrayType };
export function tsTupleType(
  elementTypes: Array<TSType | TSNamedTupleMember>
): TSTupleType {
  return builder("TSTupleType", elementTypes);
}
export { tsTupleType as TSTupleType };
export { tsTupleType as tSTupleType };
export function tsOptionalType(typeAnnotation: TSType): TSOptionalType {
  return builder("TSOptionalType", typeAnnotation);
}
export { tsOptionalType as TSOptionalType };
export { tsOptionalType as tSOptionalType };
export function tsRestType(typeAnnotation: TSType): TSRestType {
  return builder("TSRestType", typeAnnotation);
}
export { tsRestType as TSRestType };
export { tsRestType as tSRestType };
export function tsNamedTupleMember(
  label: Identifier,
  elementType: TSType,
  optional?: boolean
): TSNamedTupleMember {
  return builder("TSNamedTupleMember", label, elementType, optional);
}
export { tsNamedTupleMember as TSNamedTupleMember };
export { tsNamedTupleMember as tSNamedTupleMember };
export function tsUnionType(types: Array<TSType>): TSUnionType {
  return builder("TSUnionType", types);
}
export { tsUnionType as TSUnionType };
export { tsUnionType as tSUnionType };
export function tsIntersectionType(types: Array<TSType>): TSIntersectionType {
  return builder("TSIntersectionType", types);
}
export { tsIntersectionType as TSIntersectionType };
export { tsIntersectionType as tSIntersectionType };
export function tsConditionalType(
  checkType: TSType,
  extendsType: TSType,
  trueType: TSType,
  falseType: TSType
): TSConditionalType {
  return builder(
    "TSConditionalType",
    checkType,
    extendsType,
    trueType,
    falseType
  );
}
export { tsConditionalType as TSConditionalType };
export { tsConditionalType as tSConditionalType };
export function tsInferType(typeParameter: TSTypeParameter): TSInferType {
  return builder("TSInferType", typeParameter);
}
export { tsInferType as TSInferType };
export { tsInferType as tSInferType };
export function tsParenthesizedType(
  typeAnnotation: TSType
): TSParenthesizedType {
  return builder("TSParenthesizedType", typeAnnotation);
}
export { tsParenthesizedType as TSParenthesizedType };
export { tsParenthesizedType as tSParenthesizedType };
export function tsTypeOperator(typeAnnotation: TSType): TSTypeOperator {
  return builder("TSTypeOperator", typeAnnotation);
}
export { tsTypeOperator as TSTypeOperator };
export { tsTypeOperator as tSTypeOperator };
export function tsIndexedAccessType(
  objectType: TSType,
  indexType: TSType
): TSIndexedAccessType {
  return builder("TSIndexedAccessType", objectType, indexType);
}
export { tsIndexedAccessType as TSIndexedAccessType };
export { tsIndexedAccessType as tSIndexedAccessType };
export function tsMappedType(
  typeParameter: TSTypeParameter,
  typeAnnotation?: TSType | null
): TSMappedType {
  return builder("TSMappedType", typeParameter, typeAnnotation);
}
export { tsMappedType as TSMappedType };
export { tsMappedType as tSMappedType };
export function tsLiteralType(
  literal: NumericLiteral | StringLiteral | BooleanLiteral | BigIntLiteral
): TSLiteralType {
  return builder("TSLiteralType", literal);
}
export { tsLiteralType as TSLiteralType };
export { tsLiteralType as tSLiteralType };
export function tsExpressionWithTypeArguments(
  expression: TSEntityName,
  typeParameters?: TSTypeParameterInstantiation | null
): TSExpressionWithTypeArguments {
  return builder("TSExpressionWithTypeArguments", expression, typeParameters);
}
export { tsExpressionWithTypeArguments as TSExpressionWithTypeArguments };
export { tsExpressionWithTypeArguments as tSExpressionWithTypeArguments };
export function tsInterfaceDeclaration(
  id: Identifier,
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  _extends: Array<TSExpressionWithTypeArguments> | null | undefined,
  body: TSInterfaceBody
): TSInterfaceDeclaration {
  return builder("TSInterfaceDeclaration", id, typeParameters, _extends, body);
}
export { tsInterfaceDeclaration as TSInterfaceDeclaration };
export { tsInterfaceDeclaration as tSInterfaceDeclaration };
export function tsInterfaceBody(body: Array<TSTypeElement>): TSInterfaceBody {
  return builder("TSInterfaceBody", body);
}
export { tsInterfaceBody as TSInterfaceBody };
export { tsInterfaceBody as tSInterfaceBody };
export function tsTypeAliasDeclaration(
  id: Identifier,
  typeParameters: TSTypeParameterDeclaration | null | undefined,
  typeAnnotation: TSType
): TSTypeAliasDeclaration {
  return builder("TSTypeAliasDeclaration", id, typeParameters, typeAnnotation);
}
export { tsTypeAliasDeclaration as TSTypeAliasDeclaration };
export { tsTypeAliasDeclaration as tSTypeAliasDeclaration };
export function tsAsExpression(
  expression: Expression,
  typeAnnotation: TSType
): TSAsExpression {
  return builder("TSAsExpression", expression, typeAnnotation);
}
export { tsAsExpression as TSAsExpression };
export { tsAsExpression as tSAsExpression };
export function tsTypeAssertion(
  typeAnnotation: TSType,
  expression: Expression
): TSTypeAssertion {
  return builder("TSTypeAssertion", typeAnnotation, expression);
}
export { tsTypeAssertion as TSTypeAssertion };
export { tsTypeAssertion as tSTypeAssertion };
export function tsEnumDeclaration(
  id: Identifier,
  members: Array<TSEnumMember>
): TSEnumDeclaration {
  return builder("TSEnumDeclaration", id, members);
}
export { tsEnumDeclaration as TSEnumDeclaration };
export { tsEnumDeclaration as tSEnumDeclaration };
export function tsEnumMember(
  id: Identifier | StringLiteral,
  initializer?: Expression | null
): TSEnumMember {
  return builder("TSEnumMember", id, initializer);
}
export { tsEnumMember as TSEnumMember };
export { tsEnumMember as tSEnumMember };
export function tsModuleDeclaration(
  id: Identifier | StringLiteral,
  body: TSModuleBlock | TSModuleDeclaration
): TSModuleDeclaration {
  return builder("TSModuleDeclaration", id, body);
}
export { tsModuleDeclaration as TSModuleDeclaration };
export { tsModuleDeclaration as tSModuleDeclaration };
export function tsModuleBlock(body: Array<Statement>): TSModuleBlock {
  return builder("TSModuleBlock", body);
}
export { tsModuleBlock as TSModuleBlock };
export { tsModuleBlock as tSModuleBlock };
export function tsImportType(
  argument: StringLiteral,
  qualifier?: TSEntityName | null,
  typeParameters?: TSTypeParameterInstantiation | null
): TSImportType {
  return builder("TSImportType", argument, qualifier, typeParameters);
}
export { tsImportType as TSImportType };
export { tsImportType as tSImportType };
export function tsImportEqualsDeclaration(
  id: Identifier,
  moduleReference: TSEntityName | TSExternalModuleReference
): TSImportEqualsDeclaration {
  return builder("TSImportEqualsDeclaration", id, moduleReference);
}
export { tsImportEqualsDeclaration as TSImportEqualsDeclaration };
export { tsImportEqualsDeclaration as tSImportEqualsDeclaration };
export function tsExternalModuleReference(
  expression: StringLiteral
): TSExternalModuleReference {
  return builder("TSExternalModuleReference", expression);
}
export { tsExternalModuleReference as TSExternalModuleReference };
export { tsExternalModuleReference as tSExternalModuleReference };
export function tsNonNullExpression(
  expression: Expression
): TSNonNullExpression {
  return builder("TSNonNullExpression", expression);
}
export { tsNonNullExpression as TSNonNullExpression };
export { tsNonNullExpression as tSNonNullExpression };
export function tsExportAssignment(expression: Expression): TSExportAssignment {
  return builder("TSExportAssignment", expression);
}
export { tsExportAssignment as TSExportAssignment };
export { tsExportAssignment as tSExportAssignment };
export function tsNamespaceExportDeclaration(
  id: Identifier
): TSNamespaceExportDeclaration {
  return builder("TSNamespaceExportDeclaration", id);
}
export { tsNamespaceExportDeclaration as TSNamespaceExportDeclaration };
export { tsNamespaceExportDeclaration as tSNamespaceExportDeclaration };
export function tsTypeAnnotation(typeAnnotation: TSType): TSTypeAnnotation {
  return builder("TSTypeAnnotation", typeAnnotation);
}
export { tsTypeAnnotation as TSTypeAnnotation };
export { tsTypeAnnotation as tSTypeAnnotation };
export function tsTypeParameterInstantiation(
  params: Array<TSType>
): TSTypeParameterInstantiation {
  return builder("TSTypeParameterInstantiation", params);
}
export { tsTypeParameterInstantiation as TSTypeParameterInstantiation };
export { tsTypeParameterInstantiation as tSTypeParameterInstantiation };
export function tsTypeParameterDeclaration(
  params: Array<TSTypeParameter>
): TSTypeParameterDeclaration {
  return builder("TSTypeParameterDeclaration", params);
}
export { tsTypeParameterDeclaration as TSTypeParameterDeclaration };
export { tsTypeParameterDeclaration as tSTypeParameterDeclaration };
export function tsTypeParameter(
  constraint: TSType | null | undefined,
  _default: TSType | null | undefined,
  name: string
): TSTypeParameter {
  return builder("TSTypeParameter", constraint, _default, name);
}
export { tsTypeParameter as TSTypeParameter };
export { tsTypeParameter as tSTypeParameter };
export function NumberLiteral(value: number): NumericLiteral {
  console.trace(
    "The node type NumberLiteral has been renamed to NumericLiteral"
  );
  return builder("NumericLiteral", value);
}
export { NumberLiteral as numberLiteral };
export function RegexLiteral(pattern: string, flags?: string): RegExpLiteral {
  console.trace("The node type RegexLiteral has been renamed to RegExpLiteral");
  return builder("RegExpLiteral", pattern, flags);
}
export { RegexLiteral as regexLiteral };
export function RestProperty(argument: LVal): RestElement {
  console.trace("The node type RestProperty has been renamed to RestElement");
  return builder("RestElement", argument);
}
export { RestProperty as restProperty };
export function SpreadProperty(argument: Expression): SpreadElement {
  console.trace(
    "The node type SpreadProperty has been renamed to SpreadElement"
  );
  return builder("SpreadElement", argument);
}
export { SpreadProperty as spreadProperty };
