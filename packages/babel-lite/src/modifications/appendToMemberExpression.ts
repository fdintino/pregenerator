import type { MemberExpression } from "../types";
import { memberExpression } from "../builders/generated";
import has from "../utils/has";

/**
 * Append a node to a member expression.
 */
export default function appendToMemberExpression<
  T extends Pick<MemberExpression, "object" | "property">
>(member: T, append: MemberExpression["property"], computed?: boolean): T {
  member.object = memberExpression(
    member.object,
    member.property,
    has(member, "computed") &&
      typeof member.computed === "boolean" &&
      member.computed
  );
  member.property = append;
  if (has(member, "computed") && typeof member.computed === "boolean") {
    member.computed = !!computed;
  }

  return member;
}
