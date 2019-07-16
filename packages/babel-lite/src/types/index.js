import toFastProperties from "to-fast-properties";

import { uniq, compact } from '../utils';
import { toBlock } from "./converters";
import { COMMENT_KEYS, INHERIT_KEYS } from "./constants";

import cloneNode from './clone/cloneNode';
import clone from './clone/clone';
import cloneDeep from './clone/cloneDeep';

function makeAssertFunction(type) {
  return function (node, opts) {
    opts = opts || {};
    if (!is(type, node, opts)) {
      throw new Error(`Expected type ${JSON.stringify(type)} with option ${JSON.stringify(opts)}`);
    }
  };
}

export const assertArrayExpression = makeAssertFunction('ArrayExpression');
export const assertArrayPattern = makeAssertFunction('ArrayPattern');
export const assertArrowFunctionExpression = makeAssertFunction('ArrowFunctionExpression');
export const assertAssignmentExpression = makeAssertFunction('AssignmentExpression');
export const assertAssignmentPattern = makeAssertFunction('AssignmentPattern');
export const assertAwaitExpression = makeAssertFunction('AwaitExpression');
export const assertBinary = makeAssertFunction('Binary');
export const assertBinaryExpression = makeAssertFunction('BinaryExpression');
export const assertBindExpression = makeAssertFunction('BindExpression');
export const assertBindingIdentifier = makeAssertFunction('BindingIdentifier');
export const assertBlock = makeAssertFunction('Block');
export const assertBlockParent = makeAssertFunction('BlockParent');
export const assertBlockScoped = makeAssertFunction('BlockScoped');
export const assertBlockStatement = makeAssertFunction('BlockStatement');
export const assertBooleanLiteral = makeAssertFunction('BooleanLiteral');
export const assertBreakStatement = makeAssertFunction('BreakStatement');
export const assertCallExpression = makeAssertFunction('CallExpression');
export const assertCatchClause = makeAssertFunction('CatchClause');
export const assertClass = makeAssertFunction('Class');
export const assertClassBody = makeAssertFunction('ClassBody');
export const assertClassDeclaration = makeAssertFunction('ClassDeclaration');
export const assertClassExpression = makeAssertFunction('ClassExpression');
export const assertClassMethod = makeAssertFunction('ClassMethod');
export const assertCompletionStatement = makeAssertFunction('CompletionStatement');
export const assertConditional = makeAssertFunction('Conditional');
export const assertConditionalExpression = makeAssertFunction('ConditionalExpression');
export const assertContinueStatement = makeAssertFunction('ContinueStatement');
export const assertDebuggerStatement = makeAssertFunction('DebuggerStatement');
export const assertDeclaration = makeAssertFunction('Declaration');
export const assertDecorator = makeAssertFunction('Decorator');
export const assertDirective = makeAssertFunction('Directive');
export const assertDirectiveLiteral = makeAssertFunction('DirectiveLiteral');
export const assertDoExpression = makeAssertFunction('DoExpression');
export const assertDoWhileStatement = makeAssertFunction('DoWhileStatement');
export const assertEmptyStatement = makeAssertFunction('EmptyStatement');
export const assertExpression = makeAssertFunction('Expression');
export const assertExpressionStatement = makeAssertFunction('ExpressionStatement');
export const assertExpressionWrapper = makeAssertFunction('ExpressionWrapper');
export const assertFile = makeAssertFunction('File');
export const assertFor = makeAssertFunction('For');
export const assertForInStatement = makeAssertFunction('ForInStatement');
export const assertForOfStatement = makeAssertFunction('ForOfStatement');
export const assertForStatement = makeAssertFunction('ForStatement');
export const assertForXStatement = makeAssertFunction('ForXStatement');
export const assertFunction = makeAssertFunction('Function');
export const assertFunctionDeclaration = makeAssertFunction('FunctionDeclaration');
export const assertFunctionExpression = makeAssertFunction('FunctionExpression');
export const assertFunctionParent = makeAssertFunction('FunctionParent');
export const assertGenerated = makeAssertFunction('Generated');
export const assertIdentifier = makeAssertFunction('Identifier');
export const assertIfStatement = makeAssertFunction('IfStatement');
export const assertLVal = makeAssertFunction('LVal');
export const assertLabeledStatement = makeAssertFunction('LabeledStatement');
export const assertLiteral = makeAssertFunction('Literal');
export const assertLogicalExpression = makeAssertFunction('LogicalExpression');
export const assertLoop = makeAssertFunction('Loop');
export const assertMemberExpression = makeAssertFunction('MemberExpression');
export const assertMetaProperty = makeAssertFunction('MetaProperty');
export const assertMethod = makeAssertFunction('Method');
export const assertModuleDeclaration = makeAssertFunction('ModuleDeclaration');
export const assertModuleSpecifier = makeAssertFunction('ModuleSpecifier');
export const assertNewExpression = makeAssertFunction('NewExpression');
export const assertNoop = makeAssertFunction('Noop');
export const assertNullLiteral = makeAssertFunction('NullLiteral');
export const assertNumberLiteral = makeAssertFunction('NumberLiteral');
export const assertNumericLiteral = makeAssertFunction('NumericLiteral');
export const assertObjectExpression = makeAssertFunction('ObjectExpression');
export const assertObjectMethod = makeAssertFunction('ObjectMethod');
export const assertObjectPattern = makeAssertFunction('ObjectPattern');
export const assertObjectProperty = makeAssertFunction('ObjectProperty');
export const assertParenthesizedExpression = makeAssertFunction('ParenthesizedExpression');
export const assertPattern = makeAssertFunction('Pattern');
export const assertProgram = makeAssertFunction('Program');
export const assertProperty = makeAssertFunction('Property');
export const assertPure = makeAssertFunction('Pure');
export const assertPureish = makeAssertFunction('Pureish');
export const assertReferenced = makeAssertFunction('Referenced');
export const assertReferencedIdentifier = makeAssertFunction('ReferencedIdentifier');
export const assertReferencedMemberExpression = makeAssertFunction('ReferencedMemberExpression');
export const assertRegExpLiteral = makeAssertFunction('RegExpLiteral');
export const assertRegexLiteral = makeAssertFunction('RegexLiteral');
export const assertRestElement = makeAssertFunction('RestElement');
export const assertRestProperty = makeAssertFunction('RestProperty');
export const assertReturnStatement = makeAssertFunction('ReturnStatement');
export const assertScopable = makeAssertFunction('Scopable');
export const assertScope = makeAssertFunction('Scope');
export const assertSequenceExpression = makeAssertFunction('SequenceExpression');
export const assertSpreadElement = makeAssertFunction('SpreadElement');
export const assertSpreadProperty = makeAssertFunction('SpreadProperty');
export const assertStatement = makeAssertFunction('Statement');
export const assertStringLiteral = makeAssertFunction('StringLiteral');
export const assertSuper = makeAssertFunction('Super');
export const assertSwitchCase = makeAssertFunction('SwitchCase');
export const assertSwitchStatement = makeAssertFunction('SwitchStatement');
export const assertTaggedTemplateExpression = makeAssertFunction('TaggedTemplateExpression');
export const assertTemplateElement = makeAssertFunction('TemplateElement');
export const assertTemplateLiteral = makeAssertFunction('TemplateLiteral');
export const assertTerminatorless = makeAssertFunction('Terminatorless');
export const assertThisExpression = makeAssertFunction('ThisExpression');
export const assertThrowStatement = makeAssertFunction('ThrowStatement');
export const assertTryStatement = makeAssertFunction('TryStatement');
export const assertUnaryExpression = makeAssertFunction('UnaryExpression');
export const assertUnaryLike = makeAssertFunction('UnaryLike');
export const assertUpdateExpression = makeAssertFunction('UpdateExpression');
export const assertUser = makeAssertFunction('User');
export const assertUserWhitespacable = makeAssertFunction('UserWhitespacable');
export const assertVar = makeAssertFunction('Var');
export const assertVariableDeclaration = makeAssertFunction('VariableDeclaration');
export const assertVariableDeclarator = makeAssertFunction('VariableDeclarator');
export const assertWhile = makeAssertFunction('While');
export const assertWhileStatement = makeAssertFunction('WhileStatement');
export const assertWithStatement = makeAssertFunction('WithStatement');
export const assertYieldExpression = makeAssertFunction('YieldExpression');

function makeIsFunction(type) {
  return (node, opts) => is(type, node, opts);
}

export const isArrayExpression = makeIsFunction('ArrayExpression');
export const isArrayPattern = makeIsFunction('ArrayPattern');
export const isArrowFunctionExpression = makeIsFunction('ArrowFunctionExpression');
export const isAssignmentExpression = makeIsFunction('AssignmentExpression');
export const isAssignmentPattern = makeIsFunction('AssignmentPattern');
export const isAwaitExpression = makeIsFunction('AwaitExpression');
export const isBinary = makeIsFunction('Binary');
export const isBinaryExpression = makeIsFunction('BinaryExpression');
export const isBindExpression = makeIsFunction('BindExpression');
export const isBlock = makeIsFunction('Block');
export const isBlockParent = makeIsFunction('BlockParent');
export const isBlockStatement = makeIsFunction('BlockStatement');
export const isBooleanLiteral = makeIsFunction('BooleanLiteral');
export const isBreakStatement = makeIsFunction('BreakStatement');
export const isCallExpression = makeIsFunction('CallExpression');
export const isCatchClause = makeIsFunction('CatchClause');
export const isClass = makeIsFunction('Class');
export const isClassBody = makeIsFunction('ClassBody');
export const isClassDeclaration = makeIsFunction('ClassDeclaration');
export const isClassExpression = makeIsFunction('ClassExpression');
export const isClassMethod = makeIsFunction('ClassMethod');
export const isCompletionStatement = makeIsFunction('CompletionStatement');
export const isConditional = makeIsFunction('Conditional');
export const isConditionalExpression = makeIsFunction('ConditionalExpression');
export const isContinueStatement = makeIsFunction('ContinueStatement');
export const isDebuggerStatement = makeIsFunction('DebuggerStatement');
export const isDeclaration = makeIsFunction('Declaration');
export const isDecorator = makeIsFunction('Decorator');
export const isDirective = makeIsFunction('Directive');
export const isDirectiveLiteral = makeIsFunction('DirectiveLiteral');
export const isDoExpression = makeIsFunction('DoExpression');
export const isDoWhileStatement = makeIsFunction('DoWhileStatement');
export const isEmptyStatement = makeIsFunction('EmptyStatement');
export const isExportAllDeclaration = makeIsFunction('ExportAllDeclaration');
export const isExportDeclaration = makeIsFunction('ExportDeclaration');
export const isExportDefaultDeclaration = makeIsFunction('ExportDefaultDeclaration');
export const isExportDefaultSpecifier = makeIsFunction('ExportDefaultSpecifier');
export const isExportNamedDeclaration = makeIsFunction('ExportNamedDeclaration');
export const isExportNamespaceSpecifier = makeIsFunction('ExportNamespaceSpecifier');
export const isExportSpecifier = makeIsFunction('ExportSpecifier');
export const isExpression = makeIsFunction('Expression');
export const isExpressionStatement = makeIsFunction('ExpressionStatement');
export const isExpressionWrapper = makeIsFunction('ExpressionWrapper');
export const isFile = makeIsFunction('File');
export const isFor = makeIsFunction('For');
export const isForInStatement = makeIsFunction('ForInStatement');
export const isForOfStatement = makeIsFunction('ForOfStatement');
export const isForStatement = makeIsFunction('ForStatement');
export const isForXStatement = makeIsFunction('ForXStatement');
export const isFunction = makeIsFunction('Function');
export const isFunctionDeclaration = makeIsFunction('FunctionDeclaration');
export const isFunctionExpression = makeIsFunction('FunctionExpression');
export const isFunctionParent = makeIsFunction('FunctionParent');
export const isIdentifier = makeIsFunction('Identifier');
export const isIfStatement = makeIsFunction('IfStatement');
export const isImportDeclaration = makeIsFunction('ImportDeclaration');
export const isImportDefaultSpecifier = makeIsFunction('ImportDefaultSpecifier');
export const isImportNamespaceSpecifier = makeIsFunction('ImportNamespaceSpecifier');
export const isImportSpecifier = makeIsFunction('ImportSpecifier');
export const isLVal = makeIsFunction('LVal');
export const isLabeledStatement = makeIsFunction('LabeledStatement');
export const isLiteral = makeIsFunction('Literal');
export const isLogicalExpression = makeIsFunction('LogicalExpression');
export const isLoop = makeIsFunction('Loop');
export const isMemberExpression = makeIsFunction('MemberExpression');
export const isMetaProperty = makeIsFunction('MetaProperty');
export const isMethod = makeIsFunction('Method');
export const isModuleDeclaration = makeIsFunction('ModuleDeclaration');
export const isModuleSpecifier = makeIsFunction('ModuleSpecifier');
export const isNewExpression = makeIsFunction('NewExpression');
export const isNoop = makeIsFunction('Noop');
export const isNullLiteral = makeIsFunction('NullLiteral');
export const isNumberLiteral = makeIsFunction('NumberLiteral');
export const isNumericLiteral = makeIsFunction('NumericLiteral');
export const isObjectExpression = makeIsFunction('ObjectExpression');
export const isObjectMethod = makeIsFunction('ObjectMethod');
export const isObjectPattern = makeIsFunction('ObjectPattern');
export const isObjectProperty = makeIsFunction('ObjectProperty');
export const isParenthesizedExpression = makeIsFunction('ParenthesizedExpression');
export function isPattern(node, opts) {
  if (!node) return false;

  const nodeType = node.type;
  if (
    nodeType === "Pattern" ||
    "AssignmentPattern" === nodeType ||
    "ArrayPattern" === nodeType ||
    "ObjectPattern" === nodeType ||
    (nodeType === "Placeholder" && "Pattern" === node.expectedNode)
  ) {
    return true;
  }

  return false;
}

export const isProgram = makeIsFunction('Program');
export const isProperty = makeIsFunction('Property');
export const isPureish = makeIsFunction('Pureish');
export const isRegExpLiteral = makeIsFunction('RegExpLiteral');
export const isRegexLiteral = makeIsFunction('RegexLiteral');
export const isRestElement = makeIsFunction('RestElement');
export const isRestProperty = makeIsFunction('RestProperty');
export const isReturnStatement = makeIsFunction('ReturnStatement');
export const isScopable = makeIsFunction('Scopable');
export const isSequenceExpression = makeIsFunction('SequenceExpression');
export const isSpreadElement = makeIsFunction('SpreadElement');
export const isSpreadProperty = makeIsFunction('SpreadProperty');
export const isStatement = makeIsFunction('Statement');
export const isStringLiteral = makeIsFunction('StringLiteral');
export const isSuper = makeIsFunction('Super');
export const isSwitchCase = makeIsFunction('SwitchCase');
export const isSwitchStatement = makeIsFunction('SwitchStatement');
export const isTaggedTemplateExpression = makeIsFunction('TaggedTemplateExpression');
export const isTemplateElement = makeIsFunction('TemplateElement');
export const isTemplateLiteral = makeIsFunction('TemplateLiteral');
export const isTerminatorless = makeIsFunction('Terminatorless');
export const isThisExpression = makeIsFunction('ThisExpression');
export const isThrowStatement = makeIsFunction('ThrowStatement');
export const isTryStatement = makeIsFunction('TryStatement');
export const isUnaryExpression = makeIsFunction('UnaryExpression');
export const isUnaryLike = makeIsFunction('UnaryLike');
export const isUpdateExpression = makeIsFunction('UpdateExpression');
export const isUserWhitespacable = makeIsFunction('UserWhitespacable');
export const isVariableDeclaration = makeIsFunction('VariableDeclaration');
export const isVariableDeclarator = makeIsFunction('VariableDeclarator');
export const isWhile = makeIsFunction('While');
export const isWhileStatement = makeIsFunction('WhileStatement');
export const isWithStatement = makeIsFunction('WithStatement');
export const isYieldExpression = makeIsFunction('YieldExpression');

export * from "./constants";

import { VISITOR_KEYS, ALIAS_KEYS, NODE_FIELDS, BUILDER_KEYS, DEPRECATED_KEYS, TYPES, FLIPPED_ALIAS_KEYS } from "./definitions";
export { VISITOR_KEYS, ALIAS_KEYS, NODE_FIELDS, BUILDER_KEYS, DEPRECATED_KEYS, TYPES, FLIPPED_ALIAS_KEYS };

export const FUNCTION_TYPES = FLIPPED_ALIAS_KEYS['Function'];

/**
 * Returns whether `node` is of given `type`.
 *
 * For better performance, use this instead of `is[Type]` when `type` is unknown.
 * Optionally, pass `skipAliasCheck` to directly compare `node.type` with `type`.
 */

export function is(type, node, opts) {
  if (!node) return false;

  let matches = isType(node.type, type);
  if (!matches) return false;

  if (typeof opts === "undefined") {
    return true;
  } else {
    return shallowEqual(node, opts);
  }
}

/**
 * Test if a `nodeType` is a `targetType` or if `targetType` is an alias of `nodeType`.
 */

export function isType(nodeType, targetType) {
  if (nodeType === targetType) return true;

  let aliases = FLIPPED_ALIAS_KEYS[targetType];
  if (aliases) {
    if (aliases[0] === nodeType) return true;

    for (let alias of aliases) {
      if (nodeType === alias) return true;
    }
  }

  return false;
}

function getBuilder(type) {
  const keys = BUILDER_KEYS[type];

  function builder() {
    if (arguments.length > keys.length) {
      throw new Error(`t.${type}: Too many arguments passed. Received ${arguments.length} but can receive no more than ${keys.length}`);
    }

    let node = {};
    node.type = type;

    let i = 0;

    for (let key of keys) {
      let field = NODE_FIELDS[type][key];

      let arg = arguments[i++];
      if (arg === undefined) {
        arg = field.default;
        if (Array.isArray(arg)) {
          arg = arg.concat();
        }
      }
      node[key] = arg;
    }

    for (let key in node) {
      validate(node, key, node[key]);
    }

    return node;
  }

  return builder;
};

export let arrayExpression = getBuilder('ArrayExpression');
export let assignmentExpression = getBuilder('AssignmentExpression');
export let awaitExpression = getBuilder('AwaitExpression');
export let binaryExpression = getBuilder('BinaryExpression');
export let blockStatement = getBuilder('BlockStatement');
export let booleanLiteral = getBuilder('BooleanLiteral');
export let breakStatement = getBuilder('BreakStatement');
export let callExpression = getBuilder('CallExpression');
// export let cloneNode = getBuilder('CloneNode');
export let conditionalExpression = getBuilder('ConditionalExpression');
export let exportNamedDeclaration = getBuilder('ExportNamedDeclaration');
export let exportSpecifier = getBuilder('ExportSpecifier');
export let expressionStatement = getBuilder('ExpressionStatement');
export let forStatement = getBuilder('ForStatement');
export let functionExpression = getBuilder('FunctionExpression');
export let identifier = getBuilder('Identifier');
export let ifStatement = getBuilder('IfStatement');
export let labeledStatement = getBuilder('LabeledStatement');
export let literal = getBuilder('Literal');
export let logicalExpression = getBuilder('LogicalExpression');
export let memberExpression = getBuilder('MemberExpression');
export let newExpression = getBuilder('NewExpression');
export let nullLiteral = getBuilder('NullLiteral');
export let numericLiteral = getBuilder('NumericLiteral');
export let objectExpression = getBuilder('ObjectExpression');
export let objectProperty = getBuilder('ObjectProperty');
export let regExpLiteral = getBuilder('RegExpLiteral');
export let returnStatement = getBuilder('ReturnStatement');
export let sequenceExpression = getBuilder('SequenceExpression');
export let stringLiteral = getBuilder('StringLiteral');
export let switchCase = getBuilder('SwitchCase');
export let switchStatement = getBuilder('SwitchStatement');
export let thisExpression = getBuilder('ThisExpression');
export let throwStatement = getBuilder('ThrowStatement');
export let unaryExpression = getBuilder('UnaryExpression');
export let updateExpression = getBuilder('UpdateExpression');
export let variableDeclaration = getBuilder('VariableDeclaration');
export let variableDeclarator = getBuilder('VariableDeclarator');
export let whileStatement = getBuilder('WhileStatement');
export let yieldExpression = getBuilder('YieldExpression');

export function validate(node, key, val) {
  if (!node) return;

  let fields = NODE_FIELDS[node.type];
  if (!fields) return;

  let field = fields[key];
  if (!field || !field.validate) return;
  if (field.optional && val == null) return;

  field.validate(node, key, val);
}

/**
 * Test if an object is shallowly equal.
 */

export function shallowEqual(actual, expected) {
  let keys = Object.keys(expected);

  for (let key of keys) {
    if (actual[key] !== expected[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Append a node to a member expression.
 */

export function appendToMemberExpression(member, append, computed){
  member.object   = memberExpression(member.object, member.property, member.computed);
  member.property = append;
  member.computed = !!computed;
  return member;
}

/**
 * Ensure the `key` (defaults to "body") of a `node` is a block.
 * Casting it to a block if it is not.
 */

export function ensureBlock(node, key = "body") {
  return node[key] = toBlock(node[key], node);
}

export { clone, cloneNode, cloneDeep };

/**
 * Remove comment properties from a node.
 */

export function removeComments(node) {
  for (let key of COMMENT_KEYS) {
    delete node[key];
  }
  return node;
}

/**
 * Inherit all unique comments from `parent` node to `child` node.
 */

export function inheritsComments(child, parent) {
  inheritTrailingComments(child, parent);
  inheritLeadingComments(child, parent);
  inheritInnerComments(child, parent);
  return child;
}

export function inheritTrailingComments(child, parent) {
  _inheritComments("trailingComments", child, parent);
}

export function inheritLeadingComments(child, parent) {
  _inheritComments("leadingComments", child, parent);
}

export function inheritInnerComments(child, parent) {
  _inheritComments("innerComments", child, parent);
}

function _inheritComments(key, child, parent) {
  if (child && parent) {
    child[key] = uniq(compact([].concat(child[key], parent[key])));
  }
}

/**
 * Inherit all contextual properties from `parent` node to `child` node.
 */

export function inherits(child, parent) {
  if (!child || !parent) return child;

  // optionally inherit specific properties if not null
  for (let key of INHERIT_KEYS.optional) {
    if (child[key] == null) {
      child[key] = parent[key];
    }
  }

  // force inherit "private" properties
  for (let key in parent) {
    if (key[0] === "_") child[key] = parent[key];
  }

  // force inherit select properties
  for (let key of INHERIT_KEYS.force) {
    child[key] = parent[key];
  }

  inheritsComments(child, parent);

  return child;
}

export function assertNode(node) {
  if (!isNode(node)) {
    throw new TypeError("Not a valid node " + (node && node.type));
  }
}

export function isNode(node) {
  return !!(node && VISITOR_KEYS[node.type]);
}

// Optimize property access.
toFastProperties(VISITOR_KEYS);

//
export * from "./retrievers";
export * from "./validators";
export * from "./converters";
