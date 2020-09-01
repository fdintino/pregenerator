export default function has<K extends PropertyKey>(
  obj: unknown,
  prop: K
): obj is Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
