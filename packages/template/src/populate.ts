import {
  namedTypes as t,
  builders as b,
  cloneNode,
} from "@pregenerator/ast-types";

import type { TemplateReplacements } from "./options";
import type { Metadata, Placeholder } from "./parse";

export default function populatePlaceholders(
  metadata: Metadata,
  replacements: TemplateReplacements
): t.File {
  const ast = cloneNode(metadata.ast);

  if (replacements) {
    metadata.placeholders.forEach((placeholder) => {
      if (
        !Object.prototype.hasOwnProperty.call(replacements, placeholder.name)
      ) {
        const placeholderName = placeholder.name;

        throw new Error(
          `Error: No substitution given for "${placeholderName}". If this is not meant to be a
            placeholder you may want to consider passing one of the following options to @pregenerator/template:
            - { placeholderPattern: false, placeholderWhitelist: new Set(['${placeholderName}'])}
            - { placeholderPattern: /^${placeholderName}$/ }`
        );
      }
    });
    Object.keys(replacements).forEach((key) => {
      if (!metadata.placeholderNames.has(key)) {
        throw new Error(`Unknown substitution "${key}" given`);
      }
    });
  }

  // Process in reverse order so AST mutation doesn't change indices that
  // will be needed for later calls to `placeholder.resolve()`.
  metadata.placeholders
    .slice()
    .reverse()
    .forEach((placeholder) => {
      try {
        applyReplacement(
          placeholder,
          ast,
          (replacements && replacements[placeholder.name]) || null
        );
      } catch (e) {
        e.message = `@pregenerator/template placeholder "${placeholder.name}": ${e.message}`;
        throw e;
      }
    });

  return ast;
}

function applyReplacement(
  placeholder: Placeholder,
  ast: t.File,
  replacement: any
) {
  // Track inserted nodes and clone them if they are inserted more than
  // once to avoid injecting the same node multiple times.
  if (placeholder.isDuplicate) {
    if (Array.isArray(replacement)) {
      replacement = replacement.map((node) => cloneNode(node));
    } else if (typeof replacement === "object") {
      replacement = cloneNode(replacement);
    }
  }

  const { parent, key, index } = placeholder.resolve(ast);

  if (placeholder.type === "string") {
    if (typeof replacement === "string") {
      replacement = b.stringLiteral(replacement);
    }
    if (!replacement || !t.StringLiteral.check(replacement)) {
      throw new Error("Expected string substitution");
    }
  } else if (placeholder.type === "statement") {
    if (index === undefined) {
      if (!replacement) {
        replacement = b.emptyStatement();
      } else if (Array.isArray(replacement)) {
        replacement = b.blockStatement(replacement);
      } else if (typeof replacement === "string") {
        replacement = b.expressionStatement(b.identifier(replacement));
      } else if (!t.Statement.check(replacement)) {
        replacement = b.expressionStatement(replacement as any);
      }
    } else {
      if (replacement && !Array.isArray(replacement)) {
        if (typeof replacement === "string") {
          replacement = b.identifier(replacement);
        }
        if (!t.Statement.check(replacement)) {
          replacement = b.expressionStatement(replacement as any);
        }
      }
    }
  } else if (placeholder.type === "param") {
    if (typeof replacement === "string") {
      replacement = b.identifier(replacement);
    }

    if (index === undefined) throw new Error("Assertion failure.");
  } else {
    if (typeof replacement === "string") {
      replacement = b.identifier(replacement);
    } else if (typeof replacement === "number") {
      replacement = b.numericLiteral(replacement);
    }
    if (Array.isArray(replacement)) {
      throw new Error("Cannot replace single expression with an array.");
    }
  }

  if (index === undefined) {
    // t.validate(parent, key, replacement);

    (parent as any)[key] = replacement;
  } else {
    const items: Array<t.Node> = (parent as any)[key].slice();

    if (placeholder.type === "statement" || placeholder.type === "param") {
      if (replacement == null) {
        items.splice(index, 1);
      } else if (Array.isArray(replacement)) {
        items.splice(index, 1, ...replacement);
      } else {
        items[index] = replacement;
      }
    } else {
      items[index] = replacement;
    }

    // t.validate(parent, key, items);
    (parent as any)[key] = items;
  }
}
