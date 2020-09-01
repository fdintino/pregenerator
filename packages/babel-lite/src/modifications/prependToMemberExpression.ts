import type { MemberExpression } from "../types";
import { memberExpression } from "../builders/generated";

/**
 * Prepend a node to a member expression.
 */
export default function prependToMemberExpression<
  T extends Pick<MemberExpression, "object" | "property">
>(member: T, prepend: MemberExpression["object"]): T {
  member.object = memberExpression(prepend, member.object);

  return member;
}
