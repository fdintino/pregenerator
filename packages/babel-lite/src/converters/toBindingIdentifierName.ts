import toIdentifier from "./toIdentifier";

export default function toBindingIdentifierName(
  name: { toString(): string } | null | undefined
): string {
  name = toIdentifier(name);
  if (name === "eval" || name === "arguments") name = "_" + name;

  return name;
}
