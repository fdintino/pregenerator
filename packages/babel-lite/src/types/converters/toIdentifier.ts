import isValidIdentifier from "../validators/isValidIdentifier";

export default function toIdentifier(
  name: string | { toString(): string } | null | undefined
): string {
  let id = (name || "") + "";

  // replace all non-valid identifiers with dashes
  id = id.replace(/[^a-zA-Z0-9$_]/g, "-");

  // remove all dashes and numbers from start of name
  id = id.replace(/^[-0-9]+/, "");

  // camel case
  id = id.replace(/[-\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : "";
  });

  if (!isValidIdentifier(id)) {
    id = `_${id}`;
  }

  return id || "_";
}
