import * as acorn from "acorn";
import { namedTypes as N } from "@pregenerator/ast-types";

const TokenType = acorn.TokenType;
const tt = acorn.tokTypes;

const ttPlaceholder = new TokenType("%%", { startsExpr: true });

const percentSign = 37;

type PlaceholderTypes = N.Placeholder["expectedNode"];

type Placeholder<T extends PlaceholderTypes> = N.Placeholder & {
  expectedNode: T;
};

type NodeOf<T extends PlaceholderTypes> = T extends "Identifier"
  ? N.Identifier
  : T extends "StringLiteral"
  ? N.StringLiteral
  : T extends "Expression"
  ? N.Expression
  : T extends "Statement"
  ? N.Statement
  : T extends "Declaration"
  ? N.Declaration
  : T extends "BlockStatement"
  ? N.BlockStatement
  : T extends "ClassBody"
  ? N.ClassBody
  : T extends "Pattern"
  ? N.Pattern
  : never;

type MaybePlaceholder<T extends PlaceholderTypes> = NodeOf<T> | Placeholder<T>;

declare class DestructuringErrors {
  shorthandAssign: number;
  trailingComma: number;
  parenthesizedAssign: number;
  parenthesizedBind: number;
  doubleProto: number;
}

declare class AcornParser extends acorn.Parser {
  input: string;
  pos: number;
  type: acorn.TokenType;
  yieldPos: number;
  options: acorn.Options;
  awaitPos: number;
  awaitIdentPos: number;
  lastTokEnd: number;
  start: number;
  strict: boolean;
  eat(type: acorn.TokenType): boolean;
  treatFunctionsAsVar: boolean;
  initFunction(node: N.Node): void;
  parseFunctionParams(node: N.Node): void;
  enterScope(flags: number): void;
  parseFunctionBody(
    node: N.Node,
    isArrowFunction: boolean,
    isMethod: boolean
  ): void;
  next(): void;
  getToken(): acorn.Token;
  getTokenFromCode(code: number): acorn.Token;
  expect(type: acorn.TokenType): void;
  skipSpace(): void;
  raise(pos: number, msg: string): never;
  finishOp(type: acorn.TokenType, size: number): acorn.Token;
  finishNode<T extends N.Node>(node: Partial<T>, type: T["type"]): T;
  parseIdent(
    liberal?: boolean,
    isBinding?: boolean
  ): MaybePlaceholder<"Identifier">;
  parseExprAtom(
    refDestructuringErrors?: DestructuringErrors
  ): MaybePlaceholder<"Expression">;
  parseBindingAtom(): MaybePlaceholder<"Pattern">;
  checkUnreserved(ref: N.Node): void;
  checkLValSimple(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void;
  checkLValPattern(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void;
  checkLValInnerPattern(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void;
  startNode(): Partial<N.Node>;
  toAssignable(
    node: N.Node,
    isBinding: boolean,
    refDestructuringErrors: DestructuringErrors
  ): N.Node;
  parseExpressionStatement(
    node: Partial<MaybePlaceholder<"Statement">>,
    expr: MaybePlaceholder<"Expression">
  ): MaybePlaceholder<"Statement">;
  parseBlock(
    createNewLexicalScope: boolean | undefined,
    node: Partial<N.BlockStatement>,
    exitStrict?: boolean
  ): MaybePlaceholder<"BlockStatement">;
  parseStatement(
    context: string | null,
    topLevel?: boolean,
    exports?: Record<string, unknown>
  ): N.Statement;
  adaptDirectivePrologue(statements?: N.ExpressionStatement[]): void;
  semicolon(): void;
  isContextual(name: string): boolean;
  isLet(context?: string): boolean;
  unexpected(): never;
}

const BaseParser = acorn.Parser as unknown as typeof AcornParser;

export const SCOPE_TOP = 1,
  SCOPE_FUNCTION = 2,
  SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION,
  SCOPE_ASYNC = 4,
  SCOPE_GENERATOR = 8,
  SCOPE_ARROW = 16,
  SCOPE_SIMPLE_CATCH = 32,
  SCOPE_SUPER = 64,
  SCOPE_DIRECT_SUPER = 128;

function functionFlags(
  async: boolean | undefined,
  generator: boolean | undefined
) {
  return (
    SCOPE_FUNCTION |
    (async ? SCOPE_ASYNC : 0) |
    (generator ? SCOPE_GENERATOR : 0)
  );
}

// Used in checkLVal* and declareName to determine the type of a binding
export const BIND_NONE = 0, // Not a binding
  BIND_VAR = 1, // Var-style binding
  BIND_LEXICAL = 2, // Let- or const-style binding
  BIND_FUNCTION = 3, // Function declaration
  BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
  BIND_OUTSIDE = 5; // Special case for function names as bound inside the function

const FUNC_STATEMENT = 1,
  FUNC_HANGING_STATEMENT = 2,
  FUNC_NULLABLE_ID = 4;

const skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

class Parser extends BaseParser {
  assertNoSpace(msg: string): void {
    if (this.start > this.lastTokEnd) {
      this.raise(this.lastTokEnd, msg);
    }
  }

  parsePlaceholder<T extends PlaceholderTypes>(
    expectedNode: T
  ): Placeholder<T> | undefined {
    if (this.type === ttPlaceholder) {
      const node = this.startNode() as Partial<N.Placeholder>;
      this.next();
      this.assertNoSpace("Unexpected space in placeholder.");
      node.name = super.parseIdent(true) as N.Identifier;
      this.assertNoSpace("Unexpected space in placeholder.");
      this.expect(ttPlaceholder);
      return this.finishPlaceholder(node, expectedNode);
    }
  }

  finishPlaceholder<T extends PlaceholderTypes>(
    node: Partial<N.Placeholder>,
    expectedNode: T
  ): N.Placeholder & { expectedNode: T } {
    const isFinished = !!(
      node.type === "Placeholder" && (node as any).expectedNode
    );
    (node as any).expectedNode = expectedNode;
    return (
      isFinished ? node : this.finishNode(node, "Placeholder")
    ) as Placeholder<T>;
  }

  getTokenFromCode(code: number): acorn.Token {
    if (
      code === percentSign &&
      this.input.charCodeAt(this.pos + 1) === percentSign
    ) {
      return this.finishOp(ttPlaceholder, 2);
    }
    return super.getTokenFromCode(code);
  }

  parseExprAtom(
    refDestructuringErrors?: DestructuringErrors
  ): MaybePlaceholder<"Expression"> {
    return (
      this.parsePlaceholder("Expression") ||
      super.parseExprAtom(refDestructuringErrors)
    );
  }
  parseIdent(
    liberal?: boolean,
    isBinding?: boolean
  ): MaybePlaceholder<"Identifier"> {
    // NOTE: This function only handles identifiers outside of
    // expressions and binding patterns, since they are already
    // handled by the parseExprAtom and parseBindingAtom functions.
    // This is needed, for example, to parse "class %%NAME%% {}".
    return (
      this.parsePlaceholder("Identifier") ||
      super.parseIdent(liberal, isBinding)
    );
  }
  checkUnreserved(ref: N.Node): void {
    if (ref.type !== "Placeholder") super.checkUnreserved(ref);
  }

  parseBindingAtom(): MaybePlaceholder<"Pattern"> {
    return this.parsePlaceholder("Pattern") || super.parseBindingAtom();
  }
  checkLValSimple(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void {
    if (expr.type !== "Placeholder")
      super.checkLValSimple(expr, bindingType, checkClashes);
  }
  checkLValPattern(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void {
    if (expr.type !== "Placeholder")
      super.checkLValPattern(expr, bindingType, checkClashes);
  }
  checkLValInnerPattern(
    expr: N.Node,
    bindingType?: number,
    checkClashes?: boolean
  ): void {
    if (expr.type !== "Placeholder")
      super.checkLValInnerPattern(expr, bindingType, checkClashes);
  }

  toAssignable(
    node: N.Node,
    isBinding: boolean,
    refDestructuringErrors: DestructuringErrors
  ): N.Node {
    if (
      node &&
      node.type === "Placeholder" &&
      node.expectedNode === "Expression"
    ) {
      node.expectedNode = "Pattern";
      return node;
    }
    return super.toAssignable(node, isBinding, refDestructuringErrors);
  }

  isLet(context?: string): boolean {
    if (super.isLet(context)) {
      return true;
    }
    // Replicate the original checks that lead to looking ahead for an
    // identifier.
    if (!this.isContextual("let")) {
      return false;
    }
    if (context) return false;
    // Accept "let %%" as the start of "let %%placeholder%%", as though the
    // placeholder were an identifier.
    skipWhiteSpace.lastIndex = this.pos;
    const skip = skipWhiteSpace.exec(this.input);
    const next = this.pos + (skip ? skip[0].length : 0);
    const nextCh = this.input.charCodeAt(next);
    const nextCh2 = this.input.charCodeAt(next + 1);
    if (nextCh === percentSign && nextCh2 === percentSign) return true;
    return false;
  }
  parseExpressionStatement(
    node: MaybePlaceholder<"Statement">,
    expr: MaybePlaceholder<"Expression">
  ): MaybePlaceholder<"Statement"> {
    if (expr.type !== "Placeholder") {
      return super.parseExpressionStatement(node, expr);
    }
    if (this.type === tt.colon) {
      const stmt: N.LabeledStatement = node as N.LabeledStatement;
      stmt.label = this.finishPlaceholder(expr, "Identifier") as any;
      this.next();
      stmt.body = this.parseStatement("label");
      return this.finishNode(stmt, "LabeledStatement");
    }
    this.semicolon();
    (node as N.Placeholder).name = expr.name;
    return this.finishPlaceholder(node as N.Placeholder, "Statement");
  }
  parseBlock(
    createNewLexicalScope: boolean | undefined,
    node: Partial<N.BlockStatement>,
    exitStrict?: boolean
  ): MaybePlaceholder<"BlockStatement"> {
    return (
      this.parsePlaceholder("BlockStatement") ||
      super.parseBlock(createNewLexicalScope, node, exitStrict)
    );
  }
  parseFunctionId(requireId?: boolean): N.Identifier | N.Placeholder | null {
    return requireId || this.type === tt.name ? this.parseIdent() : null;
  }
  parseFunction(
    node: N.FunctionDeclaration | N.FunctionExpression,
    statement: number,
    allowExpressionBody: boolean,
    isAsync: boolean
  ): N.FunctionDeclaration | N.FunctionExpression {
    this.initFunction(node);
    if (
      this.options.ecmaVersion >= 9 ||
      (this.options.ecmaVersion >= 6 && !isAsync)
    ) {
      if (this.type === tt.star && statement & FUNC_HANGING_STATEMENT) {
        this.unexpected();
      }
      node.generator = this.eat(tt.star);
    }
    if (this.options.ecmaVersion >= 8) {
      node.async = !!isAsync;
    }

    if (statement & FUNC_STATEMENT) {
      (node as any).id = this.parseFunctionId(!!(statement & FUNC_NULLABLE_ID));
      if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
        // If it is a regular function declaration in sloppy mode, then it is
        // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
        // mode depends on properties of the current scope (see
        // treatFunctionsAsVar).
        this.checkLValSimple(
          node.id,
          this.strict || node.generator || node.async
            ? this.treatFunctionsAsVar
              ? BIND_VAR
              : BIND_LEXICAL
            : BIND_FUNCTION
        );
      }
    }

    const oldYieldPos = this.yieldPos,
      oldAwaitPos = this.awaitPos,
      oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(node.async, node.generator));

    if (!(statement & FUNC_STATEMENT)) {
      (node as any).id = this.parseFunctionId();
    }

    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody, false);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(
      node as any,
      statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression"
    );
  }
  adaptDirectivePrologue(statements?: N.ExpressionStatement[]): void {
    if (typeof statements === "undefined") return;
    super.adaptDirectivePrologue(statements);
  }
}
export default Parser;
