/* eslint-disable @typescript-eslint/no-explicit-any */
import { BLOCK_SCOPED_SYMBOL } from "./constants";

interface BaseComment {
  value: string;
  start?: number;
  end?: number;
  loc: SourceLocation | null;
  type: "CommentBlock" | "CommentLine";
}

export interface CommentBlock extends BaseComment {
  type: "CommentBlock";
}

export interface CommentLine extends BaseComment {
  type: "CommentLine";
}

export type Comment = CommentBlock | CommentLine;

export interface SourceLocation {
  start: {
    line: number;
    column: number;
  };

  end: {
    line: number;
    column: number;
  };
}

export type CommentPropertyKeys =
  | "leadingComments"
  | "innerComments"
  | "trailingComments";

export interface BaseNode {
  leadingComments: Array<Comment> | null;
  innerComments: Array<Comment> | null;
  trailingComments: Array<Comment> | null;
  start: number | null;
  end: number | null;
  loc: SourceLocation | null;
  type: Node["type"];
}

export type Node =
  | AnyTypeAnnotation
  | ArgumentPlaceholder
  | ArrayExpression
  | ArrayPattern
  | ArrayTypeAnnotation
  | ArrowFunctionExpression
  | AssignmentExpression
  | AssignmentPattern
  | AwaitExpression
  | BigIntLiteral
  | Binary
  | BinaryExpression
  | BindExpression
  | Block
  | BlockParent
  | BlockStatement
  | BooleanLiteral
  | BooleanLiteralTypeAnnotation
  | BooleanTypeAnnotation
  | BreakStatement
  | CallExpression
  | CatchClause
  | Class
  | ClassBody
  | ClassDeclaration
  | ClassExpression
  | ClassImplements
  | ClassMethod
  | ClassPrivateMethod
  | ClassPrivateProperty
  | ClassProperty
  | CompletionStatement
  | Conditional
  | ConditionalExpression
  | ContinueStatement
  | DebuggerStatement
  | DecimalLiteral
  | Declaration
  | DeclareClass
  | DeclareExportAllDeclaration
  | DeclareExportDeclaration
  | DeclareFunction
  | DeclareInterface
  | DeclareModule
  | DeclareModuleExports
  | DeclareOpaqueType
  | DeclareTypeAlias
  | DeclareVariable
  | DeclaredPredicate
  | Decorator
  | Directive
  | DirectiveLiteral
  | DoExpression
  | DoWhileStatement
  | EmptyStatement
  | EmptyTypeAnnotation
  | EnumBody
  | EnumBooleanBody
  | EnumBooleanMember
  | EnumDeclaration
  | EnumDefaultedMember
  | EnumMember
  | EnumNumberBody
  | EnumNumberMember
  | EnumStringBody
  | EnumStringMember
  | EnumSymbolBody
  | ExistsTypeAnnotation
  | ExportAllDeclaration
  | ExportDeclaration
  | ExportDefaultDeclaration
  | ExportDefaultSpecifier
  | ExportNamedDeclaration
  | ExportNamespaceSpecifier
  | ExportSpecifier
  | Expression
  | ExpressionStatement
  | ExpressionWrapper
  | File
  | Flow
  | FlowBaseAnnotation
  | FlowDeclaration
  | FlowPredicate
  | FlowType
  | For
  | ForInStatement
  | ForOfStatement
  | ForStatement
  | ForXStatement
  | Function
  | FunctionDeclaration
  | FunctionExpression
  | FunctionParent
  | FunctionTypeAnnotation
  | FunctionTypeParam
  | GenericTypeAnnotation
  | Identifier
  | IfStatement
  | Immutable
  | Import
  | ImportAttribute
  | ImportDeclaration
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | InferredPredicate
  | InterfaceDeclaration
  | InterfaceExtends
  | InterfaceTypeAnnotation
  | InterpreterDirective
  | IntersectionTypeAnnotation
  | JSX
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXText
  | LVal
  | LabeledStatement
  | Literal
  | LogicalExpression
  | Loop
  | MemberExpression
  | MetaProperty
  | Method
  | MixedTypeAnnotation
  | ModuleDeclaration
  | ModuleSpecifier
  | NewExpression
  | Noop
  | NullLiteral
  | NullLiteralTypeAnnotation
  | NullableTypeAnnotation
  | NumberLiteral
  | NumberLiteralTypeAnnotation
  | NumberTypeAnnotation
  | NumericLiteral
  | ObjectExpression
  | ObjectMember
  | ObjectMethod
  | ObjectPattern
  | ObjectProperty
  | ObjectTypeAnnotation
  | ObjectTypeCallProperty
  | ObjectTypeIndexer
  | ObjectTypeInternalSlot
  | ObjectTypeProperty
  | ObjectTypeSpreadProperty
  | OpaqueType
  | OptionalCallExpression
  | OptionalMemberExpression
  | ParenthesizedExpression
  | Pattern
  | PatternLike
  | PipelineBareFunction
  | PipelinePrimaryTopicReference
  | PipelineTopicExpression
  | Placeholder
  | Private
  | PrivateName
  | Program
  | Property
  | Pureish
  | QualifiedTypeIdentifier
  | RecordExpression
  | RegExpLiteral
  | RegexLiteral
  | RestElement
  | RestProperty
  | ReturnStatement
  | Scopable
  | SequenceExpression
  | SpreadElement
  | SpreadProperty
  | Statement
  | StringLiteral
  | StringLiteralTypeAnnotation
  | StringTypeAnnotation
  | Super
  | SwitchCase
  | SwitchStatement
  | SymbolTypeAnnotation
  | TSAnyKeyword
  | TSArrayType
  | TSAsExpression
  | TSBaseType
  | TSBigIntKeyword
  | TSBooleanKeyword
  | TSCallSignatureDeclaration
  | TSConditionalType
  | TSConstructSignatureDeclaration
  | TSConstructorType
  | TSDeclareFunction
  | TSDeclareMethod
  | TSEntityName
  | TSEnumDeclaration
  | TSEnumMember
  | TSExportAssignment
  | TSExpressionWithTypeArguments
  | TSExternalModuleReference
  | TSFunctionType
  | TSImportEqualsDeclaration
  | TSImportType
  | TSIndexSignature
  | TSIndexedAccessType
  | TSInferType
  | TSInterfaceBody
  | TSInterfaceDeclaration
  | TSIntersectionType
  | TSLiteralType
  | TSMappedType
  | TSMethodSignature
  | TSModuleBlock
  | TSModuleDeclaration
  | TSNamedTupleMember
  | TSNamespaceExportDeclaration
  | TSNeverKeyword
  | TSNonNullExpression
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSOptionalType
  | TSParameterProperty
  | TSParenthesizedType
  | TSPropertySignature
  | TSQualifiedName
  | TSRestType
  | TSStringKeyword
  | TSSymbolKeyword
  | TSThisType
  | TSTupleType
  | TSType
  | TSTypeAliasDeclaration
  | TSTypeAnnotation
  | TSTypeAssertion
  | TSTypeElement
  | TSTypeLiteral
  | TSTypeOperator
  | TSTypeParameter
  | TSTypeParameterDeclaration
  | TSTypeParameterInstantiation
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeReference
  | TSUndefinedKeyword
  | TSUnionType
  | TSUnknownKeyword
  | TSVoidKeyword
  | TaggedTemplateExpression
  | TemplateElement
  | TemplateLiteral
  | Terminatorless
  | ThisExpression
  | ThisTypeAnnotation
  | ThrowStatement
  | TryStatement
  | TupleExpression
  | TupleTypeAnnotation
  | TypeAlias
  | TypeAnnotation
  | TypeCastExpression
  | TypeParameter
  | TypeParameterDeclaration
  | TypeParameterInstantiation
  | TypeofTypeAnnotation
  | UnaryExpression
  | UnaryLike
  | UnionTypeAnnotation
  | UpdateExpression
  | UserWhitespacable
  | V8IntrinsicIdentifier
  | VariableDeclaration
  | VariableDeclarator
  | Variance
  | VoidTypeAnnotation
  | While
  | WhileStatement
  | WithStatement
  | YieldExpression;

export interface ArrayExpression extends BaseNode {
  type: "ArrayExpression";
  elements: Array<null | Expression | SpreadElement>;
}

export interface AssignmentExpression extends BaseNode {
  type: "AssignmentExpression";
  operator: string;
  left: LVal;
  right: Expression;
}

export interface BinaryExpression extends BaseNode {
  type: "BinaryExpression";
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
    | "<=";
  left: Expression | PrivateName;
  right: Expression;
}

export interface InterpreterDirective extends BaseNode {
  type: "InterpreterDirective";
  value: string;
}

export interface Directive extends BaseNode {
  type: "Directive";
  value: DirectiveLiteral;
}

export interface DirectiveLiteral extends BaseNode {
  type: "DirectiveLiteral";
  value: string;
}

export interface BlockStatement extends BaseNode {
  type: "BlockStatement";
  body: Array<Statement>;
  directives: Array<Directive>;
}

export interface BreakStatement extends BaseNode {
  type: "BreakStatement";
  label: Identifier | null;
}

export interface CallExpression extends BaseNode {
  type: "CallExpression";
  callee: Expression | V8IntrinsicIdentifier;
  arguments: Array<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >;
  optional: true | false | null;
  typeArguments: TypeParameterInstantiation | null;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface CatchClause extends BaseNode {
  type: "CatchClause";
  param: Identifier | ArrayPattern | ObjectPattern | null;
  body: BlockStatement;
}

export interface ConditionalExpression extends BaseNode {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
}

export interface ContinueStatement extends BaseNode {
  type: "ContinueStatement";
  label: Identifier | null;
}

export interface DebuggerStatement extends BaseNode {
  type: "DebuggerStatement";
}

export interface DoWhileStatement extends BaseNode {
  type: "DoWhileStatement";
  test: Expression;
  body: Statement;
}

export interface EmptyStatement extends BaseNode {
  type: "EmptyStatement";
}

export interface ExpressionStatement extends BaseNode {
  type: "ExpressionStatement";
  expression: Expression;
}

export interface File extends BaseNode {
  type: "File";
  program: Program;
  comments: Array<CommentBlock | CommentLine> | null;
  tokens: Array<any> | null;
}

export interface ForInStatement extends BaseNode {
  type: "ForInStatement";
  left: VariableDeclaration | LVal;
  right: Expression;
  body: Statement;
}

export interface ForStatement extends BaseNode {
  type: "ForStatement";
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
}

export interface FunctionDeclaration extends BaseNode {
  type: "FunctionDeclaration";
  id: Identifier | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  declare: boolean | null;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface FunctionExpression extends BaseNode {
  type: "FunctionExpression";
  id: Identifier | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  generator: boolean;
  async: boolean;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
  decorators: Array<Decorator> | null;
  optional: boolean | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface IfStatement extends BaseNode {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
}

export interface LabeledStatement extends BaseNode {
  type: "LabeledStatement";
  label: Identifier;
  body: Statement;
}

export interface StringLiteral extends BaseNode {
  type: "StringLiteral";
  value: string;
}

export interface NumericLiteral extends BaseNode {
  type: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends BaseNode {
  type: "NullLiteral";
}

export interface BooleanLiteral extends BaseNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface RegExpLiteral extends BaseNode {
  type: "RegExpLiteral";
  pattern: string;
  flags: string;
}

export interface LogicalExpression extends BaseNode {
  type: "LogicalExpression";
  operator: "||" | "&&" | "??";
  left: Expression;
  right: Expression;
}

export interface MemberExpression extends BaseNode {
  type: "MemberExpression";
  object: Expression;
  property: Expression | Identifier | PrivateName;
  computed: boolean;
  optional: true | false | null;
}

export interface NewExpression extends BaseNode {
  type: "NewExpression";
  callee: Expression | V8IntrinsicIdentifier;
  arguments: Array<
    Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
  >;
  optional: true | false | null;
  typeArguments: TypeParameterInstantiation | null;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface Program extends BaseNode {
  type: "Program";
  body: Array<Statement>;
  directives: Array<Directive>;
  sourceType: "script" | "module";
  interpreter: InterpreterDirective | null;
  sourceFile: string;
}

export interface ObjectExpression extends BaseNode {
  type: "ObjectExpression";
  properties: Array<ObjectMethod | ObjectProperty | SpreadElement>;
}

export interface ObjectMethod extends BaseNode {
  type: "ObjectMethod";
  kind: "method" | "get" | "set";
  key: Expression | Identifier | StringLiteral | NumericLiteral;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  computed: boolean;
  generator: boolean;
  async: boolean;
  decorators: Array<Decorator> | null;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ObjectProperty extends BaseNode {
  type: "ObjectProperty";
  key: Expression | Identifier | StringLiteral | NumericLiteral;
  value: Expression | PatternLike;
  computed: boolean;
  shorthand: boolean;
  decorators: Array<Decorator> | null;
}

export interface RestElement extends BaseNode {
  type: "RestElement";
  argument: LVal;
  decorators: Array<Decorator> | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface ReturnStatement extends BaseNode {
  type: "ReturnStatement";
  argument: Expression | null;
}

export interface SequenceExpression extends BaseNode {
  type: "SequenceExpression";
  expressions: Array<Expression>;
}

export interface ParenthesizedExpression extends BaseNode {
  type: "ParenthesizedExpression";
  expression: Expression;
}

export interface SwitchCase extends BaseNode {
  type: "SwitchCase";
  test: Expression | null;
  consequent: Array<Statement>;
}

export interface SwitchStatement extends BaseNode {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: Array<SwitchCase>;
}

export interface ThisExpression extends BaseNode {
  type: "ThisExpression";
}

export interface ThrowStatement extends BaseNode {
  type: "ThrowStatement";
  argument: Expression;
}

export interface TryStatement extends BaseNode {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
}

export interface UnaryExpression extends BaseNode {
  type: "UnaryExpression";
  operator: "void" | "throw" | "delete" | "!" | "+" | "-" | "~" | "typeof";
  argument: Expression;
  prefix: boolean;
}

export interface UpdateExpression extends BaseNode {
  type: "UpdateExpression";
  operator: "++" | "--";
  argument: Expression;
  prefix: boolean;
}

export interface VariableDeclaration extends BaseNode {
  type: "VariableDeclaration";
  kind: "var" | "let" | "const";
  declarations: Array<VariableDeclarator>;
  declare: boolean | null;
  [BLOCK_SCOPED_SYMBOL]?: boolean;
}

export interface VariableDeclarator extends BaseNode {
  type: "VariableDeclarator";
  id: LVal;
  init: Expression | null;
  definite: boolean | null;
}

export interface WhileStatement extends BaseNode {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
}

export interface WithStatement extends BaseNode {
  type: "WithStatement";
  object: Expression;
  body: Statement;
}

export interface AssignmentPattern extends BaseNode {
  type: "AssignmentPattern";
  left: Identifier | ObjectPattern | ArrayPattern | MemberExpression;
  right: Expression;
  decorators: Array<Decorator> | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface ArrayPattern extends BaseNode {
  type: "ArrayPattern";
  elements: Array<null | PatternLike>;
  decorators: Array<Decorator> | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface ArrowFunctionExpression extends BaseNode {
  type: "ArrowFunctionExpression";
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement | Expression;
  async: boolean;
  expression: boolean;
  generator: boolean;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ClassBody extends BaseNode {
  type: "ClassBody";
  body: Array<
    | ClassMethod
    | ClassPrivateMethod
    | ClassProperty
    | ClassPrivateProperty
    | TSDeclareMethod
    | TSIndexSignature
  >;
}

export interface ClassExpression extends BaseNode {
  type: "ClassExpression";
  id: Identifier | null;
  superClass: Expression | null;
  body: ClassBody;
  decorators: Array<Decorator> | null;
  implements: Array<TSExpressionWithTypeArguments | ClassImplements> | null;
  mixins: InterfaceExtends | null;
  superTypeParameters:
    | TypeParameterInstantiation
    | TSTypeParameterInstantiation
    | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ClassDeclaration extends BaseNode {
  type: "ClassDeclaration";
  id: Identifier;
  superClass: Expression | null;
  body: ClassBody;
  decorators: Array<Decorator> | null;
  abstract: boolean | null;
  declare: boolean | null;
  implements: Array<TSExpressionWithTypeArguments | ClassImplements> | null;
  mixins: InterfaceExtends | null;
  superTypeParameters:
    | TypeParameterInstantiation
    | TSTypeParameterInstantiation
    | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ExportAllDeclaration extends BaseNode {
  type: "ExportAllDeclaration";
  source: StringLiteral;
}

export interface ExportDefaultDeclaration extends BaseNode {
  type: "ExportDefaultDeclaration";
  declaration:
    | FunctionDeclaration
    | TSDeclareFunction
    | ClassDeclaration
    | Expression;
}

export interface ExportNamedDeclaration extends BaseNode {
  type: "ExportNamedDeclaration";
  declaration: Declaration | null;
  specifiers: Array<
    ExportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier
  >;
  source: StringLiteral | null;
  exportKind: "type" | "value" | null;
}

export interface ExportSpecifier extends BaseNode {
  type: "ExportSpecifier";
  local: Identifier;
  exported: Identifier;
}

export interface ForOfStatement extends BaseNode {
  type: "ForOfStatement";
  left: VariableDeclaration | LVal;
  right: Expression;
  body: Statement;
  await: boolean;
}

export interface ImportDeclaration extends BaseNode {
  type: "ImportDeclaration";
  specifiers: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >;
  source: StringLiteral;
  importKind: "type" | "typeof" | "value" | null;
}

export interface ImportDefaultSpecifier extends BaseNode {
  type: "ImportDefaultSpecifier";
  local: Identifier;
}

export interface ImportNamespaceSpecifier extends BaseNode {
  type: "ImportNamespaceSpecifier";
  local: Identifier;
}

export interface ImportSpecifier extends BaseNode {
  type: "ImportSpecifier";
  local: Identifier;
  imported: Identifier;
  importKind: "type" | "typeof" | null;
}

export interface MetaProperty extends BaseNode {
  type: "MetaProperty";
  meta: Identifier;
  property: Identifier;
}

export interface ClassMethod extends BaseNode {
  type: "ClassMethod";
  kind: "get" | "set" | "method" | "constructor";
  key: Identifier | StringLiteral | NumericLiteral | Expression;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  computed: boolean;
  static: boolean;
  generator: boolean;
  async: boolean;
  abstract: boolean | null;
  access: "public" | "private" | "protected" | null;
  accessibility: "public" | "private" | "protected" | null;
  decorators: Array<Decorator> | null;
  optional: boolean | null;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ObjectPattern extends BaseNode {
  type: "ObjectPattern";
  properties: Array<RestElement | ObjectProperty>;
  decorators: Array<Decorator> | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}

export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: Expression;
}

export interface Super extends BaseNode {
  type: "Super";
}

export interface TaggedTemplateExpression extends BaseNode {
  type: "TaggedTemplateExpression";
  tag: Expression;
  quasi: TemplateLiteral;
  typeParameters:
    | TypeParameterInstantiation
    | TSTypeParameterInstantiation
    | null;
}

export interface TemplateElement extends BaseNode {
  type: "TemplateElement";
  value: { raw: string; cooked?: string };
  tail: boolean;
}

export interface TemplateLiteral extends BaseNode {
  type: "TemplateLiteral";
  quasis: Array<TemplateElement>;
  expressions: Array<Expression>;
}

export interface YieldExpression extends BaseNode {
  type: "YieldExpression";
  argument: Expression | null;
  delegate: boolean;
}

export interface AwaitExpression extends BaseNode {
  type: "AwaitExpression";
  argument: Expression;
}

export interface Import extends BaseNode {
  type: "Import";
}

export interface BigIntLiteral extends BaseNode {
  type: "BigIntLiteral";
  value: string;
}

export interface ExportNamespaceSpecifier extends BaseNode {
  type: "ExportNamespaceSpecifier";
  exported: Identifier;
}

export interface OptionalMemberExpression extends BaseNode {
  type: "OptionalMemberExpression";
  object: Expression;
  property: Expression | Identifier;
  computed: boolean;
  optional: boolean;
}

export interface OptionalCallExpression extends BaseNode {
  type: "OptionalCallExpression";
  callee: Expression;
  arguments: Array<Expression | SpreadElement | JSXNamespacedName>;
  optional: boolean;
  typeArguments: TypeParameterInstantiation | null;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface AnyTypeAnnotation extends BaseNode {
  type: "AnyTypeAnnotation";
}

export interface ArrayTypeAnnotation extends BaseNode {
  type: "ArrayTypeAnnotation";
  elementType: FlowType;
}

export interface BooleanTypeAnnotation extends BaseNode {
  type: "BooleanTypeAnnotation";
}

export interface BooleanLiteralTypeAnnotation extends BaseNode {
  type: "BooleanLiteralTypeAnnotation";
  value: boolean;
}

export interface NullLiteralTypeAnnotation extends BaseNode {
  type: "NullLiteralTypeAnnotation";
}

export interface ClassImplements extends BaseNode {
  type: "ClassImplements";
  id: Identifier;
  typeParameters: TypeParameterInstantiation | null;
}

export interface DeclareClass extends BaseNode {
  type: "DeclareClass";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  extends: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
  implements: Array<ClassImplements> | null;
  mixins: Array<InterfaceExtends> | null;
}

export interface DeclareFunction extends BaseNode {
  type: "DeclareFunction";
  id: Identifier;
  predicate: DeclaredPredicate | null;
}

export interface DeclareInterface extends BaseNode {
  type: "DeclareInterface";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  extends: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
  implements: Array<ClassImplements> | null;
  mixins: Array<InterfaceExtends> | null;
}

export interface DeclareModule extends BaseNode {
  type: "DeclareModule";
  id: Identifier | StringLiteral;
  body: BlockStatement;
  kind: "CommonJS" | "ES" | null;
}

export interface DeclareModuleExports extends BaseNode {
  type: "DeclareModuleExports";
  typeAnnotation: TypeAnnotation;
}

export interface DeclareTypeAlias extends BaseNode {
  type: "DeclareTypeAlias";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  right: FlowType;
}

export interface DeclareOpaqueType extends BaseNode {
  type: "DeclareOpaqueType";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  supertype: FlowType | null;
}

export interface DeclareVariable extends BaseNode {
  type: "DeclareVariable";
  id: Identifier;
}

export interface DeclareExportDeclaration extends BaseNode {
  type: "DeclareExportDeclaration";
  declaration: Flow | null;
  specifiers: Array<ExportSpecifier | ExportNamespaceSpecifier> | null;
  source: StringLiteral | null;
  default: boolean | null;
}

export interface DeclareExportAllDeclaration extends BaseNode {
  type: "DeclareExportAllDeclaration";
  source: StringLiteral;
  exportKind: "type" | "value" | null;
}

export interface DeclaredPredicate extends BaseNode {
  type: "DeclaredPredicate";
  value: Flow;
}

export interface ExistsTypeAnnotation extends BaseNode {
  type: "ExistsTypeAnnotation";
}

export interface FunctionTypeAnnotation extends BaseNode {
  type: "FunctionTypeAnnotation";
  typeParameters: TypeParameterDeclaration | null;
  params: Array<FunctionTypeParam>;
  rest: FunctionTypeParam | null;
  returnType: FlowType;
}

export interface FunctionTypeParam extends BaseNode {
  type: "FunctionTypeParam";
  name: Identifier | null;
  typeAnnotation: FlowType;
  optional: boolean | null;
}

export interface GenericTypeAnnotation extends BaseNode {
  type: "GenericTypeAnnotation";
  id: Identifier | QualifiedTypeIdentifier;
  typeParameters: TypeParameterInstantiation | null;
}

export interface InferredPredicate extends BaseNode {
  type: "InferredPredicate";
}

export interface InterfaceExtends extends BaseNode {
  type: "InterfaceExtends";
  id: Identifier | QualifiedTypeIdentifier;
  typeParameters: TypeParameterInstantiation | null;
}

export interface InterfaceDeclaration extends BaseNode {
  type: "InterfaceDeclaration";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  extends: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
  implements: Array<ClassImplements> | null;
  mixins: Array<InterfaceExtends> | null;
}

export interface InterfaceTypeAnnotation extends BaseNode {
  type: "InterfaceTypeAnnotation";
  extends: Array<InterfaceExtends> | null;
  body: ObjectTypeAnnotation;
}

export interface IntersectionTypeAnnotation extends BaseNode {
  type: "IntersectionTypeAnnotation";
  types: Array<FlowType>;
}

export interface MixedTypeAnnotation extends BaseNode {
  type: "MixedTypeAnnotation";
}

export interface EmptyTypeAnnotation extends BaseNode {
  type: "EmptyTypeAnnotation";
}

export interface NullableTypeAnnotation extends BaseNode {
  type: "NullableTypeAnnotation";
  typeAnnotation: FlowType;
}

export interface NumberLiteralTypeAnnotation extends BaseNode {
  type: "NumberLiteralTypeAnnotation";
  value: number;
}

export interface NumberTypeAnnotation extends BaseNode {
  type: "NumberTypeAnnotation";
}

export interface ObjectTypeAnnotation extends BaseNode {
  type: "ObjectTypeAnnotation";
  properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>;
  indexers: Array<ObjectTypeIndexer> | null;
  callProperties: Array<ObjectTypeCallProperty> | null;
  internalSlots: Array<ObjectTypeInternalSlot> | null;
  exact: boolean;
  inexact: boolean | null;
}

export interface ObjectTypeInternalSlot extends BaseNode {
  type: "ObjectTypeInternalSlot";
  id: Identifier;
  value: FlowType;
  optional: boolean;
  static: boolean;
  method: boolean;
}

export interface ObjectTypeCallProperty extends BaseNode {
  type: "ObjectTypeCallProperty";
  value: FlowType;
  static: boolean;
}

export interface ObjectTypeIndexer extends BaseNode {
  type: "ObjectTypeIndexer";
  id: Identifier | null;
  key: FlowType;
  value: FlowType;
  variance: Variance | null;
  static: boolean;
}

export interface ObjectTypeProperty extends BaseNode {
  type: "ObjectTypeProperty";
  key: Identifier | StringLiteral;
  value: FlowType;
  variance: Variance | null;
  kind: "init" | "get" | "set";
  optional: boolean;
  proto: boolean;
  static: boolean;
}

export interface ObjectTypeSpreadProperty extends BaseNode {
  type: "ObjectTypeSpreadProperty";
  argument: FlowType;
}

export interface OpaqueType extends BaseNode {
  type: "OpaqueType";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  supertype: FlowType | null;
  impltype: FlowType;
}

export interface QualifiedTypeIdentifier extends BaseNode {
  type: "QualifiedTypeIdentifier";
  id: Identifier;
  qualification: Identifier | QualifiedTypeIdentifier;
}

export interface StringLiteralTypeAnnotation extends BaseNode {
  type: "StringLiteralTypeAnnotation";
  value: string;
}

export interface StringTypeAnnotation extends BaseNode {
  type: "StringTypeAnnotation";
}

export interface SymbolTypeAnnotation extends BaseNode {
  type: "SymbolTypeAnnotation";
}

export interface ThisTypeAnnotation extends BaseNode {
  type: "ThisTypeAnnotation";
}

export interface TupleTypeAnnotation extends BaseNode {
  type: "TupleTypeAnnotation";
  types: Array<FlowType>;
}

export interface TypeofTypeAnnotation extends BaseNode {
  type: "TypeofTypeAnnotation";
  argument: FlowType;
}

export interface TypeAlias extends BaseNode {
  type: "TypeAlias";
  id: Identifier;
  typeParameters: TypeParameterDeclaration | null;
  right: FlowType;
}

export interface TypeAnnotation extends BaseNode {
  type: "TypeAnnotation";
  typeAnnotation: FlowType;
}

export interface TypeCastExpression extends BaseNode {
  type: "TypeCastExpression";
  expression: Expression;
  typeAnnotation: TypeAnnotation;
}

export interface TypeParameter extends BaseNode {
  type: "TypeParameter";
  bound: TypeAnnotation | null;
  default: FlowType | null;
  variance: Variance | null;
  name: string;
}

export interface TypeParameterDeclaration extends BaseNode {
  type: "TypeParameterDeclaration";
  params: Array<TypeParameter>;
}

export interface TypeParameterInstantiation extends BaseNode {
  type: "TypeParameterInstantiation";
  params: Array<FlowType>;
}

export interface UnionTypeAnnotation extends BaseNode {
  type: "UnionTypeAnnotation";
  types: Array<FlowType>;
}

export interface Variance extends BaseNode {
  type: "Variance";
  kind: "minus" | "plus";
}

export interface VoidTypeAnnotation extends BaseNode {
  type: "VoidTypeAnnotation";
}

export interface EnumDeclaration extends BaseNode {
  type: "EnumDeclaration";
  id: Identifier;
  body: EnumBooleanBody | EnumNumberBody | EnumStringBody | EnumSymbolBody;
}

export interface EnumBooleanBody extends BaseNode {
  type: "EnumBooleanBody";
  members: Array<EnumBooleanMember>;
  explicit: boolean;
}

export interface EnumNumberBody extends BaseNode {
  type: "EnumNumberBody";
  members: Array<EnumNumberMember>;
  explicit: boolean;
}

export interface EnumStringBody extends BaseNode {
  type: "EnumStringBody";
  members: Array<EnumStringMember | EnumDefaultedMember>;
  explicit: boolean;
}

export interface EnumSymbolBody extends BaseNode {
  type: "EnumSymbolBody";
  members: Array<EnumDefaultedMember>;
}

export interface EnumBooleanMember extends BaseNode {
  type: "EnumBooleanMember";
  id: Identifier;
  init: BooleanLiteral;
}

export interface EnumNumberMember extends BaseNode {
  type: "EnumNumberMember";
  id: Identifier;
  init: NumericLiteral;
}

export interface EnumStringMember extends BaseNode {
  type: "EnumStringMember";
  id: Identifier;
  init: StringLiteral;
}

export interface EnumDefaultedMember extends BaseNode {
  type: "EnumDefaultedMember";
  id: Identifier;
}

export interface JSXAttribute extends BaseNode {
  type: "JSXAttribute";
  name: JSXIdentifier | JSXNamespacedName;
  value:
    | JSXElement
    | JSXFragment
    | StringLiteral
    | JSXExpressionContainer
    | null;
}

export interface JSXClosingElement extends BaseNode {
  type: "JSXClosingElement";
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
}

export interface JSXElement extends BaseNode {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  closingElement: JSXClosingElement | null;
  children: Array<
    | JSXText
    | JSXExpressionContainer
    | JSXSpreadChild
    | JSXElement
    | JSXFragment
    | StringLiteral
  >;
  selfClosing: boolean | null;
}

export interface JSXEmptyExpression extends BaseNode {
  type: "JSXEmptyExpression";
}

export interface JSXExpressionContainer extends BaseNode {
  type: "JSXExpressionContainer";
  expression: Expression | JSXEmptyExpression;
}

export interface JSXSpreadChild extends BaseNode {
  type: "JSXSpreadChild";
  expression: Expression;
}

export interface JSXIdentifier extends BaseNode {
  type: "JSXIdentifier";
  name: string;
}

export interface JSXMemberExpression extends BaseNode {
  type: "JSXMemberExpression";
  object: JSXMemberExpression | JSXIdentifier;
  property: JSXIdentifier;
}

export interface JSXNamespacedName extends BaseNode {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
}

export interface JSXOpeningElement extends BaseNode {
  type: "JSXOpeningElement";
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName;
  attributes: Array<JSXAttribute | JSXSpreadAttribute>;
  selfClosing: boolean;
  typeParameters:
    | TypeParameterInstantiation
    | TSTypeParameterInstantiation
    | null;
}

export interface JSXSpreadAttribute extends BaseNode {
  type: "JSXSpreadAttribute";
  argument: Expression;
}

export interface JSXText extends BaseNode {
  type: "JSXText";
  value: string;
}

export interface JSXFragment extends BaseNode {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  closingFragment: JSXClosingFragment;
  children: Array<
    JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
  >;
}

export interface JSXOpeningFragment extends BaseNode {
  type: "JSXOpeningFragment";
}

export interface JSXClosingFragment extends BaseNode {
  type: "JSXClosingFragment";
}

export interface Noop extends BaseNode {
  type: "Noop";
}

export interface Placeholder extends BaseNode {
  type: "Placeholder";
  expectedNode:
    | "Identifier"
    | "StringLiteral"
    | "Expression"
    | "Statement"
    | "Declaration"
    | "BlockStatement"
    | "ClassBody"
    | "Pattern";
  name: Identifier;
}

export interface V8IntrinsicIdentifier extends BaseNode {
  type: "V8IntrinsicIdentifier";
  name: string;
}

export interface ArgumentPlaceholder extends BaseNode {
  type: "ArgumentPlaceholder";
}

export interface BindExpression extends BaseNode {
  type: "BindExpression";
  object: Expression;
  callee: Expression;
}

export interface ClassProperty extends BaseNode {
  type: "ClassProperty";
  key: Identifier | StringLiteral | NumericLiteral | Expression;
  value: Expression | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
  decorators: Array<Decorator> | null;
  computed: boolean;
  static: boolean;
  abstract: boolean | null;
  accessibility: "public" | "private" | "protected" | null;
  declare: boolean | null;
  definite: boolean | null;
  optional: boolean | null;
  readonly: boolean | null;
}

export interface PipelineTopicExpression extends BaseNode {
  type: "PipelineTopicExpression";
  expression: Expression;
}

export interface PipelineBareFunction extends BaseNode {
  type: "PipelineBareFunction";
  callee: Expression;
}

export interface PipelinePrimaryTopicReference extends BaseNode {
  type: "PipelinePrimaryTopicReference";
}

export interface ClassPrivateProperty extends BaseNode {
  type: "ClassPrivateProperty";
  key: PrivateName;
  value: Expression | null;
  decorators: Array<Decorator> | null;
}

export interface ClassPrivateMethod extends BaseNode {
  type: "ClassPrivateMethod";
  kind: "get" | "set" | "method" | "constructor";
  key: PrivateName;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  body: BlockStatement;
  static: boolean;
  abstract: boolean | null;
  access: "public" | "private" | "protected" | null;
  accessibility: "public" | "private" | "protected" | null;
  async: boolean;
  computed: boolean;
  decorators: Array<Decorator> | null;
  generator: boolean;
  optional: boolean | null;
  returnType: TypeAnnotation | TSTypeAnnotation | Noop | null;
  typeParameters:
    | TypeParameterDeclaration
    | TSTypeParameterDeclaration
    | Noop
    | null;
}

export interface ImportAttribute extends BaseNode {
  type: "ImportAttribute";
  key: Identifier;
  value: StringLiteral;
}

export interface Decorator extends BaseNode {
  type: "Decorator";
  expression: Expression;
}

export interface DoExpression extends BaseNode {
  type: "DoExpression";
  body: BlockStatement;
}

export interface ExportDefaultSpecifier extends BaseNode {
  type: "ExportDefaultSpecifier";
  exported: Identifier;
}

export interface PrivateName extends BaseNode {
  type: "PrivateName";
  id: Identifier;
}

export interface RecordExpression extends BaseNode {
  type: "RecordExpression";
  properties: Array<ObjectProperty | SpreadElement>;
}

export interface TupleExpression extends BaseNode {
  type: "TupleExpression";
  elements: Array<Expression | SpreadElement>;
}

export interface DecimalLiteral extends BaseNode {
  type: "DecimalLiteral";
  value: string;
}

export interface TSParameterProperty extends BaseNode {
  type: "TSParameterProperty";
  parameter: Identifier | AssignmentPattern;
  accessibility: "public" | "private" | "protected" | null;
  readonly: boolean | null;
}

export interface TSDeclareFunction extends BaseNode {
  type: "TSDeclareFunction";
  id: Identifier | null;
  typeParameters: TSTypeParameterDeclaration | Noop | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  returnType: TSTypeAnnotation | Noop | null;
  async: boolean;
  declare: boolean | null;
  generator: boolean;
}

export interface TSDeclareMethod extends BaseNode {
  type: "TSDeclareMethod";
  decorators: Array<Decorator> | null;
  key: Identifier | StringLiteral | NumericLiteral | Expression;
  typeParameters: TSTypeParameterDeclaration | Noop | null;
  params: Array<Identifier | Pattern | RestElement | TSParameterProperty>;
  returnType: TSTypeAnnotation | Noop | null;
  abstract: boolean | null;
  access: "public" | "private" | "protected" | null;
  accessibility: "public" | "private" | "protected" | null;
  async: boolean;
  computed: boolean;
  generator: boolean;
  kind: "get" | "set" | "method" | "constructor";
  optional: boolean | null;
  static: boolean;
}

export interface TSQualifiedName extends BaseNode {
  type: "TSQualifiedName";
  left: TSEntityName;
  right: Identifier;
}

export interface TSCallSignatureDeclaration extends BaseNode {
  type: "TSCallSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSConstructSignatureDeclaration extends BaseNode {
  type: "TSConstructSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSPropertySignature extends BaseNode {
  type: "TSPropertySignature";
  key: Expression;
  typeAnnotation: TSTypeAnnotation | null;
  initializer: Expression | null;
  computed: boolean | null;
  optional: boolean | null;
  readonly: boolean | null;
}

export interface TSMethodSignature extends BaseNode {
  type: "TSMethodSignature";
  key: Expression;
  typeParameters: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation: TSTypeAnnotation | null;
  computed: boolean | null;
  optional: boolean | null;
}

export interface TSIndexSignature extends BaseNode {
  type: "TSIndexSignature";
  parameters: Array<Identifier>;
  typeAnnotation: TSTypeAnnotation | null;
  readonly: boolean | null;
}

export interface TSAnyKeyword extends BaseNode {
  type: "TSAnyKeyword";
}

export interface TSBooleanKeyword extends BaseNode {
  type: "TSBooleanKeyword";
}

export interface TSBigIntKeyword extends BaseNode {
  type: "TSBigIntKeyword";
}

export interface TSNeverKeyword extends BaseNode {
  type: "TSNeverKeyword";
}

export interface TSNullKeyword extends BaseNode {
  type: "TSNullKeyword";
}

export interface TSNumberKeyword extends BaseNode {
  type: "TSNumberKeyword";
}

export interface TSObjectKeyword extends BaseNode {
  type: "TSObjectKeyword";
}

export interface TSStringKeyword extends BaseNode {
  type: "TSStringKeyword";
}

export interface TSSymbolKeyword extends BaseNode {
  type: "TSSymbolKeyword";
}

export interface TSUndefinedKeyword extends BaseNode {
  type: "TSUndefinedKeyword";
}

export interface TSUnknownKeyword extends BaseNode {
  type: "TSUnknownKeyword";
}

export interface TSVoidKeyword extends BaseNode {
  type: "TSVoidKeyword";
}

export interface TSThisType extends BaseNode {
  type: "TSThisType";
}

export interface TSFunctionType extends BaseNode {
  type: "TSFunctionType";
  typeParameters: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSConstructorType extends BaseNode {
  type: "TSConstructorType";
  typeParameters: TSTypeParameterDeclaration | null;
  parameters: Array<Identifier | RestElement>;
  typeAnnotation: TSTypeAnnotation | null;
}

export interface TSTypeReference extends BaseNode {
  type: "TSTypeReference";
  typeName: TSEntityName;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSTypePredicate extends BaseNode {
  type: "TSTypePredicate";
  parameterName: Identifier | TSThisType;
  typeAnnotation: TSTypeAnnotation | null;
  asserts: boolean | null;
}

export interface TSTypeQuery extends BaseNode {
  type: "TSTypeQuery";
  exprName: TSEntityName | TSImportType;
}

export interface TSTypeLiteral extends BaseNode {
  type: "TSTypeLiteral";
  members: Array<TSTypeElement>;
}

export interface TSArrayType extends BaseNode {
  type: "TSArrayType";
  elementType: TSType;
}

export interface TSTupleType extends BaseNode {
  type: "TSTupleType";
  elementTypes: Array<TSType | TSNamedTupleMember>;
}

export interface TSOptionalType extends BaseNode {
  type: "TSOptionalType";
  typeAnnotation: TSType;
}

export interface TSRestType extends BaseNode {
  type: "TSRestType";
  typeAnnotation: TSType;
}

export interface TSNamedTupleMember extends BaseNode {
  type: "TSNamedTupleMember";
  label: Identifier;
  elementType: TSType;
  optional: boolean;
}

export interface TSUnionType extends BaseNode {
  type: "TSUnionType";
  types: Array<TSType>;
}

export interface TSIntersectionType extends BaseNode {
  type: "TSIntersectionType";
  types: Array<TSType>;
}

export interface TSConditionalType extends BaseNode {
  type: "TSConditionalType";
  checkType: TSType;
  extendsType: TSType;
  trueType: TSType;
  falseType: TSType;
}

export interface TSInferType extends BaseNode {
  type: "TSInferType";
  typeParameter: TSTypeParameter;
}

export interface TSParenthesizedType extends BaseNode {
  type: "TSParenthesizedType";
  typeAnnotation: TSType;
}

export interface TSTypeOperator extends BaseNode {
  type: "TSTypeOperator";
  typeAnnotation: TSType;
  operator: string;
}

export interface TSIndexedAccessType extends BaseNode {
  type: "TSIndexedAccessType";
  objectType: TSType;
  indexType: TSType;
}

export interface TSMappedType extends BaseNode {
  type: "TSMappedType";
  typeParameter: TSTypeParameter;
  typeAnnotation: TSType | null;
  optional: boolean | null;
  readonly: boolean | null;
}

export interface TSLiteralType extends BaseNode {
  type: "TSLiteralType";
  literal: NumericLiteral | StringLiteral | BooleanLiteral | BigIntLiteral;
}

export interface TSExpressionWithTypeArguments extends BaseNode {
  type: "TSExpressionWithTypeArguments";
  expression: TSEntityName;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSInterfaceDeclaration extends BaseNode {
  type: "TSInterfaceDeclaration";
  id: Identifier;
  typeParameters: TSTypeParameterDeclaration | null;
  extends: Array<TSExpressionWithTypeArguments> | null;
  body: TSInterfaceBody;
  declare: boolean | null;
}

export interface TSInterfaceBody extends BaseNode {
  type: "TSInterfaceBody";
  body: Array<TSTypeElement>;
}

export interface TSTypeAliasDeclaration extends BaseNode {
  type: "TSTypeAliasDeclaration";
  id: Identifier;
  typeParameters: TSTypeParameterDeclaration | null;
  typeAnnotation: TSType;
  declare: boolean | null;
}

export interface TSAsExpression extends BaseNode {
  type: "TSAsExpression";
  expression: Expression;
  typeAnnotation: TSType;
}

export interface TSTypeAssertion extends BaseNode {
  type: "TSTypeAssertion";
  typeAnnotation: TSType;
  expression: Expression;
}

export interface TSEnumDeclaration extends BaseNode {
  type: "TSEnumDeclaration";
  id: Identifier;
  members: Array<TSEnumMember>;
  const: boolean | null;
  declare: boolean | null;
  initializer: Expression | null;
}

export interface TSEnumMember extends BaseNode {
  type: "TSEnumMember";
  id: Identifier | StringLiteral;
  initializer: Expression | null;
}

export interface TSModuleDeclaration extends BaseNode {
  type: "TSModuleDeclaration";
  id: Identifier | StringLiteral;
  body: TSModuleBlock | TSModuleDeclaration;
  declare: boolean | null;
  global: boolean | null;
}

export interface TSModuleBlock extends BaseNode {
  type: "TSModuleBlock";
  body: Array<Statement>;
}

export interface TSImportType extends BaseNode {
  type: "TSImportType";
  argument: StringLiteral;
  qualifier: TSEntityName | null;
  typeParameters: TSTypeParameterInstantiation | null;
}

export interface TSImportEqualsDeclaration extends BaseNode {
  type: "TSImportEqualsDeclaration";
  id: Identifier;
  moduleReference: TSEntityName | TSExternalModuleReference;
  isExport: boolean;
}

export interface TSExternalModuleReference extends BaseNode {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
}

export interface TSNonNullExpression extends BaseNode {
  type: "TSNonNullExpression";
  expression: Expression;
}

export interface TSExportAssignment extends BaseNode {
  type: "TSExportAssignment";
  expression: Expression;
}

export interface TSNamespaceExportDeclaration extends BaseNode {
  type: "TSNamespaceExportDeclaration";
  id: Identifier;
}

export interface TSTypeAnnotation extends BaseNode {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
}

export interface TSTypeParameterInstantiation extends BaseNode {
  type: "TSTypeParameterInstantiation";
  params: Array<TSType>;
}

export interface TSTypeParameterDeclaration extends BaseNode {
  type: "TSTypeParameterDeclaration";
  params: Array<TSTypeParameter>;
}

export interface TSTypeParameter extends BaseNode {
  type: "TSTypeParameter";
  constraint: TSType | null;
  default: TSType | null;
  name: string;
}

/**
 * @deprecated Use `NumericLiteral`
 */

export type NumberLiteral = NumericLiteral;

/**
 * @deprecated Use `RegExpLiteral`
 */

export type RegexLiteral = RegExpLiteral;

/**
 * @deprecated Use `RestElement`
 */

export type RestProperty = RestElement;

/**
 * @deprecated Use `SpreadElement`
 */

export type SpreadProperty = SpreadElement;

export type Expression =
  | ArrayExpression
  | AssignmentExpression
  | BinaryExpression
  | CallExpression
  | ConditionalExpression
  | FunctionExpression
  | Identifier
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | RegExpLiteral
  | LogicalExpression
  | MemberExpression
  | NewExpression
  | ObjectExpression
  | SequenceExpression
  | ParenthesizedExpression
  | ThisExpression
  | UnaryExpression
  | UpdateExpression
  | ArrowFunctionExpression
  | ClassExpression
  | MetaProperty
  | Super
  | TaggedTemplateExpression
  | TemplateLiteral
  | YieldExpression
  | AwaitExpression
  | Import
  | BigIntLiteral
  | OptionalMemberExpression
  | OptionalCallExpression
  | TypeCastExpression
  | JSXElement
  | JSXFragment
  | BindExpression
  | PipelinePrimaryTopicReference
  | DoExpression
  | RecordExpression
  | TupleExpression
  | DecimalLiteral
  | TSAsExpression
  | TSTypeAssertion
  | TSNonNullExpression;

export type Binary = BinaryExpression | LogicalExpression;

export type Scopable =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ClassExpression
  | ClassDeclaration
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | TSModuleBlock;

export type BlockParent =
  | BlockStatement
  | CatchClause
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | FunctionExpression
  | Program
  | ObjectMethod
  | SwitchStatement
  | WhileStatement
  | ArrowFunctionExpression
  | ForOfStatement
  | ClassMethod
  | ClassPrivateMethod
  | TSModuleBlock;

export type Block = BlockStatement | Program | TSModuleBlock;

export type Statement =
  | BlockStatement
  | BreakStatement
  | ContinueStatement
  | DebuggerStatement
  | DoWhileStatement
  | EmptyStatement
  | ExpressionStatement
  | ForInStatement
  | ForStatement
  | FunctionDeclaration
  | IfStatement
  | LabeledStatement
  | ReturnStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | VariableDeclaration
  | WhileStatement
  | WithStatement
  | ClassDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ForOfStatement
  | ImportDeclaration
  | DeclareClass
  | DeclareFunction
  | DeclareInterface
  | DeclareModule
  | DeclareModuleExports
  | DeclareTypeAlias
  | DeclareOpaqueType
  | DeclareVariable
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | InterfaceDeclaration
  | OpaqueType
  | TypeAlias
  | EnumDeclaration
  | TSDeclareFunction
  | TSInterfaceDeclaration
  | TSTypeAliasDeclaration
  | TSEnumDeclaration
  | TSModuleDeclaration
  | TSImportEqualsDeclaration
  | TSExportAssignment
  | TSNamespaceExportDeclaration;

export type Terminatorless =
  | BreakStatement
  | ContinueStatement
  | ReturnStatement
  | ThrowStatement
  | YieldExpression
  | AwaitExpression;

export type CompletionStatement =
  | BreakStatement
  | ContinueStatement
  | ReturnStatement
  | ThrowStatement;

export type Conditional = ConditionalExpression | IfStatement;

export type Loop =
  | DoWhileStatement
  | ForInStatement
  | ForStatement
  | WhileStatement
  | ForOfStatement;

export type While = DoWhileStatement | WhileStatement;

export type ExpressionWrapper =
  | ExpressionStatement
  | ParenthesizedExpression
  | TypeCastExpression;

export type For = ForInStatement | ForStatement | ForOfStatement;

export type ForXStatement = ForInStatement | ForOfStatement;

export type Function =
  | FunctionDeclaration
  | FunctionExpression
  | ObjectMethod
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod;

export type FunctionParent =
  | FunctionDeclaration
  | FunctionExpression
  | ObjectMethod
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod;

export type Pureish =
  | FunctionDeclaration
  | FunctionExpression
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | RegExpLiteral
  | ArrowFunctionExpression
  | BigIntLiteral
  | DecimalLiteral;

export type Declaration =
  | FunctionDeclaration
  | VariableDeclaration
  | ClassDeclaration
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ImportDeclaration
  | DeclareClass
  | DeclareFunction
  | DeclareInterface
  | DeclareModule
  | DeclareModuleExports
  | DeclareTypeAlias
  | DeclareOpaqueType
  | DeclareVariable
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | InterfaceDeclaration
  | OpaqueType
  | TypeAlias
  | EnumDeclaration
  | TSDeclareFunction
  | TSInterfaceDeclaration
  | TSTypeAliasDeclaration
  | TSEnumDeclaration
  | TSModuleDeclaration;

export type PatternLike =
  | Identifier
  | RestElement
  | AssignmentPattern
  | ArrayPattern
  | ObjectPattern;

export type LVal =
  | Identifier
  | MemberExpression
  | RestElement
  | AssignmentPattern
  | ArrayPattern
  | ObjectPattern
  | TSParameterProperty;

export type TSEntityName = Identifier | TSQualifiedName;

export type Literal =
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | RegExpLiteral
  | TemplateLiteral
  | BigIntLiteral
  | DecimalLiteral;

export type Immutable =
  | StringLiteral
  | NumericLiteral
  | NullLiteral
  | BooleanLiteral
  | BigIntLiteral
  | JSXAttribute
  | JSXClosingElement
  | JSXElement
  | JSXExpressionContainer
  | JSXSpreadChild
  | JSXOpeningElement
  | JSXText
  | JSXFragment
  | JSXOpeningFragment
  | JSXClosingFragment
  | DecimalLiteral;

export type UserWhitespacable =
  | ObjectMethod
  | ObjectProperty
  | ObjectTypeInternalSlot
  | ObjectTypeCallProperty
  | ObjectTypeIndexer
  | ObjectTypeProperty
  | ObjectTypeSpreadProperty;

export type Method = ObjectMethod | ClassMethod | ClassPrivateMethod;

export type ObjectMember = ObjectMethod | ObjectProperty;

export type Property = ObjectProperty | ClassProperty | ClassPrivateProperty;

export type UnaryLike = UnaryExpression | SpreadElement;

export type Pattern = AssignmentPattern | ArrayPattern | ObjectPattern;

export type Class = ClassExpression | ClassDeclaration;

export type ModuleDeclaration =
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration
  | ImportDeclaration;

export type ExportDeclaration =
  | ExportAllDeclaration
  | ExportDefaultDeclaration
  | ExportNamedDeclaration;

export type ModuleSpecifier =
  | ExportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ImportSpecifier
  | ExportNamespaceSpecifier
  | ExportDefaultSpecifier;

export type Flow =
  | AnyTypeAnnotation
  | ArrayTypeAnnotation
  | BooleanTypeAnnotation
  | BooleanLiteralTypeAnnotation
  | NullLiteralTypeAnnotation
  | ClassImplements
  | DeclareClass
  | DeclareFunction
  | DeclareInterface
  | DeclareModule
  | DeclareModuleExports
  | DeclareTypeAlias
  | DeclareOpaqueType
  | DeclareVariable
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | DeclaredPredicate
  | ExistsTypeAnnotation
  | FunctionTypeAnnotation
  | FunctionTypeParam
  | GenericTypeAnnotation
  | InferredPredicate
  | InterfaceExtends
  | InterfaceDeclaration
  | InterfaceTypeAnnotation
  | IntersectionTypeAnnotation
  | MixedTypeAnnotation
  | EmptyTypeAnnotation
  | NullableTypeAnnotation
  | NumberLiteralTypeAnnotation
  | NumberTypeAnnotation
  | ObjectTypeAnnotation
  | ObjectTypeInternalSlot
  | ObjectTypeCallProperty
  | ObjectTypeIndexer
  | ObjectTypeProperty
  | ObjectTypeSpreadProperty
  | OpaqueType
  | QualifiedTypeIdentifier
  | StringLiteralTypeAnnotation
  | StringTypeAnnotation
  | SymbolTypeAnnotation
  | ThisTypeAnnotation
  | TupleTypeAnnotation
  | TypeofTypeAnnotation
  | TypeAlias
  | TypeAnnotation
  | TypeCastExpression
  | TypeParameter
  | TypeParameterDeclaration
  | TypeParameterInstantiation
  | UnionTypeAnnotation
  | Variance
  | VoidTypeAnnotation;

export type FlowType =
  | AnyTypeAnnotation
  | ArrayTypeAnnotation
  | BooleanTypeAnnotation
  | BooleanLiteralTypeAnnotation
  | NullLiteralTypeAnnotation
  | ExistsTypeAnnotation
  | FunctionTypeAnnotation
  | GenericTypeAnnotation
  | InterfaceTypeAnnotation
  | IntersectionTypeAnnotation
  | MixedTypeAnnotation
  | EmptyTypeAnnotation
  | NullableTypeAnnotation
  | NumberLiteralTypeAnnotation
  | NumberTypeAnnotation
  | ObjectTypeAnnotation
  | StringLiteralTypeAnnotation
  | StringTypeAnnotation
  | SymbolTypeAnnotation
  | ThisTypeAnnotation
  | TupleTypeAnnotation
  | TypeofTypeAnnotation
  | UnionTypeAnnotation
  | VoidTypeAnnotation;

export type FlowBaseAnnotation =
  | AnyTypeAnnotation
  | BooleanTypeAnnotation
  | NullLiteralTypeAnnotation
  | MixedTypeAnnotation
  | EmptyTypeAnnotation
  | NumberTypeAnnotation
  | StringTypeAnnotation
  | SymbolTypeAnnotation
  | ThisTypeAnnotation
  | VoidTypeAnnotation;

export type FlowDeclaration =
  | DeclareClass
  | DeclareFunction
  | DeclareInterface
  | DeclareModule
  | DeclareModuleExports
  | DeclareTypeAlias
  | DeclareOpaqueType
  | DeclareVariable
  | DeclareExportDeclaration
  | DeclareExportAllDeclaration
  | InterfaceDeclaration
  | OpaqueType
  | TypeAlias;

export type FlowPredicate = DeclaredPredicate | InferredPredicate;

export type EnumBody =
  | EnumBooleanBody
  | EnumNumberBody
  | EnumStringBody
  | EnumSymbolBody;

export type EnumMember =
  | EnumBooleanMember
  | EnumNumberMember
  | EnumStringMember
  | EnumDefaultedMember;

export type JSX =
  | JSXAttribute
  | JSXClosingElement
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXSpreadChild
  | JSXIdentifier
  | JSXMemberExpression
  | JSXNamespacedName
  | JSXOpeningElement
  | JSXSpreadAttribute
  | JSXText
  | JSXFragment
  | JSXOpeningFragment
  | JSXClosingFragment;

export type Private = ClassPrivateProperty | ClassPrivateMethod | PrivateName;

export type TSTypeElement =
  | TSCallSignatureDeclaration
  | TSConstructSignatureDeclaration
  | TSPropertySignature
  | TSMethodSignature
  | TSIndexSignature;

export type TSType =
  | TSAnyKeyword
  | TSBooleanKeyword
  | TSBigIntKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSUndefinedKeyword
  | TSUnknownKeyword
  | TSVoidKeyword
  | TSThisType
  | TSFunctionType
  | TSConstructorType
  | TSTypeReference
  | TSTypePredicate
  | TSTypeQuery
  | TSTypeLiteral
  | TSArrayType
  | TSTupleType
  | TSOptionalType
  | TSRestType
  | TSUnionType
  | TSIntersectionType
  | TSConditionalType
  | TSInferType
  | TSParenthesizedType
  | TSTypeOperator
  | TSIndexedAccessType
  | TSMappedType
  | TSLiteralType
  | TSExpressionWithTypeArguments
  | TSImportType;

export type TSBaseType =
  | TSAnyKeyword
  | TSBooleanKeyword
  | TSBigIntKeyword
  | TSNeverKeyword
  | TSNullKeyword
  | TSNumberKeyword
  | TSObjectKeyword
  | TSStringKeyword
  | TSSymbolKeyword
  | TSUndefinedKeyword
  | TSUnknownKeyword
  | TSVoidKeyword
  | TSThisType
  | TSLiteralType;

export interface Aliases {
  Expression: Expression;
  Binary: Binary;
  Scopable: Scopable;
  BlockParent: BlockParent;
  Block: Block;
  Statement: Statement;
  Terminatorless: Terminatorless;
  CompletionStatement: CompletionStatement;
  Conditional: Conditional;
  Loop: Loop;
  While: While;
  ExpressionWrapper: ExpressionWrapper;
  For: For;
  ForXStatement: ForXStatement;
  Function: Function;
  FunctionParent: FunctionParent;
  Pureish: Pureish;
  Declaration: Declaration;
  PatternLike: PatternLike;
  LVal: LVal;
  TSEntityName: TSEntityName;
  Literal: Literal;
  Immutable: Immutable;
  UserWhitespacable: UserWhitespacable;
  Method: Method;
  ObjectMember: ObjectMember;
  Property: Property;
  UnaryLike: UnaryLike;
  Pattern: Pattern;
  Class: Class;
  ModuleDeclaration: ModuleDeclaration;
  ExportDeclaration: ExportDeclaration;
  ModuleSpecifier: ModuleSpecifier;
  Flow: Flow;
  FlowType: FlowType;
  FlowBaseAnnotation: FlowBaseAnnotation;
  FlowDeclaration: FlowDeclaration;
  FlowPredicate: FlowPredicate;
  EnumBody: EnumBody;
  EnumMember: EnumMember;
  JSX: JSX;
  Private: Private;
  TSTypeElement: TSTypeElement;
  TSType: TSType;
  TSBaseType: TSBaseType;
}

export type CommentTypeShorthand = "leading" | "inner" | "trailing";

export type TraversalAncestors = ReadonlyArray<{
  node: Node;
  key: string;
  index?: number;
}>;

export type TraversalHandler<T> = (
  this: void,
  node: Node,
  parent: TraversalAncestors,
  type: T
) => void;

export type TraversalHandlers<T> = {
  enter?: TraversalHandler<T>;
  exit?: TraversalHandler<T>;
};

export type FastTraversalHandler<T> = (
  this: void,
  node: Node,
  state: T
) => void;

export type FastTraversalHandlers<T> = {
  enter?: FastTraversalHandler<T>;
  exit?: FastTraversalHandler<T>;
};

export type Validator<T = Node> = (node: T, key: string, value: any) => void;

export type FieldOptions<T = Node> = {
  default?: any;
  optional?: boolean;
  validate?: Validator<T>;
};

export type Primitive = boolean | null | number | string | undefined | RegExp;

export type PlainObjectValue = Primitive | PlainObject | PlainObjectArray;

export interface PlainObject {
  [key: string]: PlainObjectValue;
}

export type PlainObjectArray = PlainObjectValue[];
