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
    has(member, "computed") && member.computed
  );
  member.property = append;
  member.computed = !!computed;

  return member;
}
