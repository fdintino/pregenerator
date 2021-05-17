// export default function has<T extends Node, K extends string>(
//   obj: T,
//   prop: K
// ): obj is Extract<T, Record<K, Extract<T, Record<K, unknown>>[K]>>;
//
// export default function has<T extends unknown, K extends PropertyKey>(
//   obj: T,
//   prop: K
// ): obj is Extract<T, Record<K, Extract<T, Record<K, unknown>>[K]>>;
//
// export default function has<K extends PropertyKey>(
//   obj: unknown,
//   prop: K
// ): obj is Record<K, unknown>;

export default function has<K extends PropertyKey>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
