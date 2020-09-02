import type { ModuleSpecifier } from "../types";
import { isIdentifier, isImportDefaultSpecifier } from "./generated";
import has from "../utils/has";

/**
 * Check if the input `specifier` is a `default` import or export.
 */
export default function isSpecifierDefault(
  specifier: ModuleSpecifier
): boolean {
  return (
    isImportDefaultSpecifier(specifier) ||
    isIdentifier(
      (has(specifier, "imported") && specifier.imported) ||
        (has(specifier, "exported") && specifier.exported),
      {
        name: "default",
      }
    )
  );
}
