/* eslint-disable @typescript-eslint/no-explicit-any */
export default function shallowEqual<T extends Record<string, any>>(
  actual: unknown,
  expected: T
): actual is T {
  const keys = Object.keys(expected);

  for (const key of keys) {
    if (actual[key] !== expected[key]) {
      return false;
    }
  }

  return true;
}
