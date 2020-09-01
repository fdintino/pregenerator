import type { Node, FieldOptions } from "../types";
import { NODE_FIELDS, NODE_PARENT_VALIDATIONS } from "../definitions";
import isNode from "./isNode";

function has<K extends PropertyKey>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export default function validate<T extends Node, K extends Extract<keyof T, string>>(
  node: T | null | undefined,
  key: K,
  val: T[K]
): void {
  if (!isNode(node)) return;

  const fields = NODE_FIELDS[node.type];
  if (!fields) return;

  if (has(fields, key)) {
    const field = fields[key];
    validateField(node, key, val, field);
    if (isNode(val)) {
      validateChild(node, key, val);
    }
  }
}

export function validateField<T extends Node, K extends Extract<keyof T, string>>(
  node: T,
  key: K,
  val: T[K],
  field?: FieldOptions
): void {
  if (!field?.validate) return;
  if (field.optional && val == null) return;

  field.validate(node, key, val);
}

export function validateChild<T extends Node, K extends Extract<keyof T, string>>(
  node: T,
  key: K,
  val: T[K]
): void {
  if (!isNode(val)) {
    return;
  }
  // if (val == null) return;
  // if (!("type" in val)) return;
  const validate = NODE_PARENT_VALIDATIONS[val.type];
  if (!validate) return;
  validate(node, key, val);
}
