import * as acorn from "acorn";
export type ParserOpts = acorn.Options;

/**
 * These are the options that 'pregenerator-template' actually accepts and typechecks
 * when called. All other options are passed through to the parser.
 */
export type PublicOpts = {
  /**
   * A set of placeholder names to automatically accept, ignoring the given
   * pattern entirely.
   *
   * This option can be used when using %%foo%% style placeholders.
   */
  placeholderWhitelist?: Set<string>;
  /**
   * A pattern to search for when looking for Identifier and StringLiteral
   * nodes that can be replaced.
   *
   * 'false' will disable placeholder searching entirely, leaving only the
   * 'placeholderWhitelist' value to find replacements.
   *
   * Defaults to /^[_$A-Z0-9]+$/.
   *
   * This option can be used when using %%foo%% style placeholders.
   */
  placeholderPattern?: RegExp | false;
  /**
   * 'true' to pass through comments from the template into the resulting AST,
   * or 'false' to automatically discard comments. Defaults to 'false'.
   */
  preserveComments?: boolean;
};

export type TemplateOpts = {
  parser: ParserOpts;
  placeholderWhitelist?: Set<string>;
  placeholderPattern?: RegExp | false;
  preserveComments?: boolean;
};

export function merge(a: TemplateOpts, b: TemplateOpts): TemplateOpts {
  const {
    placeholderWhitelist = a.placeholderWhitelist,
    placeholderPattern = a.placeholderPattern,
    preserveComments = a.preserveComments,
  } = b;

  return {
    parser: {
      ...a.parser,
      ...b.parser,
    },
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
  };
}

export function validate(opts: unknown): TemplateOpts {
  if (opts != null && typeof opts !== "object") {
    throw new Error("Unknown template options.");
  }

  const {
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
    ...parser
  } = opts || ({} as any);

  if (placeholderWhitelist != null && !(placeholderWhitelist instanceof Set)) {
    throw new Error(
      "'.placeholderWhitelist' must be a Set, null, or undefined"
    );
  }

  if (
    placeholderPattern != null &&
    !(placeholderPattern instanceof RegExp) &&
    placeholderPattern !== false
  ) {
    throw new Error(
      "'.placeholderPattern' must be a RegExp, false, null, or undefined"
    );
  }

  if (preserveComments != null && typeof preserveComments !== "boolean") {
    throw new Error(
      "'.preserveComments' must be a boolean, null, or undefined"
    );
  }

  return {
    parser,
    placeholderWhitelist: placeholderWhitelist || undefined,
    placeholderPattern:
      placeholderPattern == null ? undefined : placeholderPattern,
    preserveComments: preserveComments == null ? undefined : preserveComments,
  };
}

export type PublicReplacements = { [x: string]: unknown } | Array<unknown>;
export type TemplateReplacements = { [x: string]: unknown } | void;

export function normalizeReplacements(
  replacements: unknown
): TemplateReplacements {
  if (Array.isArray(replacements)) {
    return replacements.reduce((acc, replacement, i) => {
      acc["$" + i] = replacement;
      return acc;
    }, {});
  } else if (typeof replacements === "object" || replacements == null) {
    return (replacements as any) || undefined;
  }

  throw new Error(
    "Template replacements must be an array, object, null, or undefined"
  );
}
