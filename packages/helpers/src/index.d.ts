/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace PregeneratorHelpers {
  type PropertyKey = string | number | symbol;
  type Primitive = boolean | number | string | null | undefined;
  type ObjectRecord = Record<PropertyKey, ObjectRecord | Primitive>;

  interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
  }
  interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
  }

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

  interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
  }

  interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
  }

  type IteratorResult<T, TReturn = any> =
    | IteratorYieldResult<T>
    | IteratorReturnResult<TReturn>;

  interface Iterator<T, TReturn = any, TNext = undefined> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
  }
  export function arrayFrom<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
}
// eslint-disable-next-line no-var
declare var pregeneratorHelpers: PregeneratorHelpers;

export const objectWithoutProperties =
  PregeneratorHelpers.objectWithoutProperties;
export const _extends = PregeneratorHelpers._extends;
export const objectDestructuringEmpty =
  PregeneratorHelpers.objectDestructuringEmpty;
export const toPrimitive = PregeneratorHelpers.toPrimitive;
export const toPropertyKey = PregeneratorHelpers.toPropertyKey;
export const defineEnumerableProperties =
  PregeneratorHelpers.defineEnumerableProperties;
export const defineProperty = PregeneratorHelpers.defineProperty;
export const arrayFrom = PregeneratorHelpers.arrayFrom;

declare global {
  // eslint-disable-next-line no-var
  declare var pregeneratorHelpers: PregeneratorHelpers;
}
