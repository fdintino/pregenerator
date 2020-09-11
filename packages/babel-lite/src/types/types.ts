/* eslint-disable @typescript-eslint/no-explicit-any */
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

// export function arrayExpression(
//   elements?: Array<null | Expression | SpreadElement>
// ): ArrayExpression;
//
// export function assignmentExpression(
//   operator: string,
//   left: LVal,
//   right: Expression
// ): AssignmentExpression;
//
// export function binaryExpression(
//   operator:
//     | "+"
//     | "-"
//     | "/"
//     | "%"
//     | "*"
//     | "**"
//     | "&"
//     | "|"
//     | ">>"
//     | ">>>"
//     | "<<"
//     | "^"
//     | "=="
//     | "==="
//     | "!="
//     | "!=="
//     | "in"
//     | "instanceof"
//     | ">"
//     | "<"
//     | ">="
//     | "<=",
//   left: Expression | PrivateName,
//   right: Expression
// ): BinaryExpression;
//
// export function interpreterDirective(value: string): InterpreterDirective;
//
// export function directive(value: DirectiveLiteral): Directive;
//
// export function directiveLiteral(value: string): DirectiveLiteral;
//
// export function blockStatement(
//   body: Array<Statement>,
//   directives?: Array<Directive>
// ): BlockStatement;
//
// export function breakStatement(label?: Identifier | null): BreakStatement;
//
// export function callExpression(
//   callee: Expression | V8IntrinsicIdentifier,
//   _arguments: Array<
//     Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
//   >
// ): CallExpression;
//
// export function catchClause(
//   param: Identifier | ArrayPattern | ObjectPattern | null | undefined,
//   body: BlockStatement
// ): CatchClause;
//
// export function conditionalExpression(
//   test: Expression,
//   consequent: Expression,
//   alternate: Expression
// ): ConditionalExpression;
//
// export function continueStatement(label?: Identifier | null): ContinueStatement;
//
// export function debuggerStatement(): DebuggerStatement;
//
// export function doWhileStatement(
//   test: Expression,
//   body: Statement
// ): DoWhileStatement;
//
// export function emptyStatement(): EmptyStatement;
//
// export function expressionStatement(
//   expression: Expression
// ): ExpressionStatement;
//
// export function file(
//   program: Program,
//   comments?: Array<CommentBlock | CommentLine> | null,
//   tokens?: Array<any> | null
// ): File;
//
// export function forInStatement(
//   left: VariableDeclaration | LVal,
//   right: Expression,
//   body: Statement
// ): ForInStatement;
//
// export function forStatement(
//   init: VariableDeclaration | Expression | null | undefined,
//   test: Expression | null | undefined,
//   update: Expression | null | undefined,
//   body: Statement
// ): ForStatement;
//
// export function functionDeclaration(
//   id: Identifier | null | undefined,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement,
//   generator?: boolean,
//   async?: boolean
// ): FunctionDeclaration;
//
// export function functionExpression(
//   id: Identifier | null | undefined,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement,
//   generator?: boolean,
//   async?: boolean
// ): FunctionExpression;
//
// export function identifier(name: string): Identifier;
//
// export function ifStatement(
//   test: Expression,
//   consequent: Statement,
//   alternate?: Statement | null
// ): IfStatement;
//
// export function labeledStatement(
//   label: Identifier,
//   body: Statement
// ): LabeledStatement;
//
// export function stringLiteral(value: string): StringLiteral;
//
// export function numericLiteral(value: number): NumericLiteral;
//
// export function nullLiteral(): NullLiteral;
//
// export function booleanLiteral(value: boolean): BooleanLiteral;
//
// export function regExpLiteral(pattern: string, flags?: string): RegExpLiteral;
//
// export function logicalExpression(
//   operator: "||" | "&&" | "??",
//   left: Expression,
//   right: Expression
// ): LogicalExpression;
//
// export function memberExpression(
//   object: Expression,
//   property: Expression | Identifier | PrivateName,
//   computed?: boolean,
//   optional?: true | false | null
// ): MemberExpression;
//
// export function newExpression(
//   callee: Expression | V8IntrinsicIdentifier,
//   _arguments: Array<
//     Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder
//   >
// ): NewExpression;
//
// export function program(
//   body: Array<Statement>,
//   directives?: Array<Directive>,
//   sourceType?: "script" | "module",
//   interpreter?: InterpreterDirective | null
// ): Program;
//
// export function objectExpression(
//   properties: Array<ObjectMethod | ObjectProperty | SpreadElement>
// ): ObjectExpression;
//
// export function objectMethod(
//   kind: "method" | "get" | "set" | undefined,
//   key: Expression | Identifier | StringLiteral | NumericLiteral,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement,
//   computed?: boolean,
//   generator?: boolean,
//   async?: boolean
// ): ObjectMethod;
//
// export function objectProperty(
//   key: Expression | Identifier | StringLiteral | NumericLiteral,
//   value: Expression | PatternLike,
//   computed?: boolean,
//   shorthand?: boolean,
//   decorators?: Array<Decorator> | null
// ): ObjectProperty;
//
// export function restElement(argument: LVal): RestElement;
//
// export function returnStatement(argument?: Expression | null): ReturnStatement;
//
// export function sequenceExpression(
//   expressions: Array<Expression>
// ): SequenceExpression;
//
// export function parenthesizedExpression(
//   expression: Expression
// ): ParenthesizedExpression;
//
// export function switchCase(
//   test: Expression | null | undefined,
//   consequent: Array<Statement>
// ): SwitchCase;
//
// export function switchStatement(
//   discriminant: Expression,
//   cases: Array<SwitchCase>
// ): SwitchStatement;
//
// export function thisExpression(): ThisExpression;
//
// export function throwStatement(argument: Expression): ThrowStatement;
//
// export function tryStatement(
//   block: BlockStatement,
//   handler?: CatchClause | null,
//   finalizer?: BlockStatement | null
// ): TryStatement;
//
// export function unaryExpression(
//   operator: "void" | "throw" | "delete" | "!" | "+" | "-" | "~" | "typeof",
//   argument: Expression,
//   prefix?: boolean
// ): UnaryExpression;
//
// export function updateExpression(
//   operator: "++" | "--",
//   argument: Expression,
//   prefix?: boolean
// ): UpdateExpression;
//
// export function variableDeclaration(
//   kind: "var" | "let" | "const",
//   declarations: Array<VariableDeclarator>
// ): VariableDeclaration;
//
// export function variableDeclarator(
//   id: LVal,
//   init?: Expression | null
// ): VariableDeclarator;
//
// export function whileStatement(
//   test: Expression,
//   body: Statement
// ): WhileStatement;
//
// export function withStatement(
//   object: Expression,
//   body: Statement
// ): WithStatement;
//
// export function assignmentPattern(
//   left: Identifier | ObjectPattern | ArrayPattern | MemberExpression,
//   right: Expression
// ): AssignmentPattern;
//
// export function arrayPattern(elements: Array<null | PatternLike>): ArrayPattern;
//
// export function arrowFunctionExpression(
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement | Expression,
//   async?: boolean
// ): ArrowFunctionExpression;
//
// export function classBody(
//   body: Array<
//     | ClassMethod
//     | ClassPrivateMethod
//     | ClassProperty
//     | ClassPrivateProperty
//     | TSDeclareMethod
//     | TSIndexSignature
//   >
// ): ClassBody;
//
// export function classExpression(
//   id: Identifier | null | undefined,
//   superClass: Expression | null | undefined,
//   body: ClassBody,
//   decorators?: Array<Decorator> | null
// ): ClassExpression;
//
// export function classDeclaration(
//   id: Identifier,
//   superClass: Expression | null | undefined,
//   body: ClassBody,
//   decorators?: Array<Decorator> | null
// ): ClassDeclaration;
//
// export function exportAllDeclaration(
//   source: StringLiteral
// ): ExportAllDeclaration;
//
// export function exportDefaultDeclaration(
//   declaration:
//     | FunctionDeclaration
//     | TSDeclareFunction
//     | ClassDeclaration
//     | Expression
// ): ExportDefaultDeclaration;
//
// export function exportNamedDeclaration(
//   declaration?: Declaration | null,
//   specifiers?: Array<
//     ExportSpecifier | ExportDefaultSpecifier | ExportNamespaceSpecifier
//   >,
//   source?: StringLiteral | null
// ): ExportNamedDeclaration;
//
// export function exportSpecifier(
//   local: Identifier,
//   exported: Identifier
// ): ExportSpecifier;
//
// export function forOfStatement(
//   left: VariableDeclaration | LVal,
//   right: Expression,
//   body: Statement,
//   _await?: boolean
// ): ForOfStatement;
//
// export function importDeclaration(
//   specifiers: Array<
//     ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
//   >,
//   source: StringLiteral
// ): ImportDeclaration;
//
// export function importDefaultSpecifier(
//   local: Identifier
// ): ImportDefaultSpecifier;
//
// export function importNamespaceSpecifier(
//   local: Identifier
// ): ImportNamespaceSpecifier;
//
// export function importSpecifier(
//   local: Identifier,
//   imported: Identifier
// ): ImportSpecifier;
//
// export function metaProperty(
//   meta: Identifier,
//   property: Identifier
// ): MetaProperty;
//
// export function classMethod(
//   kind: "get" | "set" | "method" | "constructor" | undefined,
//   key: Identifier | StringLiteral | NumericLiteral | Expression,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement,
//   computed?: boolean,
//   _static?: boolean,
//   generator?: boolean,
//   async?: boolean
// ): ClassMethod;
//
// export function objectPattern(
//   properties: Array<RestElement | ObjectProperty>
// ): ObjectPattern;
//
// export function spreadElement(argument: Expression): SpreadElement;
// declare function _super(): Super;
//
// export { _super as super };
//
// export function taggedTemplateExpression(
//   tag: Expression,
//   quasi: TemplateLiteral
// ): TaggedTemplateExpression;
//
// export function templateElement(
//   value: { raw: string; cooked?: string },
//   tail?: boolean
// ): TemplateElement;
//
// export function templateLiteral(
//   quasis: Array<TemplateElement>,
//   expressions: Array<Expression>
// ): TemplateLiteral;
//
// export function yieldExpression(
//   argument?: Expression | null,
//   delegate?: boolean
// ): YieldExpression;
//
// export function awaitExpression(argument: Expression): AwaitExpression;
// declare function _import(): Import;
//
// export { _import as import };
//
// export function bigIntLiteral(value: string): BigIntLiteral;
//
// export function exportNamespaceSpecifier(
//   exported: Identifier
// ): ExportNamespaceSpecifier;
//
// export function optionalMemberExpression(
//   object: Expression,
//   property: Expression | Identifier,
//   computed: boolean | undefined,
//   optional: boolean
// ): OptionalMemberExpression;
//
// export function optionalCallExpression(
//   callee: Expression,
//   _arguments: Array<Expression | SpreadElement | JSXNamespacedName>,
//   optional: boolean
// ): OptionalCallExpression;
//
// export function anyTypeAnnotation(): AnyTypeAnnotation;
//
// export function arrayTypeAnnotation(elementType: FlowType): ArrayTypeAnnotation;
//
// export function booleanTypeAnnotation(): BooleanTypeAnnotation;
//
// export function booleanLiteralTypeAnnotation(
//   value: boolean
// ): BooleanLiteralTypeAnnotation;
//
// export function nullLiteralTypeAnnotation(): NullLiteralTypeAnnotation;
//
// export function classImplements(
//   id: Identifier,
//   typeParameters?: TypeParameterInstantiation | null
// ): ClassImplements;
//
// export function declareClass(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   _extends: Array<InterfaceExtends> | null | undefined,
//   body: ObjectTypeAnnotation
// ): DeclareClass;
//
// export function declareFunction(id: Identifier): DeclareFunction;
//
// export function declareInterface(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   _extends: Array<InterfaceExtends> | null | undefined,
//   body: ObjectTypeAnnotation
// ): DeclareInterface;
//
// export function declareModule(
//   id: Identifier | StringLiteral,
//   body: BlockStatement,
//   kind?: "CommonJS" | "ES" | null
// ): DeclareModule;
//
// export function declareModuleExports(
//   typeAnnotation: TypeAnnotation
// ): DeclareModuleExports;
//
// export function declareTypeAlias(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   right: FlowType
// ): DeclareTypeAlias;
//
// export function declareOpaqueType(
//   id: Identifier,
//   typeParameters?: TypeParameterDeclaration | null,
//   supertype?: FlowType | null
// ): DeclareOpaqueType;
//
// export function declareVariable(id: Identifier): DeclareVariable;
//
// export function declareExportDeclaration(
//   declaration?: Flow | null,
//   specifiers?: Array<ExportSpecifier | ExportNamespaceSpecifier> | null,
//   source?: StringLiteral | null
// ): DeclareExportDeclaration;
//
// export function declareExportAllDeclaration(
//   source: StringLiteral
// ): DeclareExportAllDeclaration;
//
// export function declaredPredicate(value: Flow): DeclaredPredicate;
//
// export function existsTypeAnnotation(): ExistsTypeAnnotation;
//
// export function functionTypeAnnotation(
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   params: Array<FunctionTypeParam>,
//   rest: FunctionTypeParam | null | undefined,
//   returnType: FlowType
// ): FunctionTypeAnnotation;
//
// export function functionTypeParam(
//   name: Identifier | null | undefined,
//   typeAnnotation: FlowType
// ): FunctionTypeParam;
//
// export function genericTypeAnnotation(
//   id: Identifier | QualifiedTypeIdentifier,
//   typeParameters?: TypeParameterInstantiation | null
// ): GenericTypeAnnotation;
//
// export function inferredPredicate(): InferredPredicate;
//
// export function interfaceExtends(
//   id: Identifier | QualifiedTypeIdentifier,
//   typeParameters?: TypeParameterInstantiation | null
// ): InterfaceExtends;
//
// export function interfaceDeclaration(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   _extends: Array<InterfaceExtends> | null | undefined,
//   body: ObjectTypeAnnotation
// ): InterfaceDeclaration;
//
// export function interfaceTypeAnnotation(
//   _extends: Array<InterfaceExtends> | null | undefined,
//   body: ObjectTypeAnnotation
// ): InterfaceTypeAnnotation;
//
// export function intersectionTypeAnnotation(
//   types: Array<FlowType>
// ): IntersectionTypeAnnotation;
//
// export function mixedTypeAnnotation(): MixedTypeAnnotation;
//
// export function emptyTypeAnnotation(): EmptyTypeAnnotation;
//
// export function nullableTypeAnnotation(
//   typeAnnotation: FlowType
// ): NullableTypeAnnotation;
//
// export function numberLiteralTypeAnnotation(
//   value: number
// ): NumberLiteralTypeAnnotation;
//
// export function numberTypeAnnotation(): NumberTypeAnnotation;
//
// export function objectTypeAnnotation(
//   properties: Array<ObjectTypeProperty | ObjectTypeSpreadProperty>,
//   indexers?: Array<ObjectTypeIndexer> | null,
//   callProperties?: Array<ObjectTypeCallProperty> | null,
//   internalSlots?: Array<ObjectTypeInternalSlot> | null,
//   exact?: boolean
// ): ObjectTypeAnnotation;
//
// export function objectTypeInternalSlot(
//   id: Identifier,
//   value: FlowType,
//   optional: boolean,
//   _static: boolean,
//   method: boolean
// ): ObjectTypeInternalSlot;
//
// export function objectTypeCallProperty(value: FlowType): ObjectTypeCallProperty;
//
// export function objectTypeIndexer(
//   id: Identifier | null | undefined,
//   key: FlowType,
//   value: FlowType,
//   variance?: Variance | null
// ): ObjectTypeIndexer;
//
// export function objectTypeProperty(
//   key: Identifier | StringLiteral,
//   value: FlowType,
//   variance?: Variance | null
// ): ObjectTypeProperty;
//
// export function objectTypeSpreadProperty(
//   argument: FlowType
// ): ObjectTypeSpreadProperty;
//
// export function opaqueType(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   supertype: FlowType | null | undefined,
//   impltype: FlowType
// ): OpaqueType;
//
// export function qualifiedTypeIdentifier(
//   id: Identifier,
//   qualification: Identifier | QualifiedTypeIdentifier
// ): QualifiedTypeIdentifier;
//
// export function stringLiteralTypeAnnotation(
//   value: string
// ): StringLiteralTypeAnnotation;
//
// export function stringTypeAnnotation(): StringTypeAnnotation;
//
// export function symbolTypeAnnotation(): SymbolTypeAnnotation;
//
// export function thisTypeAnnotation(): ThisTypeAnnotation;
//
// export function tupleTypeAnnotation(
//   types: Array<FlowType>
// ): TupleTypeAnnotation;
//
// export function typeofTypeAnnotation(argument: FlowType): TypeofTypeAnnotation;
//
// export function typeAlias(
//   id: Identifier,
//   typeParameters: TypeParameterDeclaration | null | undefined,
//   right: FlowType
// ): TypeAlias;
//
// export function typeAnnotation(typeAnnotation: FlowType): TypeAnnotation;
//
// export function typeCastExpression(
//   expression: Expression,
//   typeAnnotation: TypeAnnotation
// ): TypeCastExpression;
//
// export function typeParameter(
//   bound?: TypeAnnotation | null,
//   _default?: FlowType | null,
//   variance?: Variance | null
// ): TypeParameter;
//
// export function typeParameterDeclaration(
//   params: Array<TypeParameter>
// ): TypeParameterDeclaration;
//
// export function typeParameterInstantiation(
//   params: Array<FlowType>
// ): TypeParameterInstantiation;
//
// export function unionTypeAnnotation(
//   types: Array<FlowType>
// ): UnionTypeAnnotation;
//
// export function variance(kind: "minus" | "plus"): Variance;
//
// export function voidTypeAnnotation(): VoidTypeAnnotation;
//
// export function enumDeclaration(
//   id: Identifier,
//   body: EnumBooleanBody | EnumNumberBody | EnumStringBody | EnumSymbolBody
// ): EnumDeclaration;
//
// export function enumBooleanBody(
//   members: Array<EnumBooleanMember>
// ): EnumBooleanBody;
//
// export function enumNumberBody(
//   members: Array<EnumNumberMember>
// ): EnumNumberBody;
//
// export function enumStringBody(
//   members: Array<EnumStringMember | EnumDefaultedMember>
// ): EnumStringBody;
//
// export function enumSymbolBody(
//   members: Array<EnumDefaultedMember>
// ): EnumSymbolBody;
//
// export function enumBooleanMember(id: Identifier): EnumBooleanMember;
//
// export function enumNumberMember(
//   id: Identifier,
//   init: NumericLiteral
// ): EnumNumberMember;
//
// export function enumStringMember(
//   id: Identifier,
//   init: StringLiteral
// ): EnumStringMember;
//
// export function enumDefaultedMember(id: Identifier): EnumDefaultedMember;
//
// export function jsxAttribute(
//   name: JSXIdentifier | JSXNamespacedName,
//   value?:
//     | JSXElement
//     | JSXFragment
//     | StringLiteral
//     | JSXExpressionContainer
//     | null
// ): JSXAttribute;
//
// export function jsxClosingElement(
//   name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
// ): JSXClosingElement;
//
// export function jsxElement(
//   openingElement: JSXOpeningElement,
//   closingElement: JSXClosingElement | null | undefined,
//   children: Array<
//     JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
//   >,
//   selfClosing?: boolean | null
// ): JSXElement;
//
// export function jsxEmptyExpression(): JSXEmptyExpression;
//
// export function jsxExpressionContainer(
//   expression: Expression | JSXEmptyExpression
// ): JSXExpressionContainer;
//
// export function jsxSpreadChild(expression: Expression): JSXSpreadChild;
//
// export function jsxIdentifier(name: string): JSXIdentifier;
//
// export function jsxMemberExpression(
//   object: JSXMemberExpression | JSXIdentifier,
//   property: JSXIdentifier
// ): JSXMemberExpression;
//
// export function jsxNamespacedName(
//   namespace: JSXIdentifier,
//   name: JSXIdentifier
// ): JSXNamespacedName;
//
// export function jsxOpeningElement(
//   name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName,
//   attributes: Array<JSXAttribute | JSXSpreadAttribute>,
//   selfClosing?: boolean
// ): JSXOpeningElement;
//
// export function jsxSpreadAttribute(argument: Expression): JSXSpreadAttribute;
//
// export function jsxText(value: string): JSXText;
//
// export function jsxFragment(
//   openingFragment: JSXOpeningFragment,
//   closingFragment: JSXClosingFragment,
//   children: Array<
//     JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement | JSXFragment
//   >
// ): JSXFragment;
//
// export function jsxOpeningFragment(): JSXOpeningFragment;
//
// export function jsxClosingFragment(): JSXClosingFragment;
//
// export function noop(): Noop;
//
// export function placeholder(
//   expectedNode:
//     | "Identifier"
//     | "StringLiteral"
//     | "Expression"
//     | "Statement"
//     | "Declaration"
//     | "BlockStatement"
//     | "ClassBody"
//     | "Pattern",
//   name: Identifier
// ): Placeholder;
//
// export function v8IntrinsicIdentifier(name: string): V8IntrinsicIdentifier;
//
// export function argumentPlaceholder(): ArgumentPlaceholder;
//
// export function bindExpression(
//   object: Expression,
//   callee: Expression
// ): BindExpression;
//
// export function classProperty(
//   key: Identifier | StringLiteral | NumericLiteral | Expression,
//   value?: Expression | null,
//   typeAnnotation?: TypeAnnotation | TSTypeAnnotation | Noop | null,
//   decorators?: Array<Decorator> | null,
//   computed?: boolean,
//   _static?: boolean
// ): ClassProperty;
//
// export function pipelineTopicExpression(
//   expression: Expression
// ): PipelineTopicExpression;
//
// export function pipelineBareFunction(callee: Expression): PipelineBareFunction;
//
// export function pipelinePrimaryTopicReference(): PipelinePrimaryTopicReference;
//
// export function classPrivateProperty(
//   key: PrivateName,
//   value?: Expression | null,
//   decorators?: Array<Decorator> | null
// ): ClassPrivateProperty;
//
// export function classPrivateMethod(
//   kind: "get" | "set" | "method" | "constructor" | undefined,
//   key: PrivateName,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   body: BlockStatement,
//   _static?: boolean
// ): ClassPrivateMethod;
//
// export function importAttribute(
//   key: Identifier,
//   value: StringLiteral
// ): ImportAttribute;
//
// export function decorator(expression: Expression): Decorator;
//
// export function doExpression(body: BlockStatement): DoExpression;
//
// export function exportDefaultSpecifier(
//   exported: Identifier
// ): ExportDefaultSpecifier;
//
// export function privateName(id: Identifier): PrivateName;
//
// export function recordExpression(
//   properties: Array<ObjectProperty | SpreadElement>
// ): RecordExpression;
//
// export function tupleExpression(
//   elements?: Array<Expression | SpreadElement>
// ): TupleExpression;
//
// export function decimalLiteral(value: string): DecimalLiteral;
//
// export function tsParameterProperty(
//   parameter: Identifier | AssignmentPattern
// ): TSParameterProperty;
//
// export function tsDeclareFunction(
//   id: Identifier | null | undefined,
//   typeParameters: TSTypeParameterDeclaration | Noop | null | undefined,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   returnType?: TSTypeAnnotation | Noop | null
// ): TSDeclareFunction;
//
// export function tsDeclareMethod(
//   decorators: Array<Decorator> | null | undefined,
//   key: Identifier | StringLiteral | NumericLiteral | Expression,
//   typeParameters: TSTypeParameterDeclaration | Noop | null | undefined,
//   params: Array<Identifier | Pattern | RestElement | TSParameterProperty>,
//   returnType?: TSTypeAnnotation | Noop | null
// ): TSDeclareMethod;
//
// export function tsQualifiedName(
//   left: TSEntityName,
//   right: Identifier
// ): TSQualifiedName;
//
// export function tsCallSignatureDeclaration(
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   parameters: Array<Identifier | RestElement>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSCallSignatureDeclaration;
//
// export function tsConstructSignatureDeclaration(
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   parameters: Array<Identifier | RestElement>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSConstructSignatureDeclaration;
//
// export function tsPropertySignature(
//   key: Expression,
//   typeAnnotation?: TSTypeAnnotation | null,
//   initializer?: Expression | null
// ): TSPropertySignature;
//
// export function tsMethodSignature(
//   key: Expression,
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   parameters: Array<Identifier | RestElement>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSMethodSignature;
//
// export function tsIndexSignature(
//   parameters: Array<Identifier>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSIndexSignature;
//
// export function tsAnyKeyword(): TSAnyKeyword;
//
// export function tsBooleanKeyword(): TSBooleanKeyword;
//
// export function tsBigIntKeyword(): TSBigIntKeyword;
//
// export function tsNeverKeyword(): TSNeverKeyword;
//
// export function tsNullKeyword(): TSNullKeyword;
//
// export function tsNumberKeyword(): TSNumberKeyword;
//
// export function tsObjectKeyword(): TSObjectKeyword;
//
// export function tsStringKeyword(): TSStringKeyword;
//
// export function tsSymbolKeyword(): TSSymbolKeyword;
//
// export function tsUndefinedKeyword(): TSUndefinedKeyword;
//
// export function tsUnknownKeyword(): TSUnknownKeyword;
//
// export function tsVoidKeyword(): TSVoidKeyword;
//
// export function tsThisType(): TSThisType;
//
// export function tsFunctionType(
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   parameters: Array<Identifier | RestElement>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSFunctionType;
//
// export function tsConstructorType(
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   parameters: Array<Identifier | RestElement>,
//   typeAnnotation?: TSTypeAnnotation | null
// ): TSConstructorType;
//
// export function tsTypeReference(
//   typeName: TSEntityName,
//   typeParameters?: TSTypeParameterInstantiation | null
// ): TSTypeReference;
//
// export function tsTypePredicate(
//   parameterName: Identifier | TSThisType,
//   typeAnnotation?: TSTypeAnnotation | null,
//   asserts?: boolean | null
// ): TSTypePredicate;
//
// export function tsTypeQuery(exprName: TSEntityName | TSImportType): TSTypeQuery;
//
// export function tsTypeLiteral(members: Array<TSTypeElement>): TSTypeLiteral;
//
// export function tsArrayType(elementType: TSType): TSArrayType;
//
// export function tsTupleType(
//   elementTypes: Array<TSType | TSNamedTupleMember>
// ): TSTupleType;
//
// export function tsOptionalType(typeAnnotation: TSType): TSOptionalType;
//
// export function tsRestType(typeAnnotation: TSType): TSRestType;
//
// export function tsNamedTupleMember(
//   label: Identifier,
//   elementType: TSType,
//   optional?: boolean
// ): TSNamedTupleMember;
//
// export function tsUnionType(types: Array<TSType>): TSUnionType;
//
// export function tsIntersectionType(types: Array<TSType>): TSIntersectionType;
//
// export function tsConditionalType(
//   checkType: TSType,
//   extendsType: TSType,
//   trueType: TSType,
//   falseType: TSType
// ): TSConditionalType;
//
// export function tsInferType(typeParameter: TSTypeParameter): TSInferType;
//
// export function tsParenthesizedType(
//   typeAnnotation: TSType
// ): TSParenthesizedType;
//
// export function tsTypeOperator(typeAnnotation: TSType): TSTypeOperator;
//
// export function tsIndexedAccessType(
//   objectType: TSType,
//   indexType: TSType
// ): TSIndexedAccessType;
//
// export function tsMappedType(
//   typeParameter: TSTypeParameter,
//   typeAnnotation?: TSType | null
// ): TSMappedType;
//
// export function tsLiteralType(
//   literal: NumericLiteral | StringLiteral | BooleanLiteral | BigIntLiteral
// ): TSLiteralType;
//
// export function tsExpressionWithTypeArguments(
//   expression: TSEntityName,
//   typeParameters?: TSTypeParameterInstantiation | null
// ): TSExpressionWithTypeArguments;
//
// export function tsInterfaceDeclaration(
//   id: Identifier,
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   _extends: Array<TSExpressionWithTypeArguments> | null | undefined,
//   body: TSInterfaceBody
// ): TSInterfaceDeclaration;
//
// export function tsInterfaceBody(body: Array<TSTypeElement>): TSInterfaceBody;
//
// export function tsTypeAliasDeclaration(
//   id: Identifier,
//   typeParameters: TSTypeParameterDeclaration | null | undefined,
//   typeAnnotation: TSType
// ): TSTypeAliasDeclaration;
//
// export function tsAsExpression(
//   expression: Expression,
//   typeAnnotation: TSType
// ): TSAsExpression;
//
// export function tsTypeAssertion(
//   typeAnnotation: TSType,
//   expression: Expression
// ): TSTypeAssertion;
//
// export function tsEnumDeclaration(
//   id: Identifier,
//   members: Array<TSEnumMember>
// ): TSEnumDeclaration;
//
// export function tsEnumMember(
//   id: Identifier | StringLiteral,
//   initializer?: Expression | null
// ): TSEnumMember;
//
// export function tsModuleDeclaration(
//   id: Identifier | StringLiteral,
//   body: TSModuleBlock | TSModuleDeclaration
// ): TSModuleDeclaration;
//
// export function tsModuleBlock(body: Array<Statement>): TSModuleBlock;
//
// export function tsImportType(
//   argument: StringLiteral,
//   qualifier?: TSEntityName | null,
//   typeParameters?: TSTypeParameterInstantiation | null
// ): TSImportType;
//
// export function tsImportEqualsDeclaration(
//   id: Identifier,
//   moduleReference: TSEntityName | TSExternalModuleReference
// ): TSImportEqualsDeclaration;
//
// export function tsExternalModuleReference(
//   expression: StringLiteral
// ): TSExternalModuleReference;
//
// export function tsNonNullExpression(
//   expression: Expression
// ): TSNonNullExpression;
//
// export function tsExportAssignment(expression: Expression): TSExportAssignment;
//
// export function tsNamespaceExportDeclaration(
//   id: Identifier
// ): TSNamespaceExportDeclaration;
//
// export function tsTypeAnnotation(typeAnnotation: TSType): TSTypeAnnotation;
//
// export function tsTypeParameterInstantiation(
//   params: Array<TSType>
// ): TSTypeParameterInstantiation;
//
// export function tsTypeParameterDeclaration(
//   params: Array<TSTypeParameter>
// ): TSTypeParameterDeclaration;
//
// export function tsTypeParameter(
//   constraint: TSType | null | undefined,
//   _default: TSType | null | undefined,
//   name: string
// ): TSTypeParameter;
//
// export function isAnyTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is AnyTypeAnnotation;
//
// export function isArgumentPlaceholder(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ArgumentPlaceholder;
//
// export function isArrayExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ArrayExpression;
//
// export function isArrayPattern(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ArrayPattern;
//
// export function isArrayTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ArrayTypeAnnotation;
//
// export function isArrowFunctionExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ArrowFunctionExpression;
//
// export function isAssignmentExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is AssignmentExpression;
//
// export function isAssignmentPattern(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is AssignmentPattern;
//
// export function isAwaitExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is AwaitExpression;
//
// export function isBigIntLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BigIntLiteral;
//
// export function isBinary(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Binary;
//
// export function isBinaryExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BinaryExpression;
//
// export function isBindExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BindExpression;
//
// export function isBlock(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Block;
//
// export function isBlockParent(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BlockParent;
//
// export function isBlockStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BlockStatement;
//
// export function isBooleanLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BooleanLiteral;
//
// export function isBooleanLiteralTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BooleanLiteralTypeAnnotation;
//
// export function isBooleanTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BooleanTypeAnnotation;
//
// export function isBreakStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is BreakStatement;
//
// export function isCallExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is CallExpression;
//
// export function isCatchClause(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is CatchClause;
//
// export function isClass(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Class;
//
// export function isClassBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassBody;
//
// export function isClassDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassDeclaration;
//
// export function isClassExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassExpression;
//
// export function isClassImplements(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassImplements;
//
// export function isClassMethod(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassMethod;
//
// export function isClassPrivateMethod(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassPrivateMethod;
//
// export function isClassPrivateProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassPrivateProperty;
//
// export function isClassProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ClassProperty;
//
// export function isCompletionStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is CompletionStatement;
//
// export function isConditional(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Conditional;
//
// export function isConditionalExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ConditionalExpression;
//
// export function isContinueStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ContinueStatement;
//
// export function isDebuggerStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DebuggerStatement;
//
// export function isDecimalLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DecimalLiteral;
//
// export function isDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Declaration;
//
// export function isDeclareClass(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareClass;
//
// export function isDeclareExportAllDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareExportAllDeclaration;
//
// export function isDeclareExportDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareExportDeclaration;
//
// export function isDeclareFunction(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareFunction;
//
// export function isDeclareInterface(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareInterface;
//
// export function isDeclareModule(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareModule;
//
// export function isDeclareModuleExports(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareModuleExports;
//
// export function isDeclareOpaqueType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareOpaqueType;
//
// export function isDeclareTypeAlias(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareTypeAlias;
//
// export function isDeclareVariable(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclareVariable;
//
// export function isDeclaredPredicate(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DeclaredPredicate;
//
// export function isDecorator(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Decorator;
//
// export function isDirective(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Directive;
//
// export function isDirectiveLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DirectiveLiteral;
//
// export function isDoExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DoExpression;
//
// export function isDoWhileStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is DoWhileStatement;
//
// export function isEmptyStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EmptyStatement;
//
// export function isEmptyTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EmptyTypeAnnotation;
//
// export function isEnumBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumBody;
//
// export function isEnumBooleanBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumBooleanBody;
//
// export function isEnumBooleanMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumBooleanMember;
//
// export function isEnumDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumDeclaration;
//
// export function isEnumDefaultedMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumDefaultedMember;
//
// export function isEnumMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumMember;
//
// export function isEnumNumberBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumNumberBody;
//
// export function isEnumNumberMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumNumberMember;
//
// export function isEnumStringBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumStringBody;
//
// export function isEnumStringMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumStringMember;
//
// export function isEnumSymbolBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is EnumSymbolBody;
//
// export function isExistsTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExistsTypeAnnotation;
//
// export function isExportAllDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportAllDeclaration;
//
// export function isExportDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportDeclaration;
//
// export function isExportDefaultDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportDefaultDeclaration;
//
// export function isExportDefaultSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportDefaultSpecifier;
//
// export function isExportNamedDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportNamedDeclaration;
//
// export function isExportNamespaceSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportNamespaceSpecifier;
//
// export function isExportSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExportSpecifier;
//
// export function isExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Expression;
//
// export function isExpressionStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExpressionStatement;
//
// export function isExpressionWrapper(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ExpressionWrapper;
//
// export function isFile(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is File;
//
// export function isFlow(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Flow;
//
// export function isFlowBaseAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FlowBaseAnnotation;
//
// export function isFlowDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FlowDeclaration;
//
// export function isFlowPredicate(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FlowPredicate;
//
// export function isFlowType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FlowType;
//
// export function isFor(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is For;
//
// export function isForInStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ForInStatement;
//
// export function isForOfStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ForOfStatement;
//
// export function isForStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ForStatement;
//
// export function isForXStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ForXStatement;
//
// export function isFunction(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Function;
//
// export function isFunctionDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FunctionDeclaration;
//
// export function isFunctionExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FunctionExpression;
//
// export function isFunctionParent(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FunctionParent;
//
// export function isFunctionTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FunctionTypeAnnotation;
//
// export function isFunctionTypeParam(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is FunctionTypeParam;
//
// export function isGenericTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is GenericTypeAnnotation;
//
// export function isIdentifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Identifier;
//
// export function isIfStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is IfStatement;
//
// export function isImmutable(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Immutable;
//
// export function isImport(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Import;
//
// export function isImportAttribute(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ImportAttribute;
//
// export function isImportDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ImportDeclaration;
//
// export function isImportDefaultSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ImportDefaultSpecifier;
//
// export function isImportNamespaceSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ImportNamespaceSpecifier;
//
// export function isImportSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ImportSpecifier;
//
// export function isInferredPredicate(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is InferredPredicate;
//
// export function isInterfaceDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is InterfaceDeclaration;
//
// export function isInterfaceExtends(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is InterfaceExtends;
//
// export function isInterfaceTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is InterfaceTypeAnnotation;
//
// export function isInterpreterDirective(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is InterpreterDirective;
//
// export function isIntersectionTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is IntersectionTypeAnnotation;
//
// export function isJSX(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSX;
//
// export function isJSXAttribute(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXAttribute;
//
// export function isJSXClosingElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXClosingElement;
//
// export function isJSXClosingFragment(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXClosingFragment;
//
// export function isJSXElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXElement;
//
// export function isJSXEmptyExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXEmptyExpression;
//
// export function isJSXExpressionContainer(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXExpressionContainer;
//
// export function isJSXFragment(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXFragment;
//
// export function isJSXIdentifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXIdentifier;
//
// export function isJSXMemberExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXMemberExpression;
//
// export function isJSXNamespacedName(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXNamespacedName;
//
// export function isJSXOpeningElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXOpeningElement;
//
// export function isJSXOpeningFragment(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXOpeningFragment;
//
// export function isJSXSpreadAttribute(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXSpreadAttribute;
//
// export function isJSXSpreadChild(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXSpreadChild;
//
// export function isJSXText(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is JSXText;
//
// export function isLVal(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is LVal;
//
// export function isLabeledStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is LabeledStatement;
//
// export function isLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Literal;
//
// export function isLogicalExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is LogicalExpression;
//
// export function isLoop(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Loop;
//
// export function isMemberExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is MemberExpression;
//
// export function isMetaProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is MetaProperty;
//
// export function isMethod(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Method;
//
// export function isMixedTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is MixedTypeAnnotation;
//
// export function isModuleDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ModuleDeclaration;
//
// export function isModuleSpecifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ModuleSpecifier;
//
// export function isNewExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NewExpression;
//
// export function isNoop(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Noop;
//
// export function isNullLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NullLiteral;
//
// export function isNullLiteralTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NullLiteralTypeAnnotation;
//
// export function isNullableTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NullableTypeAnnotation;
//
// export function isNumberLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): boolean;
//
// export function isNumberLiteralTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NumberLiteralTypeAnnotation;
//
// export function isNumberTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NumberTypeAnnotation;
//
// export function isNumericLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is NumericLiteral;
//
// export function isObjectExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectExpression;
//
// export function isObjectMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectMember;
//
// export function isObjectMethod(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectMethod;
//
// export function isObjectPattern(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectPattern;
//
// export function isObjectProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectProperty;
//
// export function isObjectTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeAnnotation;
//
// export function isObjectTypeCallProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeCallProperty;
//
// export function isObjectTypeIndexer(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeIndexer;
//
// export function isObjectTypeInternalSlot(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeInternalSlot;
//
// export function isObjectTypeProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeProperty;
//
// export function isObjectTypeSpreadProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ObjectTypeSpreadProperty;
//
// export function isOpaqueType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is OpaqueType;
//
// export function isOptionalCallExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is OptionalCallExpression;
//
// export function isOptionalMemberExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is OptionalMemberExpression;
//
// export function isParenthesizedExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ParenthesizedExpression;
//
// export function isPattern(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Pattern;
//
// export function isPatternLike(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is PatternLike;
//
// export function isPipelineBareFunction(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is PipelineBareFunction;
//
// export function isPipelinePrimaryTopicReference(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is PipelinePrimaryTopicReference;
//
// export function isPipelineTopicExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is PipelineTopicExpression;
//
// export function isPlaceholder(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Placeholder;
//
// export function isPrivate(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Private;
//
// export function isPrivateName(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is PrivateName;
//
// export function isProgram(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Program;
//
// export function isProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Property;
//
// export function isPureish(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Pureish;
//
// export function isQualifiedTypeIdentifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is QualifiedTypeIdentifier;
//
// export function isRecordExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is RecordExpression;
//
// export function isRegExpLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is RegExpLiteral;
//
// export function isRegexLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): boolean;
//
// export function isRestElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is RestElement;
//
// export function isRestProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): boolean;
//
// export function isReturnStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ReturnStatement;
//
// export function isScopable(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Scopable;
//
// export function isSequenceExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is SequenceExpression;
//
// export function isSpreadElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is SpreadElement;
//
// export function isSpreadProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): boolean;
//
// export function isStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Statement;
//
// export function isStringLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is StringLiteral;
//
// export function isStringLiteralTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is StringLiteralTypeAnnotation;
//
// export function isStringTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is StringTypeAnnotation;
//
// export function isSuper(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Super;
//
// export function isSwitchCase(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is SwitchCase;
//
// export function isSwitchStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is SwitchStatement;
//
// export function isSymbolTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is SymbolTypeAnnotation;
//
// export function isTSAnyKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSAnyKeyword;
//
// export function isTSArrayType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSArrayType;
//
// export function isTSAsExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSAsExpression;
//
// export function isTSBaseType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSBaseType;
//
// export function isTSBigIntKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSBigIntKeyword;
//
// export function isTSBooleanKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSBooleanKeyword;
//
// export function isTSCallSignatureDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSCallSignatureDeclaration;
//
// export function isTSConditionalType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSConditionalType;
//
// export function isTSConstructSignatureDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSConstructSignatureDeclaration;
//
// export function isTSConstructorType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSConstructorType;
//
// export function isTSDeclareFunction(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSDeclareFunction;
//
// export function isTSDeclareMethod(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSDeclareMethod;
//
// export function isTSEntityName(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSEntityName;
//
// export function isTSEnumDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSEnumDeclaration;
//
// export function isTSEnumMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSEnumMember;
//
// export function isTSExportAssignment(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSExportAssignment;
//
// export function isTSExpressionWithTypeArguments(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSExpressionWithTypeArguments;
//
// export function isTSExternalModuleReference(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSExternalModuleReference;
//
// export function isTSFunctionType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSFunctionType;
//
// export function isTSImportEqualsDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSImportEqualsDeclaration;
//
// export function isTSImportType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSImportType;
//
// export function isTSIndexSignature(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSIndexSignature;
//
// export function isTSIndexedAccessType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSIndexedAccessType;
//
// export function isTSInferType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSInferType;
//
// export function isTSInterfaceBody(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSInterfaceBody;
//
// export function isTSInterfaceDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSInterfaceDeclaration;
//
// export function isTSIntersectionType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSIntersectionType;
//
// export function isTSLiteralType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSLiteralType;
//
// export function isTSMappedType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSMappedType;
//
// export function isTSMethodSignature(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSMethodSignature;
//
// export function isTSModuleBlock(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSModuleBlock;
//
// export function isTSModuleDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSModuleDeclaration;
//
// export function isTSNamedTupleMember(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNamedTupleMember;
//
// export function isTSNamespaceExportDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNamespaceExportDeclaration;
//
// export function isTSNeverKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNeverKeyword;
//
// export function isTSNonNullExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNonNullExpression;
//
// export function isTSNullKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNullKeyword;
//
// export function isTSNumberKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSNumberKeyword;
//
// export function isTSObjectKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSObjectKeyword;
//
// export function isTSOptionalType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSOptionalType;
//
// export function isTSParameterProperty(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSParameterProperty;
//
// export function isTSParenthesizedType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSParenthesizedType;
//
// export function isTSPropertySignature(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSPropertySignature;
//
// export function isTSQualifiedName(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSQualifiedName;
//
// export function isTSRestType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSRestType;
//
// export function isTSStringKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSStringKeyword;
//
// export function isTSSymbolKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSSymbolKeyword;
//
// export function isTSThisType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSThisType;
//
// export function isTSTupleType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTupleType;
//
// export function isTSType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSType;
//
// export function isTSTypeAliasDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeAliasDeclaration;
//
// export function isTSTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeAnnotation;
//
// export function isTSTypeAssertion(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeAssertion;
//
// export function isTSTypeElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeElement;
//
// export function isTSTypeLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeLiteral;
//
// export function isTSTypeOperator(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeOperator;
//
// export function isTSTypeParameter(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeParameter;
//
// export function isTSTypeParameterDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeParameterDeclaration;
//
// export function isTSTypeParameterInstantiation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeParameterInstantiation;
//
// export function isTSTypePredicate(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypePredicate;
//
// export function isTSTypeQuery(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeQuery;
//
// export function isTSTypeReference(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSTypeReference;
//
// export function isTSUndefinedKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSUndefinedKeyword;
//
// export function isTSUnionType(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSUnionType;
//
// export function isTSUnknownKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSUnknownKeyword;
//
// export function isTSVoidKeyword(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TSVoidKeyword;
//
// export function isTaggedTemplateExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TaggedTemplateExpression;
//
// export function isTemplateElement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TemplateElement;
//
// export function isTemplateLiteral(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TemplateLiteral;
//
// export function isTerminatorless(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Terminatorless;
//
// export function isThisExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ThisExpression;
//
// export function isThisTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ThisTypeAnnotation;
//
// export function isThrowStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is ThrowStatement;
//
// export function isTryStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TryStatement;
//
// export function isTupleExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TupleExpression;
//
// export function isTupleTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TupleTypeAnnotation;
//
// export function isTypeAlias(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeAlias;
//
// export function isTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeAnnotation;
//
// export function isTypeCastExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeCastExpression;
//
// export function isTypeParameter(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeParameter;
//
// export function isTypeParameterDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeParameterDeclaration;
//
// export function isTypeParameterInstantiation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeParameterInstantiation;
//
// export function isTypeofTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is TypeofTypeAnnotation;
//
// export function isUnaryExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is UnaryExpression;
//
// export function isUnaryLike(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is UnaryLike;
//
// export function isUnionTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is UnionTypeAnnotation;
//
// export function isUpdateExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is UpdateExpression;
//
// export function isUserWhitespacable(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is UserWhitespacable;
//
// export function isV8IntrinsicIdentifier(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is V8IntrinsicIdentifier;
//
// export function isVariableDeclaration(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is VariableDeclaration;
//
// export function isVariableDeclarator(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is VariableDeclarator;
//
// export function isVariance(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is Variance;
//
// export function isVoidTypeAnnotation(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is VoidTypeAnnotation;
//
// export function isWhile(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is While;
//
// export function isWhileStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is WhileStatement;
//
// export function isWithStatement(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is WithStatement;
//
// export function isYieldExpression(
//   node: object | null | undefined,
//   opts?: object | null
// ): node is YieldExpression;
//
// export function createTypeAnnotationBasedOnTypeof(
//   type:
//     | "string"
//     | "number"
//     | "undefined"
//     | "boolean"
//     | "function"
//     | "object"
//     | "symbol"
// ):
//   | StringTypeAnnotation
//   | VoidTypeAnnotation
//   | NumberTypeAnnotation
//   | BooleanTypeAnnotation
//   | GenericTypeAnnotation;
//
// export function createUnionTypeAnnotation<T extends FlowType>(types: [T]): T;
//
// export function createFlowUnionType<T extends FlowType>(types: [T]): T;
//
// export function createUnionTypeAnnotation(
//   types: ReadonlyArray<FlowType>
// ): UnionTypeAnnotation;
//
// export function createFlowUnionType(
//   types: ReadonlyArray<FlowType>
// ): UnionTypeAnnotation;
//
// export function buildChildren(node: {
//   children: ReadonlyArray<
//     | JSXText
//     | JSXExpressionContainer
//     | JSXSpreadChild
//     | JSXElement
//     | JSXFragment
//     | JSXEmptyExpression
//   >;
// }): JSXElement["children"];
//
// export function clone<T extends Node>(n: T): T;
//
// export function cloneDeep<T extends Node>(n: T): T;
//
// export function cloneDeepWithoutLoc<T extends Node>(n: T): T;
//
// export function cloneNode<T extends Node>(
//   n: T,
//   deep?: boolean,
//   withoutLoc?: boolean
// ): T;
//
// export function cloneWithoutLoc<T extends Node>(n: T): T;

export type CommentTypeShorthand = "leading" | "inner" | "trailing";

// export function addComment<T extends Node>(
//   node: T,
//   type: CommentTypeShorthand,
//   content: string,
//   line?: boolean
// ): T;
//
// export function addComments<T extends Node>(
//   node: T,
//   type: CommentTypeShorthand,
//   comments: ReadonlyArray<Comment>
// ): T;
//
// export function inheritInnerComments(node: Node, parent: Node): void;
//
// export function inheritLeadingComments(node: Node, parent: Node): void;
//
// export function inheritsComments<T extends Node>(node: T, parent: Node): void;
//
// export function inheritTrailingComments(node: Node, parent: Node): void;
//
// export function removeComments<T extends Node>(node: T): T;

// export function ensureBlock(
//   node: Extract<Node, { body: BlockStatement | Statement | Expression }>
// ): BlockStatement;
//
// export function ensureBlock<
//   K extends keyof Extract<
//     Node,
//     { body: BlockStatement | Statement | Expression }
//   > = "body"
// >(
//   node: Extract<Node, Record<K, BlockStatement | Statement | Expression>>,
//   key: K
// ): BlockStatement;
//
// export function toBindingIdentifierName(
//   name: { toString(): string } | null | undefined
// ): string;
//
// export function toBlock(
//   node: Statement | Expression,
//   parent?: Function | null
// ): BlockStatement;
//
// export function toComputedKey<
//   T extends Extract<Node, { computed: boolean | null }>
// >(node: T, key?: Expression | Identifier): Expression;
//
// export function toExpression(node: Function): FunctionExpression;
//
// export function toExpression(node: Class): ClassExpression;
//
// export function toExpression(
//   node: ExpressionStatement | Expression | Class | Function
// ): Expression;
//
// export function toIdentifier(
//   name: { toString(): string } | null | undefined
// ): string;
//
// export function toKeyAlias(node: Method | Property, key?: Node): string;
//
// export function toSequenceExpression(
//   nodes: ReadonlyArray<Node>,
//   scope: {
//     push(value: { id: LVal; kind: "var"; init?: Expression }): void;
//     buildUndefinedNode(): Node;
//   }
// ): SequenceExpression | undefined;
//
// export function toStatement(
//   node: AssignmentExpression,
//   ignore?: boolean
// ): ExpressionStatement;
//
// export function toStatement(
//   node: Statement | AssignmentExpression,
//   ignore?: boolean
// ): Statement;
//
// export function toStatement(
//   node: Class,
//   ignore: true
// ): ClassDeclaration | undefined;
//
// export function toStatement(node: Class, ignore?: boolean): ClassDeclaration;
//
// export function toStatement(
//   node: Function,
//   ignore: true
// ): FunctionDeclaration | undefined;
//
// export function toStatement(
//   node: Function,
//   ignore?: boolean
// ): FunctionDeclaration;
//
// export function toStatement(
//   node: Statement | Class | Function | AssignmentExpression,
//   ignore: true
// ): Statement | undefined;
//
// export function toStatement(
//   node: Statement | Class | Function | AssignmentExpression,
//   ignore?: boolean
// ): Statement;
//
// export function valueToNode(value: undefined): Identifier;
//
// export function valueToNode(value: boolean): BooleanLiteral;
//
// export function valueToNode(value: null): NullLiteral;
//
// export function valueToNode(value: string): StringLiteral;
//
// export function valueToNode(
//   value: number
// ): NumericLiteral | BinaryExpression | UnaryExpression;
//
// export function valueToNode(value: RegExp): RegExpLiteral;
//
// export function valueToNode(
//   value: ReadonlyArray<
//     undefined | boolean | null | string | number | RegExp | object
//   >
// ): ArrayExpression;
//
// export function valueToNode(value: object): ObjectExpression;
//
// export function valueToNode(
//   value: undefined | boolean | null | string | number | RegExp | object
// ): Expression;
//
// export function removeTypeDuplicates(
//   types: ReadonlyArray<FlowType | false | null | undefined>
// ): FlowType[];
//
// export function appendToMemberExpression<
//   T extends Pick<MemberExpression, "object" | "property">
// >(member: T, append: MemberExpression["property"], computed?: boolean): T;
//
// export function inherits<T extends Node | null | undefined>(
//   child: T,
//   parent: Node | null | undefined
// ): T;
//
// export function prependToMemberExpression<
//   T extends Pick<MemberExpression, "object" | "property">
// >(member: T, prepend: MemberExpression["object"]): T;
//
// export function removeProperties(
//   n: Node,
//   opts?: { preserveComments: boolean } | null
// ): void;
//
// export function removePropertiesDeep<T extends Node>(
//   n: T,
//   opts?: { preserveComments: boolean } | null
// ): T;
//
// export function getBindingIdentifiers(
//   node: Node,
//   duplicates: true,
//   outerOnly?: boolean
// ): Record<string, Array<Identifier>>;
//
// export function getBindingIdentifiers(
//   node: Node,
//   duplicates?: false,
//   outerOnly?: boolean
// ): Record<string, Identifier>;
//
// export function getBindingIdentifiers(
//   node: Node,
//   duplicates: boolean,
//   outerOnly?: boolean
// ): Record<string, Identifier | Array<Identifier>>;
//
// export function getOuterBindingIdentifiers(
//   node: Node,
//   duplicates: true
// ): Record<string, Array<Identifier>>;
//
// export function getOuterBindingIdentifiers(
//   node: Node,
//   duplicates?: false
// ): Record<string, Identifier>;
//
// export function getOuterBindingIdentifiers(
//   node: Node,
//   duplicates: boolean
// ): Record<string, Identifier | Array<Identifier>>;

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

// export function traverse<T>(
//   n: Node,
//   h: TraversalHandler<T> | TraversalHandlers<T>,
//   state?: T
// ): void;
//
// export function traverseFast<T>(
//   n: Node,
//   h: TraversalHandler<T>,
//   state?: T
// ): void;
//
// export function shallowEqual<T extends object>(
//   actual: object,
//   expected: T
// ): actual is T;
//
// export function buildMatchMemberExpression(
//   match: string,
//   allowPartial?: boolean
// ): (node: Node | null | undefined) => node is MemberExpression;
//
// export function is<T extends Node["type"]>(
//   type: T,
//   n: Node | null | undefined,
//   required?: undefined
// ): n is Extract<Node, { type: T }>;
//
// export function is<
//   T extends Node["type"],
//   P extends Extract<Node, { type: T }>
// >(type: T, n: Node | null | undefined, required: Partial<P>): n is P;
//
// export function is<P extends Node>(
//   type: string,
//   n: Node | null | undefined,
//   required: Partial<P>
// ): n is P;
//
// export function is(
//   type: string,
//   n: Node | null | undefined,
//   required?: Partial<Node>
// ): n is Node;
//
// export function isBinding(
//   node: Node,
//   parent: Node,
//   grandparent?: Node
// ): boolean;
//
// export function isBlockScoped(
//   node: Node
// ): node is FunctionDeclaration | ClassDeclaration | VariableDeclaration;
//
// export function isImmutable(node: Node): node is Immutable;
//
// export function isLet(node: Node): node is VariableDeclaration;
//
// export function isNode(node: object | null | undefined): node is Node;
//
// export function isNodesEquivalent<T extends Partial<Node>>(
//   a: T,
//   b: any
// ): b is T;
//
// export function isNodesEquivalent(a: any, b: any): boolean;
//
// export function isPlaceholderType(
//   placeholderType: Node["type"],
//   targetType: Node["type"]
// ): boolean;
//
// export function isReferenced(
//   node: Node,
//   parent: Node,
//   grandparent?: Node
// ): boolean;
//
// export function isScope(node: Node, parent: Node): node is Scopable;
//
// export function isSpecifierDefault(specifier: ModuleSpecifier): boolean;
//
// export function isType<T extends Node["type"]>(
//   nodetype: string,
//   targetType: T
// ): nodetype is T;
//
// export function isType(
//   nodetype: string | null | undefined,
//   targetType: string
// ): boolean;
//
// export function isValidES3Identifier(name: string): boolean;
//
// export function isValidIdentifier(name: string): boolean;
//
// export function isVar(node: Node): node is VariableDeclaration;
//
// export function matchesPattern(
//   node: Node | null | undefined,
//   match: string | ReadonlyArray<string>,
//   allowPartial?: boolean
// ): node is MemberExpression;
//
// export function validate<T extends Node, K extends keyof T>(
//   n: Node | null | undefined,
//   key: K,
//   value: T[K]
// ): void;
//
// export function validate(n: Node, key: string, value: any): void;

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
