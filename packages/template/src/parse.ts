import { namedTypes as t, traverse } from "@pregenerator/ast-types";
import type {
  TraversalAncestors,
  TraversalHandler,
} from "@pregenerator/ast-types";
import parse from "@pregenerator/parser";
import type { ParserOptions } from "@pregenerator/parser";
import Parser from "./parser";
import type { TemplateOpts } from "./options";
import type { Formatter } from "./formatters";

export type Metadata = {
  ast: t.File;
  placeholders: Array<Placeholder>;
  placeholderNames: Set<string>;
};

type PlaceholderType = "string" | "param" | "statement" | "other";
export type Placeholder = {
  name: string;
  resolve: (a: t.File) => { parent: t.Node; key: string; index?: number };
  type: PlaceholderType;
  isDuplicate: boolean;
};

const PATTERN = /^[_$A-Z0-9]+$/;

export default function parseAndBuildMetadata<T>(
  formatter: Formatter<T>,
  code: string,
  opts: TemplateOpts
): Metadata {
  const { placeholderWhitelist, placeholderPattern } = opts;

  const ast = parseWithCodeFrame(code, opts.parser);

  formatter.validate(ast);

  const syntactic = {
    placeholders: [],
    placeholderNames: new Set<string>(),
  };
  const legacy = {
    placeholders: [],
    placeholderNames: new Set<string>(),
  };
  const isLegacyRef = { value: undefined };

  traverse(ast, placeholderVisitorHandler as TraversalHandler<any>, {
    syntactic,
    legacy,
    isLegacyRef,
    placeholderWhitelist,
    placeholderPattern,
    syntacticPlaceholders: true,
  });

  return {
    ast,
    ...(isLegacyRef.value ? legacy : syntactic),
  };
}

function placeholderVisitorHandler(
  node: t.Node,
  ancestors: TraversalAncestors,
  state: MetadataState
) {
  debugger;
  let name: string;

  if (t.Placeholder.check(node)) {
    name = node.name.name;
    state.isLegacyRef.value = false;
  } else if (t.Identifier.check(node)) {
    name = node.name;
    state.isLegacyRef.value = true;
  } else if (t.StringLiteral.check(node)) {
    name = node.value;
    state.isLegacyRef.value = true;
  } else {
    return;
  }

  if (
    state.isLegacyRef.value &&
    (state.placeholderPattern === false ||
      !(state.placeholderPattern || PATTERN).test(name)) &&
    !state.placeholderWhitelist?.has(name)
  ) {
    return;
  }

  // Keep our own copy of the ancestors so we can use it in .resolve().
  ancestors = ancestors.slice();

  const { node: parent, key } = ancestors[ancestors.length - 1];

  let type: PlaceholderType;
  if (
    t.StringLiteral.check(node) ||
    (t.Placeholder.check(node) && node.expectedNode === "StringLiteral")
  ) {
    type = "string";
  } else if (
    (t.NewExpression.check(parent) && key === "arguments") ||
    (t.CallExpression.check(parent) && key === "arguments") ||
    (t.Function.check(parent) && key === "params")
  ) {
    type = "param";
  } else if (
    t.ExpressionStatement.check(parent) &&
    !t.Placeholder.check(node)
  ) {
    type = "statement";
    ancestors = ancestors.slice(0, -1);
  } else if (t.Statement.check(node) && t.Placeholder.check(node)) {
    type = "statement";
  } else {
    type = "other";
  }

  const { placeholders, placeholderNames } = state.isLegacyRef.value
    ? state.legacy
    : state.syntactic;

  placeholders.push({
    name,
    type,
    resolve: (ast) => resolveAncestors(ast, ancestors),
    isDuplicate: placeholderNames.has(name),
  });
  placeholderNames.add(name);
}

function resolveAncestors(ast: t.File, ancestors: TraversalAncestors) {
  let parent: t.Node = ast;
  for (let i = 0; i < ancestors.length - 1; i++) {
    const { key, index } = ancestors[i];

    if (index === undefined) {
      parent = (parent as any)[key];
    } else {
      parent = (parent as any)[key][index];
    }
  }

  const { key, index } = ancestors[ancestors.length - 1];

  return { parent, key, index };
}

type MetadataState = {
  syntactic: {
    placeholders: Array<Placeholder>;
    placeholderNames: Set<string>;
  };
  legacy: {
    placeholders: Array<Placeholder>;
    placeholderNames: Set<string>;
  };
  isLegacyRef: {
    value?: boolean;
  };
  placeholderWhitelist?: Set<string>;
  placeholderPattern?: RegExp | false;
  syntacticPlaceholders?: boolean;
};

function parseWithCodeFrame(
  code: string,
  parserOpts: Partial<ParserOptions>
): t.File {
  parserOpts = {
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: "module",
    Parser,
    ...parserOpts,
  };

  try {
    return parse(code, parserOpts);
  } catch (err) {
    const loc = err.loc;
    if (loc) {
      err.code = "PREGENERATOR_TEMPLATE_PARSE_ERROR";
    }
    throw err;
  }
}
