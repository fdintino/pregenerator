/* eslint-disable @typescript-eslint/no-explicit-any */
// declare namespace PregeneratorHelpers {
type PropertyKey = string | number | symbol;
type Primitive = boolean | number | string | null | undefined;
type ObjectRecord = Record<PropertyKey, ObjectRecord | Primitive>;

export function objectWithoutProperties(
  src: Record,
  excluded: string[]
): Record;

export function _extends<T>(target: T, ...sources: ObjectRecord[]): T;

export function objectDestructuringEmpty(obj: any);

export function toPrimitive(
  input: any,
  hint?: "default" | "string" | "number"
): Primitive;

export function toPropertyKey(arg: any): symbol | string;

export function defineEnumerableProperties<T>(obj: any, descs: any): any;

export function defineProperty<T>(
  obj: T,
  key: string | number | symbol,
  value: any
): T;
// }

// declare let pregeneratorHelpers: PregeneratorHelpers;
