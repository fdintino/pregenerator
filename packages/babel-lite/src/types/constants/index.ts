export const STATEMENT_OR_BLOCK_KEYS = [
  "consequent",
  "body",
  "alternate",
] as const;
export const FLATTENABLE_KEYS = ["body", "expressions"] as const;
export const FOR_INIT_KEYS = ["left", "init"] as const;
export const COMMENT_KEYS = [
  "leadingComments",
  "trailingComments",
  "innerComments",
] as const;

export const LOGICAL_OPERATORS = ["||", "&&", "??"] as const;
export const UPDATE_OPERATORS = ["++", "--"] as const;

export const BOOLEAN_NUMBER_BINARY_OPERATORS = [">", "<", ">=", "<="] as const;
export const EQUALITY_BINARY_OPERATORS = ["==", "===", "!=", "!=="] as const;
export const COMPARISON_BINARY_OPERATORS = [
  ...EQUALITY_BINARY_OPERATORS,
  "in",
  "instanceof",
] as const;
export const BOOLEAN_BINARY_OPERATORS = [
  ...COMPARISON_BINARY_OPERATORS,
  ...BOOLEAN_NUMBER_BINARY_OPERATORS,
] as const;
export const NUMBER_BINARY_OPERATORS = [
  "-",
  "/",
  "%",
  "*",
  "**",
  "&",
  "|",
  ">>",
  ">>>",
  "<<",
  "^",
] as const;
export const BINARY_OPERATORS = [
  "+",
  ...NUMBER_BINARY_OPERATORS,
  ...BOOLEAN_BINARY_OPERATORS,
] as const;

export const ASSIGNMENT_OPERATORS = [
  "=",
  "+=",
  ...NUMBER_BINARY_OPERATORS.map((op) => op + "="),
  ...LOGICAL_OPERATORS.map((op) => op + "="),
] as const;

export const BOOLEAN_UNARY_OPERATORS = ["delete", "!"] as const;
export const NUMBER_UNARY_OPERATORS = ["+", "-", "~"] as const;
export const STRING_UNARY_OPERATORS = ["typeof"] as const;
export const UNARY_OPERATORS = [
  "void",
  "throw",
  ...BOOLEAN_UNARY_OPERATORS,
  ...NUMBER_UNARY_OPERATORS,
  ...STRING_UNARY_OPERATORS,
] as const;

export const INHERIT_KEYS = {
  optional: ["typeAnnotation", "typeParameters", "returnType"],
  force: ["start", "loc", "end"],
} as const;

export const BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped");
export const NOT_LOCAL_BINDING = Symbol.for(
  "should not be considered a local binding"
);
