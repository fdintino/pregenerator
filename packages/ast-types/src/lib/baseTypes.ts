/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const Op = Object.prototype;
const objToStr = Op.toString;

export type Deep = boolean | ((type: Type<any>, value: any) => void);

// A type is an object with a .check method that takes a value and returns
// true or false according to whether the value matches the type.
export type Type<T> =
  | ArrayType<T>
  | IdentityType<T>
  | ObjectType<T>
  | OrType<T>
  | PredicateType<T>;

abstract class BaseType<T> {
  abstract toString(): string;

  abstract check(value: any, deep?: Deep): value is T;

  assert(value: any, deep?: Deep): asserts value is T {
    if (!this.check(value, deep)) {
      const str = shallowStringify(value);
      throw new Error(str + " does not match type " + this);
    }
  }

  arrayOf(): Type<T[]> {
    const elemType = this as any as Type<T>;
    return new ArrayType<T[]>(elemType);
  }
}

export class ArrayType<T> extends BaseType<T> {
  readonly kind: "ArrayType" = "ArrayType";

  constructor(
    public readonly elemType: Type<T extends (infer E)[] ? E : never>
  ) {
    super();
  }

  toString(): string {
    return "[" + this.elemType + "]";
  }

  check(value: unknown, deep?: Deep): value is T {
    return (
      Array.isArray(value) &&
      value.every((elem) => this.elemType.check(elem, deep))
    );
  }
}

export class IdentityType<T> extends BaseType<T> {
  readonly kind: "IdentityType" = "IdentityType";

  constructor(public readonly value: T) {
    super();
  }

  toString(): string {
    return String(this.value);
  }

  check(value: unknown, deep?: Deep): value is T {
    const result = value === this.value;
    if (!result && typeof deep === "function") {
      deep(this, value);
    }
    return result;
  }
}

export class ObjectType<T> extends BaseType<T> {
  readonly kind: "ObjectType" = "ObjectType";

  constructor(public readonly fields: Field<any>[]) {
    super();
  }

  toString(): string {
    return "{ " + this.fields.join(", ") + " }";
  }

  check(value: unknown, deep?: Deep): value is T {
    if (typeof value !== "object" || value === null) return false;
    return (
      objToStr.call(value) === objToStr.call({}) &&
      this.fields.every((field) => {
        return field.type.check((value as any)[field.name], deep);
      })
    );
  }
}

export class OrType<T> extends BaseType<T> {
  readonly kind: "OrType" = "OrType";

  constructor(public readonly types: Type<any>[]) {
    super();
  }

  toString(): string {
    return this.types.join(" | ");
  }

  check(value: unknown, deep?: Deep): value is T {
    return this.types.some((type) => {
      return type.check(value, deep);
    });
  }
}

export class PredicateType<T> extends BaseType<T> {
  readonly kind: "PredicateType" = "PredicateType";

  constructor(
    public readonly name: string,
    public readonly predicate: (value: any, deep?: Deep) => boolean
  ) {
    super();
  }

  toString(): string {
    return this.name;
  }

  check(value: unknown, deep?: Deep): value is T {
    const result = this.predicate(value, deep);
    if (!result && typeof deep === "function") {
      deep(this, value);
    }
    return result;
  }
}

export function shallowStringify(value: any): string {
  if (Array.isArray(value)) {
    return "[" + value.map(shallowStringify).join(", ") + "]";
  }

  if (value && typeof value === "object") {
    return (
      "{ " +
      Object.keys(value)
        .map(function (key) {
          return key + ": " + value[key];
        })
        .join(", ") +
      " }"
    );
  }

  return JSON.stringify(value);
}

export class Field<T> {
  public readonly hidden: boolean;

  constructor(
    public readonly name: string,
    public readonly type: Type<T>,
    public readonly defaultFn?: Function,
    hidden?: boolean
  ) {
    this.hidden = !!hidden;
  }

  toString(): string {
    return JSON.stringify(this.name) + ": " + this.type;
  }

  getValue(obj: { [key: string]: any }) {
    let value = obj[this.name];

    if (typeof value !== "undefined") {
      return value;
    }

    if (typeof this.defaultFn === "function") {
      value = this.defaultFn.call(obj);
    }

    return value;
  }
}
