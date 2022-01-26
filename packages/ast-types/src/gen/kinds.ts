// !!! THIS FILE WAS AUTO-GENERATED BY `npm run gen` !!!
import { namedTypes } from "./namedTypes";
export type NodeKind =
  | namedTypes.AwaitExpression
  | namedTypes.Decorator
  | namedTypes.Property
  | namedTypes.MethodDefinition
  | namedTypes.PrivateName
  | namedTypes.Identifier
  | namedTypes.ClassPrivateProperty
  | namedTypes.File
  | namedTypes.Program
  | namedTypes.BlockStatement
  | namedTypes.EmptyStatement
  | namedTypes.ExpressionStatement
  | namedTypes.IfStatement
  | namedTypes.LabeledStatement
  | namedTypes.BreakStatement
  | namedTypes.ContinueStatement
  | namedTypes.WithStatement
  | namedTypes.SwitchStatement
  | namedTypes.SwitchCase
  | namedTypes.ReturnStatement
  | namedTypes.ThrowStatement
  | namedTypes.TryStatement
  | namedTypes.CatchClause
  | namedTypes.WhileStatement
  | namedTypes.DoWhileStatement
  | namedTypes.ForStatement
  | namedTypes.VariableDeclaration
  | namedTypes.ForInStatement
  | namedTypes.DebuggerStatement
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.VariableDeclarator
  | namedTypes.ThisExpression
  | namedTypes.ArrayExpression
  | namedTypes.ObjectExpression
  | namedTypes.SequenceExpression
  | namedTypes.UnaryExpression
  | namedTypes.BinaryExpression
  | namedTypes.AssignmentExpression
  | namedTypes.UpdateExpression
  | namedTypes.LogicalExpression
  | namedTypes.ConditionalExpression
  | namedTypes.NewExpression
  | namedTypes.CallExpression
  | namedTypes.MemberExpression
  | namedTypes.RestElement
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ForOfStatement
  | namedTypes.YieldExpression
  | namedTypes.GeneratorExpression
  | namedTypes.ComprehensionBlock
  | namedTypes.ComprehensionExpression
  | namedTypes.ObjectProperty
  | namedTypes.ArrayPattern
  | namedTypes.ObjectPattern
  | namedTypes.SpreadElement
  | namedTypes.AssignmentPattern
  | namedTypes.ClassPropertyDefinition
  | namedTypes.ClassProperty
  | namedTypes.ClassBody
  | namedTypes.ClassDeclaration
  | namedTypes.ClassExpression
  | namedTypes.Super
  | namedTypes.ImportSpecifier
  | namedTypes.ImportDefaultSpecifier
  | namedTypes.ImportNamespaceSpecifier
  | namedTypes.ImportDeclaration
  | namedTypes.ExportNamedDeclaration
  | namedTypes.ExportSpecifier
  | namedTypes.ExportDefaultDeclaration
  | namedTypes.ExportAllDeclaration
  | namedTypes.TaggedTemplateExpression
  | namedTypes.TemplateLiteral
  | namedTypes.TemplateElement
  | namedTypes.MetaProperty
  | namedTypes.ExportBatchSpecifier
  | namedTypes.ExportDeclaration
  | namedTypes.Noop
  | namedTypes.DoExpression
  | namedTypes.BindExpression
  | namedTypes.ParenthesizedExpression
  | namedTypes.ExportNamespaceSpecifier
  | namedTypes.ExportDefaultSpecifier
  | namedTypes.Directive
  | namedTypes.DirectiveLiteral
  | namedTypes.InterpreterDirective
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod
  | namedTypes.ForAwaitStatement
  | namedTypes.Import
  | namedTypes.TSTypeAnnotation
  | namedTypes.TSTypeParameterDeclaration
  | namedTypes.TSTypeParameterInstantiation
  | namedTypes.TSExpressionWithTypeArguments
  | namedTypes.TSQualifiedName
  | namedTypes.TSTypeReference
  | namedTypes.TSAsExpression
  | namedTypes.TSNonNullExpression
  | namedTypes.TSAnyKeyword
  | namedTypes.TSBigIntKeyword
  | namedTypes.TSBooleanKeyword
  | namedTypes.TSNeverKeyword
  | namedTypes.TSNullKeyword
  | namedTypes.TSNumberKeyword
  | namedTypes.TSObjectKeyword
  | namedTypes.TSStringKeyword
  | namedTypes.TSSymbolKeyword
  | namedTypes.TSUndefinedKeyword
  | namedTypes.TSUnknownKeyword
  | namedTypes.TSVoidKeyword
  | namedTypes.TSThisType
  | namedTypes.TSArrayType
  | namedTypes.TSLiteralType
  | namedTypes.TSUnionType
  | namedTypes.TSIntersectionType
  | namedTypes.TSConditionalType
  | namedTypes.TSInferType
  | namedTypes.TSTypeParameter
  | namedTypes.TSParenthesizedType
  | namedTypes.TSFunctionType
  | namedTypes.TSConstructorType
  | namedTypes.TSDeclareFunction
  | namedTypes.TSDeclareMethod
  | namedTypes.TSMappedType
  | namedTypes.TSTupleType
  | namedTypes.TSNamedTupleMember
  | namedTypes.TSRestType
  | namedTypes.TSOptionalType
  | namedTypes.TSIndexedAccessType
  | namedTypes.TSTypeOperator
  | namedTypes.TSIndexSignature
  | namedTypes.TSPropertySignature
  | namedTypes.TSMethodSignature
  | namedTypes.TSTypePredicate
  | namedTypes.TSCallSignatureDeclaration
  | namedTypes.TSConstructSignatureDeclaration
  | namedTypes.TSEnumMember
  | namedTypes.TSTypeQuery
  | namedTypes.TSImportType
  | namedTypes.TSTypeLiteral
  | namedTypes.TSTypeAssertion
  | namedTypes.TSEnumDeclaration
  | namedTypes.TSTypeAliasDeclaration
  | namedTypes.TSModuleBlock
  | namedTypes.TSModuleDeclaration
  | namedTypes.TSImportEqualsDeclaration
  | namedTypes.TSExternalModuleReference
  | namedTypes.TSExportAssignment
  | namedTypes.TSNamespaceExportDeclaration
  | namedTypes.TSInterfaceBody
  | namedTypes.TSInterfaceDeclaration
  | namedTypes.TSParameterProperty;
export type BaseNodeKind =
  | namedTypes.AwaitExpression
  | namedTypes.Decorator
  | namedTypes.Property
  | namedTypes.MethodDefinition
  | namedTypes.PrivateName
  | namedTypes.Identifier
  | namedTypes.ClassPrivateProperty
  | namedTypes.File
  | namedTypes.Program
  | namedTypes.BlockStatement
  | namedTypes.EmptyStatement
  | namedTypes.ExpressionStatement
  | namedTypes.IfStatement
  | namedTypes.LabeledStatement
  | namedTypes.BreakStatement
  | namedTypes.ContinueStatement
  | namedTypes.WithStatement
  | namedTypes.SwitchStatement
  | namedTypes.SwitchCase
  | namedTypes.ReturnStatement
  | namedTypes.ThrowStatement
  | namedTypes.TryStatement
  | namedTypes.CatchClause
  | namedTypes.WhileStatement
  | namedTypes.DoWhileStatement
  | namedTypes.ForStatement
  | namedTypes.VariableDeclaration
  | namedTypes.ForInStatement
  | namedTypes.DebuggerStatement
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.VariableDeclarator
  | namedTypes.ThisExpression
  | namedTypes.ArrayExpression
  | namedTypes.ObjectExpression
  | namedTypes.SequenceExpression
  | namedTypes.UnaryExpression
  | namedTypes.BinaryExpression
  | namedTypes.AssignmentExpression
  | namedTypes.UpdateExpression
  | namedTypes.LogicalExpression
  | namedTypes.ConditionalExpression
  | namedTypes.NewExpression
  | namedTypes.CallExpression
  | namedTypes.MemberExpression
  | namedTypes.RestElement
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ForOfStatement
  | namedTypes.YieldExpression
  | namedTypes.GeneratorExpression
  | namedTypes.ComprehensionBlock
  | namedTypes.ComprehensionExpression
  | namedTypes.ObjectProperty
  | namedTypes.ArrayPattern
  | namedTypes.ObjectPattern
  | namedTypes.SpreadElement
  | namedTypes.AssignmentPattern
  | namedTypes.ClassPropertyDefinition
  | namedTypes.ClassProperty
  | namedTypes.ClassBody
  | namedTypes.ClassDeclaration
  | namedTypes.ClassExpression
  | namedTypes.Super
  | namedTypes.ImportSpecifier
  | namedTypes.ImportDefaultSpecifier
  | namedTypes.ImportNamespaceSpecifier
  | namedTypes.ImportDeclaration
  | namedTypes.ExportNamedDeclaration
  | namedTypes.ExportSpecifier
  | namedTypes.ExportDefaultDeclaration
  | namedTypes.ExportAllDeclaration
  | namedTypes.TaggedTemplateExpression
  | namedTypes.TemplateLiteral
  | namedTypes.TemplateElement
  | namedTypes.MetaProperty
  | namedTypes.ExportBatchSpecifier
  | namedTypes.ExportDeclaration
  | namedTypes.Noop
  | namedTypes.DoExpression
  | namedTypes.BindExpression
  | namedTypes.ParenthesizedExpression
  | namedTypes.ExportNamespaceSpecifier
  | namedTypes.ExportDefaultSpecifier
  | namedTypes.Directive
  | namedTypes.DirectiveLiteral
  | namedTypes.InterpreterDirective
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod
  | namedTypes.ForAwaitStatement
  | namedTypes.Import
  | namedTypes.TSTypeAnnotation
  | namedTypes.TSTypeParameterDeclaration
  | namedTypes.TSTypeParameterInstantiation
  | namedTypes.TSExpressionWithTypeArguments
  | namedTypes.TSQualifiedName
  | namedTypes.TSTypeReference
  | namedTypes.TSAsExpression
  | namedTypes.TSNonNullExpression
  | namedTypes.TSAnyKeyword
  | namedTypes.TSBigIntKeyword
  | namedTypes.TSBooleanKeyword
  | namedTypes.TSNeverKeyword
  | namedTypes.TSNullKeyword
  | namedTypes.TSNumberKeyword
  | namedTypes.TSObjectKeyword
  | namedTypes.TSStringKeyword
  | namedTypes.TSSymbolKeyword
  | namedTypes.TSUndefinedKeyword
  | namedTypes.TSUnknownKeyword
  | namedTypes.TSVoidKeyword
  | namedTypes.TSThisType
  | namedTypes.TSArrayType
  | namedTypes.TSLiteralType
  | namedTypes.TSUnionType
  | namedTypes.TSIntersectionType
  | namedTypes.TSConditionalType
  | namedTypes.TSInferType
  | namedTypes.TSTypeParameter
  | namedTypes.TSParenthesizedType
  | namedTypes.TSFunctionType
  | namedTypes.TSConstructorType
  | namedTypes.TSDeclareFunction
  | namedTypes.TSDeclareMethod
  | namedTypes.TSMappedType
  | namedTypes.TSTupleType
  | namedTypes.TSNamedTupleMember
  | namedTypes.TSRestType
  | namedTypes.TSOptionalType
  | namedTypes.TSIndexedAccessType
  | namedTypes.TSTypeOperator
  | namedTypes.TSIndexSignature
  | namedTypes.TSPropertySignature
  | namedTypes.TSMethodSignature
  | namedTypes.TSTypePredicate
  | namedTypes.TSCallSignatureDeclaration
  | namedTypes.TSConstructSignatureDeclaration
  | namedTypes.TSEnumMember
  | namedTypes.TSTypeQuery
  | namedTypes.TSImportType
  | namedTypes.TSTypeLiteral
  | namedTypes.TSTypeAssertion
  | namedTypes.TSEnumDeclaration
  | namedTypes.TSTypeAliasDeclaration
  | namedTypes.TSModuleBlock
  | namedTypes.TSModuleDeclaration
  | namedTypes.TSImportEqualsDeclaration
  | namedTypes.TSExternalModuleReference
  | namedTypes.TSExportAssignment
  | namedTypes.TSNamespaceExportDeclaration
  | namedTypes.TSInterfaceBody
  | namedTypes.TSInterfaceDeclaration
  | namedTypes.TSParameterProperty;
export type ExpressionKind =
  | namedTypes.AwaitExpression
  | namedTypes.PrivateName
  | namedTypes.Identifier
  | namedTypes.FunctionExpression
  | namedTypes.ThisExpression
  | namedTypes.ArrayExpression
  | namedTypes.ObjectExpression
  | namedTypes.SequenceExpression
  | namedTypes.UnaryExpression
  | namedTypes.BinaryExpression
  | namedTypes.AssignmentExpression
  | namedTypes.UpdateExpression
  | namedTypes.LogicalExpression
  | namedTypes.ConditionalExpression
  | namedTypes.NewExpression
  | namedTypes.CallExpression
  | namedTypes.MemberExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.YieldExpression
  | namedTypes.GeneratorExpression
  | namedTypes.ComprehensionExpression
  | namedTypes.ClassExpression
  | namedTypes.Super
  | namedTypes.TaggedTemplateExpression
  | namedTypes.TemplateLiteral
  | namedTypes.MetaProperty
  | namedTypes.DoExpression
  | namedTypes.BindExpression
  | namedTypes.ParenthesizedExpression
  | namedTypes.DirectiveLiteral
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral
  | namedTypes.Import
  | namedTypes.TSAsExpression
  | namedTypes.TSNonNullExpression
  | namedTypes.TSTypeAssertion;
export type AwaitExpressionKind = namedTypes.AwaitExpression;
export type DecoratorKind = namedTypes.Decorator;
export type PropertyKind = namedTypes.Property;
export type StatementKind =
  | namedTypes.MethodDefinition
  | namedTypes.ClassPrivateProperty
  | namedTypes.BlockStatement
  | namedTypes.EmptyStatement
  | namedTypes.ExpressionStatement
  | namedTypes.IfStatement
  | namedTypes.LabeledStatement
  | namedTypes.BreakStatement
  | namedTypes.ContinueStatement
  | namedTypes.WithStatement
  | namedTypes.SwitchStatement
  | namedTypes.ReturnStatement
  | namedTypes.ThrowStatement
  | namedTypes.TryStatement
  | namedTypes.WhileStatement
  | namedTypes.DoWhileStatement
  | namedTypes.ForStatement
  | namedTypes.VariableDeclaration
  | namedTypes.ForInStatement
  | namedTypes.DebuggerStatement
  | namedTypes.FunctionDeclaration
  | namedTypes.ForOfStatement
  | namedTypes.ClassPropertyDefinition
  | namedTypes.ClassProperty
  | namedTypes.ClassBody
  | namedTypes.ClassDeclaration
  | namedTypes.ImportDeclaration
  | namedTypes.ExportNamedDeclaration
  | namedTypes.ExportDefaultDeclaration
  | namedTypes.ExportAllDeclaration
  | namedTypes.ExportDeclaration
  | namedTypes.Noop
  | namedTypes.ForAwaitStatement
  | namedTypes.TSTypeParameterDeclaration
  | namedTypes.TSDeclareFunction
  | namedTypes.TSDeclareMethod
  | namedTypes.TSEnumDeclaration
  | namedTypes.TSTypeAliasDeclaration
  | namedTypes.TSModuleDeclaration
  | namedTypes.TSImportEqualsDeclaration
  | namedTypes.TSExportAssignment
  | namedTypes.TSNamespaceExportDeclaration
  | namedTypes.TSInterfaceDeclaration;
export type DeclarationKind =
  | namedTypes.MethodDefinition
  | namedTypes.ClassPrivateProperty
  | namedTypes.VariableDeclaration
  | namedTypes.FunctionDeclaration
  | namedTypes.ClassPropertyDefinition
  | namedTypes.ClassProperty
  | namedTypes.ClassBody
  | namedTypes.ClassDeclaration
  | namedTypes.ImportDeclaration
  | namedTypes.ExportNamedDeclaration
  | namedTypes.ExportDefaultDeclaration
  | namedTypes.ExportAllDeclaration
  | namedTypes.ExportDeclaration
  | namedTypes.TSTypeParameterDeclaration
  | namedTypes.TSDeclareFunction
  | namedTypes.TSDeclareMethod
  | namedTypes.TSEnumDeclaration
  | namedTypes.TSTypeAliasDeclaration
  | namedTypes.TSModuleDeclaration
  | namedTypes.TSInterfaceDeclaration;
export type MethodDefinitionKind = namedTypes.MethodDefinition;
export type PrivateNameKind = namedTypes.PrivateName;
export type PatternLikeKind =
  | namedTypes.Identifier
  | namedTypes.RestElement
  | namedTypes.ArrayPattern
  | namedTypes.ObjectPattern
  | namedTypes.AssignmentPattern;
export type LValKind =
  | namedTypes.Identifier
  | namedTypes.MemberExpression
  | namedTypes.RestElement
  | namedTypes.ArrayPattern
  | namedTypes.ObjectPattern
  | namedTypes.AssignmentPattern
  | namedTypes.TSParameterProperty;
export type IdentifierKind = namedTypes.Identifier;
export type ClassPrivatePropertyKind = namedTypes.ClassPrivateProperty;
export type CommentKind =
  | namedTypes.Block
  | namedTypes.Line
  | namedTypes.CommentBlock
  | namedTypes.CommentLine;
export type SourceLocationKind = namedTypes.SourceLocation;
export type PositionKind = namedTypes.Position;
export type FileKind = namedTypes.File;
export type ScopableKind =
  | namedTypes.Program
  | namedTypes.BlockStatement
  | namedTypes.SwitchStatement
  | namedTypes.CatchClause
  | namedTypes.WhileStatement
  | namedTypes.DoWhileStatement
  | namedTypes.ForStatement
  | namedTypes.ForInStatement
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ForOfStatement
  | namedTypes.ClassDeclaration
  | namedTypes.ClassExpression
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod;
export type BlockParentKind =
  | namedTypes.Program
  | namedTypes.BlockStatement
  | namedTypes.SwitchStatement
  | namedTypes.CatchClause
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod;
export type ProgramKind = namedTypes.Program;
export type FunctionKind =
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod;
export type FunctionParentKind =
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod;
export type BaseFunctionKind =
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.ArrowFunctionExpression
  | namedTypes.ObjectMethod
  | namedTypes.ClassMethod
  | namedTypes.ClassPrivateMethod;
export type BlockStatementKind = namedTypes.BlockStatement;
export type EmptyStatementKind = namedTypes.EmptyStatement;
export type ExpressionStatementKind = namedTypes.ExpressionStatement;
export type ConditionalKind =
  | namedTypes.IfStatement
  | namedTypes.ConditionalExpression;
export type IfStatementKind = namedTypes.IfStatement;
export type LabeledStatementKind = namedTypes.LabeledStatement;
export type CompletionStatementKind =
  | namedTypes.BreakStatement
  | namedTypes.ContinueStatement
  | namedTypes.ReturnStatement
  | namedTypes.ThrowStatement;
export type BreakStatementKind = namedTypes.BreakStatement;
export type ContinueStatementKind = namedTypes.ContinueStatement;
export type WithStatementKind = namedTypes.WithStatement;
export type SwitchStatementKind = namedTypes.SwitchStatement;
export type SwitchCaseKind = namedTypes.SwitchCase;
export type ReturnStatementKind = namedTypes.ReturnStatement;
export type ThrowStatementKind = namedTypes.ThrowStatement;
export type TryStatementKind = namedTypes.TryStatement;
export type CatchClauseKind = namedTypes.CatchClause;
export type LoopKind =
  | namedTypes.WhileStatement
  | namedTypes.DoWhileStatement
  | namedTypes.ForStatement
  | namedTypes.ForInStatement
  | namedTypes.ForOfStatement;
export type WhileKind = namedTypes.WhileStatement | namedTypes.DoWhileStatement;
export type ForKind =
  | namedTypes.ForStatement
  | namedTypes.ForInStatement
  | namedTypes.ForOfStatement;
export type ForXKind = namedTypes.ForInStatement | namedTypes.ForOfStatement;
export type WhileStatementKind = namedTypes.WhileStatement;
export type DoWhileStatementKind = namedTypes.DoWhileStatement;
export type ForStatementKind = namedTypes.ForStatement;
export type VariableDeclarationKind = namedTypes.VariableDeclaration;
export type ForInStatementKind = namedTypes.ForInStatement;
export type DebuggerStatementKind = namedTypes.DebuggerStatement;
export type PureishKind =
  | namedTypes.FunctionDeclaration
  | namedTypes.FunctionExpression
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral;
export type FunctionDeclarationKind = namedTypes.FunctionDeclaration;
export type FunctionExpressionKind = namedTypes.FunctionExpression;
export type VariableDeclaratorKind = namedTypes.VariableDeclarator;
export type ThisExpressionKind = namedTypes.ThisExpression;
export type ArrayExpressionKind = namedTypes.ArrayExpression;
export type ObjectExpressionKind = namedTypes.ObjectExpression;
export type LiteralKind =
  | namedTypes.StringLiteral
  | namedTypes.NumericLiteral
  | namedTypes.BigIntLiteral
  | namedTypes.NullLiteral
  | namedTypes.BooleanLiteral
  | namedTypes.RegExpLiteral;
export type SequenceExpressionKind = namedTypes.SequenceExpression;
export type UnaryExpressionKind = namedTypes.UnaryExpression;
export type BinaryKind =
  | namedTypes.BinaryExpression
  | namedTypes.LogicalExpression;
export type BinaryExpressionKind = namedTypes.BinaryExpression;
export type AssignmentExpressionKind = namedTypes.AssignmentExpression;
export type UpdateExpressionKind = namedTypes.UpdateExpression;
export type LogicalExpressionKind = namedTypes.LogicalExpression;
export type ConditionalExpressionKind = namedTypes.ConditionalExpression;
export type NewExpressionKind = namedTypes.NewExpression;
export type CallExpressionKind = namedTypes.CallExpression;
export type MemberExpressionKind = namedTypes.MemberExpression;
export type PatternKind =
  | namedTypes.ArrayPattern
  | namedTypes.ObjectPattern
  | namedTypes.AssignmentPattern;
export type BaseCommentKind =
  | namedTypes.Block
  | namedTypes.Line
  | namedTypes.CommentBlock
  | namedTypes.CommentLine;
export type RestElementKind = namedTypes.RestElement;
export type ArrowFunctionExpressionKind = namedTypes.ArrowFunctionExpression;
export type ForOfStatementKind = namedTypes.ForOfStatement;
export type YieldExpressionKind = namedTypes.YieldExpression;
export type GeneratorExpressionKind = namedTypes.GeneratorExpression;
export type ComprehensionBlockKind = namedTypes.ComprehensionBlock;
export type ComprehensionExpressionKind = namedTypes.ComprehensionExpression;
export type ObjectPropertyKind = namedTypes.ObjectProperty;
export type ArrayPatternKind = namedTypes.ArrayPattern;
export type ObjectPatternKind = namedTypes.ObjectPattern;
export type SpreadElementKind = namedTypes.SpreadElement;
export type AssignmentPatternKind = namedTypes.AssignmentPattern;
export type ClassPropertyDefinitionKind = namedTypes.ClassPropertyDefinition;
export type ClassPropertyKind = namedTypes.ClassProperty;
export type ClassBodyKind = namedTypes.ClassBody;
export type ClassKind =
  | namedTypes.ClassDeclaration
  | namedTypes.ClassExpression;
export type ClassDeclarationKind = namedTypes.ClassDeclaration;
export type ClassExpressionKind = namedTypes.ClassExpression;
export type SuperKind = namedTypes.Super;
export type SpecifierKind =
  | namedTypes.ImportSpecifier
  | namedTypes.ImportDefaultSpecifier
  | namedTypes.ImportNamespaceSpecifier
  | namedTypes.ExportSpecifier
  | namedTypes.ExportBatchSpecifier
  | namedTypes.ExportNamespaceSpecifier
  | namedTypes.ExportDefaultSpecifier;
export type ModuleSpecifierKind =
  | namedTypes.ImportSpecifier
  | namedTypes.ImportDefaultSpecifier
  | namedTypes.ImportNamespaceSpecifier
  | namedTypes.ExportSpecifier;
export type ImportSpecifierKind = namedTypes.ImportSpecifier;
export type ImportDefaultSpecifierKind = namedTypes.ImportDefaultSpecifier;
export type ImportNamespaceSpecifierKind = namedTypes.ImportNamespaceSpecifier;
export type ImportDeclarationKind = namedTypes.ImportDeclaration;
export type ExportNamedDeclarationKind = namedTypes.ExportNamedDeclaration;
export type ExportSpecifierKind = namedTypes.ExportSpecifier;
export type ExportDefaultDeclarationKind = namedTypes.ExportDefaultDeclaration;
export type ExportAllDeclarationKind = namedTypes.ExportAllDeclaration;
export type TaggedTemplateExpressionKind = namedTypes.TaggedTemplateExpression;
export type TemplateLiteralKind = namedTypes.TemplateLiteral;
export type TemplateElementKind = namedTypes.TemplateElement;
export type MetaPropertyKind = namedTypes.MetaProperty;
export type ExportBatchSpecifierKind = namedTypes.ExportBatchSpecifier;
export type ExportDeclarationKind = namedTypes.ExportDeclaration;
export type BlockKind = namedTypes.Block;
export type LineKind = namedTypes.Line;
export type NoopKind = namedTypes.Noop;
export type DoExpressionKind = namedTypes.DoExpression;
export type BindExpressionKind = namedTypes.BindExpression;
export type ParenthesizedExpressionKind = namedTypes.ParenthesizedExpression;
export type ExportNamespaceSpecifierKind = namedTypes.ExportNamespaceSpecifier;
export type ExportDefaultSpecifierKind = namedTypes.ExportDefaultSpecifier;
export type CommentBlockKind = namedTypes.CommentBlock;
export type CommentLineKind = namedTypes.CommentLine;
export type DirectiveKind = namedTypes.Directive;
export type DirectiveLiteralKind = namedTypes.DirectiveLiteral;
export type InterpreterDirectiveKind = namedTypes.InterpreterDirective;
export type StringLiteralKind = namedTypes.StringLiteral;
export type NumericLiteralKind = namedTypes.NumericLiteral;
export type BigIntLiteralKind = namedTypes.BigIntLiteral;
export type NullLiteralKind = namedTypes.NullLiteral;
export type BooleanLiteralKind = namedTypes.BooleanLiteral;
export type RegExpLiteralKind = namedTypes.RegExpLiteral;
export type ObjectMethodKind = namedTypes.ObjectMethod;
export type ClassMethodKind = namedTypes.ClassMethod;
export type ClassPrivateMethodKind = namedTypes.ClassPrivateMethod;
export type ForAwaitStatementKind = namedTypes.ForAwaitStatement;
export type ImportKind = namedTypes.Import;
export type TSTypeAnnotationKind =
  | namedTypes.TSTypeAnnotation
  | namedTypes.TSTypePredicate;
export type TSTypeParameterDeclarationKind =
  namedTypes.TSTypeParameterDeclaration;
export type TSTypeParameterInstantiationKind =
  namedTypes.TSTypeParameterInstantiation;
export type TSHasOptionalTypeParameterInstantiationKind =
  | namedTypes.TSExpressionWithTypeArguments
  | namedTypes.TSTypeReference
  | namedTypes.TSImportType;
export type TSTypeKind =
  | namedTypes.TSExpressionWithTypeArguments
  | namedTypes.TSTypeReference
  | namedTypes.TSAnyKeyword
  | namedTypes.TSBigIntKeyword
  | namedTypes.TSBooleanKeyword
  | namedTypes.TSNeverKeyword
  | namedTypes.TSNullKeyword
  | namedTypes.TSNumberKeyword
  | namedTypes.TSObjectKeyword
  | namedTypes.TSStringKeyword
  | namedTypes.TSSymbolKeyword
  | namedTypes.TSUndefinedKeyword
  | namedTypes.TSUnknownKeyword
  | namedTypes.TSVoidKeyword
  | namedTypes.TSThisType
  | namedTypes.TSArrayType
  | namedTypes.TSLiteralType
  | namedTypes.TSUnionType
  | namedTypes.TSIntersectionType
  | namedTypes.TSConditionalType
  | namedTypes.TSInferType
  | namedTypes.TSParenthesizedType
  | namedTypes.TSFunctionType
  | namedTypes.TSConstructorType
  | namedTypes.TSMappedType
  | namedTypes.TSTupleType
  | namedTypes.TSNamedTupleMember
  | namedTypes.TSRestType
  | namedTypes.TSOptionalType
  | namedTypes.TSIndexedAccessType
  | namedTypes.TSTypeOperator
  | namedTypes.TSTypePredicate
  | namedTypes.TSTypeQuery
  | namedTypes.TSImportType
  | namedTypes.TSTypeLiteral;
export type TSExpressionWithTypeArgumentsKind =
  namedTypes.TSExpressionWithTypeArguments;
export type TSQualifiedNameKind = namedTypes.TSQualifiedName;
export type TSTypeReferenceKind = namedTypes.TSTypeReference;
export type TSHasOptionalTypeParametersKind =
  | namedTypes.TSFunctionType
  | namedTypes.TSConstructorType
  | namedTypes.TSDeclareFunction
  | namedTypes.TSDeclareMethod
  | namedTypes.TSMethodSignature
  | namedTypes.TSCallSignatureDeclaration
  | namedTypes.TSConstructSignatureDeclaration
  | namedTypes.TSTypeAliasDeclaration
  | namedTypes.TSInterfaceDeclaration;
export type TSHasOptionalTypeAnnotationKind =
  | namedTypes.TSFunctionType
  | namedTypes.TSConstructorType
  | namedTypes.TSIndexSignature
  | namedTypes.TSPropertySignature
  | namedTypes.TSMethodSignature
  | namedTypes.TSCallSignatureDeclaration
  | namedTypes.TSConstructSignatureDeclaration;
export type TSAsExpressionKind = namedTypes.TSAsExpression;
export type TSNonNullExpressionKind = namedTypes.TSNonNullExpression;
export type TSAnyKeywordKind = namedTypes.TSAnyKeyword;
export type TSBigIntKeywordKind = namedTypes.TSBigIntKeyword;
export type TSBooleanKeywordKind = namedTypes.TSBooleanKeyword;
export type TSNeverKeywordKind = namedTypes.TSNeverKeyword;
export type TSNullKeywordKind = namedTypes.TSNullKeyword;
export type TSNumberKeywordKind = namedTypes.TSNumberKeyword;
export type TSObjectKeywordKind = namedTypes.TSObjectKeyword;
export type TSStringKeywordKind = namedTypes.TSStringKeyword;
export type TSSymbolKeywordKind = namedTypes.TSSymbolKeyword;
export type TSUndefinedKeywordKind = namedTypes.TSUndefinedKeyword;
export type TSUnknownKeywordKind = namedTypes.TSUnknownKeyword;
export type TSVoidKeywordKind = namedTypes.TSVoidKeyword;
export type TSThisTypeKind = namedTypes.TSThisType;
export type TSArrayTypeKind = namedTypes.TSArrayType;
export type TSLiteralTypeKind = namedTypes.TSLiteralType;
export type TSUnionTypeKind = namedTypes.TSUnionType;
export type TSIntersectionTypeKind = namedTypes.TSIntersectionType;
export type TSConditionalTypeKind = namedTypes.TSConditionalType;
export type TSInferTypeKind = namedTypes.TSInferType;
export type TSTypeParameterKind = namedTypes.TSTypeParameter;
export type TSParenthesizedTypeKind = namedTypes.TSParenthesizedType;
export type TSFunctionTypeKind = namedTypes.TSFunctionType;
export type TSConstructorTypeKind = namedTypes.TSConstructorType;
export type TSDeclareFunctionKind = namedTypes.TSDeclareFunction;
export type TSDeclareMethodKind = namedTypes.TSDeclareMethod;
export type TSMappedTypeKind = namedTypes.TSMappedType;
export type TSTupleTypeKind = namedTypes.TSTupleType;
export type TSNamedTupleMemberKind = namedTypes.TSNamedTupleMember;
export type TSRestTypeKind = namedTypes.TSRestType;
export type TSOptionalTypeKind = namedTypes.TSOptionalType;
export type TSIndexedAccessTypeKind = namedTypes.TSIndexedAccessType;
export type TSTypeOperatorKind = namedTypes.TSTypeOperator;
export type TSTypeElementKind =
  | namedTypes.TSIndexSignature
  | namedTypes.TSPropertySignature
  | namedTypes.TSMethodSignature
  | namedTypes.TSCallSignatureDeclaration
  | namedTypes.TSConstructSignatureDeclaration;
export type TSIndexSignatureKind = namedTypes.TSIndexSignature;
export type TSPropertySignatureKind = namedTypes.TSPropertySignature;
export type TSMethodSignatureKind = namedTypes.TSMethodSignature;
export type TSTypePredicateKind = namedTypes.TSTypePredicate;
export type TSCallSignatureDeclarationKind =
  namedTypes.TSCallSignatureDeclaration;
export type TSConstructSignatureDeclarationKind =
  namedTypes.TSConstructSignatureDeclaration;
export type TSEnumMemberKind = namedTypes.TSEnumMember;
export type TSTypeQueryKind = namedTypes.TSTypeQuery;
export type TSImportTypeKind = namedTypes.TSImportType;
export type TSTypeLiteralKind = namedTypes.TSTypeLiteral;
export type TSTypeAssertionKind = namedTypes.TSTypeAssertion;
export type TSEnumDeclarationKind = namedTypes.TSEnumDeclaration;
export type TSTypeAliasDeclarationKind = namedTypes.TSTypeAliasDeclaration;
export type TSModuleBlockKind = namedTypes.TSModuleBlock;
export type TSModuleDeclarationKind = namedTypes.TSModuleDeclaration;
export type TSImportEqualsDeclarationKind =
  namedTypes.TSImportEqualsDeclaration;
export type TSExternalModuleReferenceKind =
  namedTypes.TSExternalModuleReference;
export type TSExportAssignmentKind = namedTypes.TSExportAssignment;
export type TSNamespaceExportDeclarationKind =
  namedTypes.TSNamespaceExportDeclaration;
export type TSInterfaceBodyKind = namedTypes.TSInterfaceBody;
export type TSInterfaceDeclarationKind = namedTypes.TSInterfaceDeclaration;
export type TSParameterPropertyKind = namedTypes.TSParameterProperty;
