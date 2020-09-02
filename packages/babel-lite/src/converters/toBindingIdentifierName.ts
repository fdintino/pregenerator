import toIdentifier from "./toIdentifier";

export default function toBindingIdentifierName(
  name: { toString(): string } | string
): string {
  let id = toIdentifier(name);
  if (id === "eval" || id === "arguments") id = "_" + id;

  return id;
}
