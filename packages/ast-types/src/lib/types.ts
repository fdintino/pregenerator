/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  shallowStringify,
  Field,
  OrType,
  ArrayType,
  IdentityType,
  ObjectType,
  PredicateType,
  Type as _Type,
} from "./baseTypes";
import type { Deep } from "./baseTypes";
import { namedTypes } from "../gen/namedTypes";
const Op = Object.prototype;
const objToStr = Op.toString;
const hasOwn = Op.hasOwnProperty;

export type Type<T> = _Type<T>;

export abstract class Def<T = any> {
  public baseNames: string[] = [];
  public ownFields: { [name: string]: Field<any> } = Object.create(null);

  public aliasNames: string[] = [];

  // Includes own typeName. Populated during finalization.
  public allSupertypes: { [name: string]: Def<any> } = Object.create(null);

  // Linear inheritance hierarchy. Populated during finalization.
  public supertypeList: string[] = [];

  // Includes inherited fields.
  public allFields: { [name: string]: Field<any> } = Object.create(null);

  // Non-hidden keys of allFields.
  public fieldNames: string[] = [];

  // This property will be overridden as true by individual Def instances
  // when they are finalized.
  public finalized = false;

  // False by default until .build(...) is called on an instance.
  public buildable = false;
  public buildParams: string[] = [];

  constructor(
    public readonly type: Type<T>,
    public readonly typeName: string
  ) {}

  isSupertypeOf(that: Def<any>): boolean {
    if (that instanceof Def) {
      if (this.finalized !== true || that.finalized !== true) {
        throw new Error("");
      }
      return hasOwn.call(that.allSupertypes, this.typeName);
    } else {
      throw new Error(that + " is not a Def");
    }
  }

  checkAllFields(value: Record<string, any>, deep?: Deep): boolean {
    const allFields = this.allFields;
    if (this.finalized !== true) {
      throw new Error("" + this.typeName);
    }

    function checkFieldByName(name: string) {
      const field = allFields[name];
      const type = field.type;
      const child = field.getValue(value);
      return type.check(child, deep);
    }

    return (
      value !== null &&
      typeof value === "object" &&
      Object.keys(allFields).every(checkFieldByName)
    );
  }

  abstract check(value: unknown, deep?: Deep): boolean;

  bases(...supertypeNames: string[]): this {
    const bases = this.baseNames;

    if (this.finalized) {
      if (supertypeNames.length !== bases.length) {
        throw new Error("");
      }
      for (let i = 0; i < supertypeNames.length; i++) {
        if (supertypeNames[i] !== bases[i]) {
          throw new Error("");
        }
      }
      return this;
    }

    supertypeNames.forEach((baseName) => {
      // This indexOf lookup may be O(n), but the typical number of base
      // names is very small, and indexOf is a native Array method.
      if (bases.indexOf(baseName) < 0) {
        bases.push(baseName);
      }
    });

    return this; // For chaining.
  }

  aliases(...aliasNames: string[]): this {
    const aliases = this.aliasNames;

    if (this.finalized) {
      if (aliasNames.length !== aliases.length) {
        throw new Error("");
      }
      for (let i = 0; i < aliasNames.length; i++) {
        if (aliasNames[i] !== aliases[i]) {
          throw new Error("");
        }
      }
      return this;
    }

    aliasNames.forEach((baseName) => {
      // This indexOf lookup may be O(n), but the typical number of base
      // names is very small, and indexOf is a native Array method.
      if (aliases.indexOf(baseName) < 0) {
        aliases.push(baseName);
      }
    });

    return this; // For chaining.
  }

  // Calling the .build method of a Def simultaneously marks the type as
  // buildable (by defining builders[getBuilderName(typeName)]) and
  // specifies the order of arguments that should be passed to the builder
  // function to create an instance of the type.
  abstract build(...buildParams: string[]): this;

  // The reason fields are specified using .field(...) instead of an object
  // literal syntax is somewhat subtle: the object literal syntax would
  // support only one key and one value, but with .field(...) we can pass
  // any number of arguments to specify the field.
  abstract field(
    name: string,
    type: any,
    defaultFn?: Function,
    hidden?: boolean
  ): this;

  abstract finalize(): void;
}

// Only export the Field type (not the value), so it's not externally constructable.
type FieldType<T> = Field<T>;
export type { FieldType as Field };

export interface ASTNode {
  type: string;
}

export interface Builder {
  (...args: any[]): ASTNode;
  from(obj: { [param: string]: any }): ASTNode;
}

export const Type = {
  or(...types: any[]): Type<any> {
    return new OrType(types.map((type) => Type.from(type)));
  },

  from<T>(value: any, name?: string): Type<T> {
    if (
      value instanceof ArrayType ||
      value instanceof IdentityType ||
      value instanceof ObjectType ||
      value instanceof OrType ||
      value instanceof PredicateType
    ) {
      return value;
    }

    // The Def type is used as a helper for constructing compound
    // interface types for AST nodes.
    if (value instanceof Def) {
      return value.type;
    }

    // Support [ElemType] syntax.
    if (isArray.check(value)) {
      if (value.length !== 1) {
        throw new Error("only one element type is permitted for typed arrays");
      }
      return new ArrayType(Type.from(value[0]));
    }

    // Support { someField: FieldType, ... } syntax.
    if (isObject.check(value)) {
      return new ObjectType(
        Object.keys(value).map((name) => {
          return new Field(name, Type.from(value[name], name));
        })
      );
    }

    if (typeof value === "function") {
      const bicfIndex = builtInCtorFns.indexOf(value);
      if (bicfIndex >= 0) {
        return builtInCtorTypes[bicfIndex];
      }

      if (typeof name !== "string") {
        throw new Error("missing name");
      }

      return new PredicateType(name, value);
    }

    // As a last resort, toType returns a type that matches any value that
    // is === from. This is primarily useful for literal values like
    // toType(null), but it has the additional advantage of allowing
    // toType to be a total function.
    return new IdentityType(value);
  },

  // Define a type whose name is registered in a namespace (the defCache) so
  // that future definitions will return the same type given the same name.
  // In particular, this system allows for circular and forward definitions.
  // The Def object d returned from Type.def may be used to configure the
  // type d.type by calling methods such as d.bases, d.build, and d.field.
  def(typeName: string): Def {
    return hasOwn.call(defCache, typeName)
      ? defCache[typeName]
      : (defCache[typeName] = new DefImpl(typeName));
  },

  hasDef(typeName: string): boolean {
    return hasOwn.call(defCache, typeName);
  },
};

const builtInCtorFns: Function[] = [];
const builtInCtorTypes: Type<any>[] = [];

export type BuiltInTypes = {
  string: string;
  function: Function;
  array: any[];
  object: { [key: string]: any };
  RegExp: RegExp;
  Date: Date;
  number: number;
  boolean: boolean;
  null: null;
  undefined: undefined;
};

function defBuiltInType<K extends keyof BuiltInTypes>(
  name: K,
  example: BuiltInTypes[K]
): PredicateType<BuiltInTypes[K]> {
  const objStr: string = objToStr.call(example);

  const type = new PredicateType<BuiltInTypes[K]>(
    name,
    (value) => objToStr.call(value) === objStr
  );

  if (example && typeof example.constructor === "function") {
    builtInCtorFns.push(example.constructor);
    builtInCtorTypes.push(type);
  }

  return type;
}

// These types check the underlying [[Class]] attribute of the given
// value, rather than using the problematic typeof operator. Note however
// that no subtyping is considered; so, for instance, isObject.check
// returns false for [], /./, new Date, and null.
const isString = defBuiltInType("string", "truthy");
// eslint-disable-next-line @typescript-eslint/no-empty-function
const isFunction = defBuiltInType("function", function () {});
const isArray = defBuiltInType("array", []);
const isObject = defBuiltInType("object", {});
const isRegExp = defBuiltInType("RegExp", /./);
const isDate = defBuiltInType("Date", new Date());
const isNumber = defBuiltInType("number", 3);
const isBoolean = defBuiltInType("boolean", true);
const isNull = defBuiltInType("null", null);
const isUndefined = defBuiltInType("undefined", undefined);

function assertIsFunction(value: unknown): asserts value is Function {
  if (typeof value !== "function") {
    throw new Error("Expected function");
  }
}

export const builtInTypes = {
  string: isString,
  function: isFunction,
  array: isArray,
  object: isObject,
  RegExp: isRegExp,
  Date: isDate,
  number: isNumber,
  boolean: isBoolean,
  null: isNull,
  undefined: isUndefined,
} as const;

export const AnyType = new PredicateType<any>("any", () => true);

// In order to return the same Def instance every time Type.def is called
// with a particular name, those instances need to be stored in a cache.
const defCache: { [typeName: string]: Def<any> } = Object.create(null);

export function defFromNodeType(type: string): Def<any> | null {
  if (hasOwn.call(defCache, type)) {
    const d = defCache[type];
    if (d.finalized) {
      return d;
    }
  }

  return null;
}

export function defFromValue(value: any): Def<any> | null {
  if (value && typeof value === "object") {
    const type = value.type;
    if (typeof type === "string" && hasOwn.call(defCache, type)) {
      const d = defCache[type];
      if (d.finalized) {
        return d;
      }
    }
  }

  return null;
}

class DefImpl<T = any> extends Def<T> {
  constructor(typeName: string) {
    super(
      new PredicateType<T>(typeName, (value, deep) => this.check(value, deep)),
      typeName
    );
  }

  check(value: any, deep?: Deep): boolean {
    if (this.finalized !== true) {
      throw new Error("prematurely checking unfinalized type " + this.typeName);
    }

    // A Def type can only match an object value.
    if (value === null || typeof value !== "object") {
      return false;
    }

    const vDef = defFromValue(value);
    if (!vDef) {
      // If we couldn't infer the Def associated with the given value,
      // and we expected it to be a SourceLocation or a Position, it was
      // probably just missing a "type" field (because Esprima does not
      // assign a type property to such nodes). Be optimistic and let
      // this.checkAllFields make the final decision.
      if (this.typeName === "SourceLocation" || this.typeName === "Position") {
        return this.checkAllFields(value, deep);
      }

      // Calling this.checkAllFields for any other type of node is both
      // bad for performance and way too forgiving.
      return false;
    }

    // If checking deeply and vDef === this, then we only need to call
    // checkAllFields once. Calling checkAllFields is too strict when deep
    // is false, because then we only care about this.isSupertypeOf(vDef).
    if (deep && vDef === this) {
      return this.checkAllFields(value, deep);
    }

    // In most cases we rely exclusively on isSupertypeOf to make O(1)
    // subtyping determinations. This suffices in most situations outside
    // of unit tests, since interface conformance is checked whenever new
    // instances are created using builder functions.
    if (!this.isSupertypeOf(vDef)) {
      return false;
    }

    // The exception is when deep is true; then, we recursively check all
    // fields.
    if (!deep) {
      return true;
    }

    // Use the more specific Def (vDef) to perform the deep check, but
    // shallow-check fields defined by the less specific Def (this).
    return (
      vDef.checkAllFields(value, deep) && this.checkAllFields(value, false)
    );
  }

  build(...buildParams: string[]): this {
    // Calling Def.prototype.build multiple times has the effect of merely
    // redefining this property.
    this.buildParams = buildParams;

    if (this.buildable) {
      // If this Def is already buildable, update self.buildParams and
      // continue using the old builder function.
      return this;
    }

    // Override Dp.buildable for this Def instance.
    this.buildable = true;

    const addParam = (
      built: any,
      param: any,
      arg: any,
      isArgAvailable: boolean
    ) => {
      if (hasOwn.call(built, param)) return;

      const all = this.allFields;
      if (!hasOwn.call(all, param)) {
        throw new Error(`Missing field ${param} on type ${this.typeName}`);
      }

      const field = all[param];
      const type = field.type;
      let value;

      if (isArgAvailable) {
        value = arg;
      } else if (field.defaultFn) {
        // Expose the partially-built object to the default
        // function as its `this` object.
        value = field.defaultFn.call(built);
      } else {
        const message =
          "no value or default function given for field " +
          JSON.stringify(param) +
          " of " +
          this.typeName +
          "(" +
          this.buildParams
            .map(function (name) {
              return all[name];
            })
            .join(", ") +
          ")";
        throw new Error(message);
      }

      if (!type.check(value)) {
        throw new Error(
          shallowStringify(value) +
            " does not match field " +
            field +
            " of type " +
            this.typeName
        );
      }

      built[param] = value;
    };

    // Calling the builder function will construct an instance of the Def,
    // with positional arguments mapped to the fields original passed to .build.
    // If not enough arguments are provided, the default value for the remaining fields
    // will be used.
    const builder: Builder = (...args: any[]) => {
      const argc = args.length;

      if (!this.finalized) {
        throw new Error(
          "attempting to instantiate unfinalized type " + this.typeName
        );
      }

      const built: ASTNode = Object.create(nodePrototype);

      this.buildParams.forEach(function (param, i) {
        if (i < argc) {
          addParam(built, param, args[i], true);
        } else {
          addParam(built, param, null, false);
        }
      });

      Object.keys(this.allFields).forEach(function (param) {
        // Use the default value.
        addParam(built, param, null, false);
      });

      // Make sure that the "type" field was filled automatically.
      if (built.type !== this.typeName) {
        throw new Error("");
      }

      return built;
    };

    // Calling .from on the builder function will construct an instance of the Def,
    // using field values from the passed object. For fields missing from the passed object,
    // their default value will be used.
    builder.from = (obj: { [fieldName: string]: any }) => {
      if (!this.finalized) {
        throw new Error(
          "attempting to instantiate unfinalized type " + this.typeName
        );
      }

      const built: ASTNode = Object.create(nodePrototype);

      Object.keys(this.allFields).forEach(function (param) {
        if (hasOwn.call(obj, param)) {
          addParam(built, param, obj[param], true);
        } else {
          addParam(built, param, null, false);
        }
      });

      // Make sure that the "type" field was filled automatically.
      if (built.type !== this.typeName) {
        throw new Error("");
      }

      return built;
    };

    Object.defineProperty(builders, getBuilderName(this.typeName), {
      enumerable: true,
      value: builder,
    });

    return this;
  }

  // The reason fields are specified using .field(...) instead of an object
  // literal syntax is somewhat subtle: the object literal syntax would
  // support only one key and one value, but with .field(...) we can pass
  // any number of arguments to specify the field.
  field(name: string, type: any, defaultFn?: Function, hidden?: boolean): this {
    if (this.finalized) {
      console.error(
        "Ignoring attempt to redefine field " +
          JSON.stringify(name) +
          " of finalized type " +
          JSON.stringify(this.typeName)
      );
      return this;
    }
    this.ownFields[name] = new Field(name, Type.from(type), defaultFn, hidden);
    return this; // For chaining.
  }

  finalize(): void {
    // It's not an error to finalize a type more than once, but only the
    // first call to .finalize does anything.
    if (!this.finalized) {
      const allFields = this.allFields;
      const allSupertypes = this.allSupertypes;

      this.baseNames.forEach((name) => {
        const def = defCache[name];
        if (def instanceof Def) {
          def.finalize();
          extend(allFields, def.allFields);
          extend(allSupertypes, def.allSupertypes);
        } else {
          const message =
            "unknown supertype name " +
            JSON.stringify(name) +
            " for subtype " +
            JSON.stringify(this.typeName);
          throw new Error(message);
        }
      });

      this.aliasNames.forEach((name) => {
        const def = defCache[name];
        if (def instanceof Def) {
          def.finalize();
          extend(allSupertypes, def.allSupertypes);
        } else {
          const message =
            "unknown supertype name " +
            JSON.stringify(name) +
            " for subtype " +
            JSON.stringify(this.typeName);
          throw new Error(message);
        }
      });

      // Every buildable type will have its "type" field filled in
      // automatically with a string if it extends a Type with a "type" field
      if (
        hasOwn.call(allFields, "type") &&
        !hasOwn.call(this.ownFields, "type") &&
        this.buildable
      ) {
        this.field("type", String, () => this.typeName);
      }

      // TODO Warn if fields are overridden with incompatible types.
      extend(allFields, this.ownFields);
      allSupertypes[this.typeName] = this;

      this.fieldNames.length = 0;
      for (const fieldName in allFields) {
        if (hasOwn.call(allFields, fieldName) && !allFields[fieldName].hidden) {
          this.fieldNames.push(fieldName);
        }
      }

      // Types are exported only once they have been finalized.
      Object.defineProperty(namedTypes, this.typeName, {
        enumerable: true,
        value: this.type,
      });

      const assertFnName = `assert${this.typeName
        .slice(0, 1)
        .toUpperCase()}${this.typeName.slice(1)}`;

      Object.defineProperty(namedTypes, assertFnName, {
        enumerable: true,
        value: (v: unknown) => this.type.assert(v),
      });

      this.finalized = true;

      // A linearization of the inheritance hierarchy.
      populateSupertypeList(this.typeName, this.supertypeList);
    }
  }
}

// Note that the list returned by this function is a copy of the internal
// supertypeList, *without* the typeName itself as the first element.
export function getSupertypeNames(typeName: string): string[] {
  if (!hasOwn.call(defCache, typeName)) {
    throw new Error("");
  }
  const d = defCache[typeName];
  if (d.finalized !== true) {
    throw new Error("");
  }
  return d.supertypeList.slice(1);
}

// Returns an object mapping from every known type in the defCache to the
// most specific supertype whose name is an own property of the candidates
// object.
export function computeSupertypeLookupTable(candidates: any) {
  const table: { [typeName: string]: any } = {};
  const typeNames = Object.keys(defCache);
  const typeNameCount = typeNames.length;

  for (let i = 0; i < typeNameCount; ++i) {
    const typeName = typeNames[i];
    const d = defCache[typeName];
    if (d.finalized !== true) {
      throw new Error("" + typeName);
    }
    for (let j = 0; j < d.supertypeList.length; ++j) {
      const superTypeName = d.supertypeList[j];
      if (hasOwn.call(candidates, superTypeName)) {
        table[typeName] = superTypeName;
        break;
      }
    }
  }

  return table;
}

export const builders: import("../gen/builders").builders = Object.create(null);

// This object is used as prototype for any node created by a builder.
const nodePrototype: { [definedMethod: string]: Function } = {};

// Call this function to define a new method to be shared by all AST
// nodes. The replaced method (if any) is returned for easy wrapping.
export function defineMethod(
  name: string,
  func?: Function
): Function | undefined {
  const old = nodePrototype[name];

  // Pass undefined as func to delete nodePrototype[name].
  if (isUndefined.check(func)) {
    delete nodePrototype[name];
  } else {
    assertIsFunction(func);

    Object.defineProperty(nodePrototype, name, {
      enumerable: true, // For discoverability.
      configurable: true, // For delete proto[name].
      value: func,
    });
  }

  return old;
}

export function getBuilderName(typeName: string): string {
  return typeName.replace(/^[A-Z]+/, function (upperCasePrefix: any) {
    const len = upperCasePrefix.length;
    switch (len) {
      case 0:
        return "";
      // If there's only one initial capital letter, just lower-case it.
      case 1:
        return upperCasePrefix.toLowerCase();
      default:
        // If there's more than one initial capital letter, lower-case
        // all but the last one, so that XMLDefaultDeclaration (for
        // example) becomes xmlDefaultDeclaration.
        return (
          upperCasePrefix.slice(0, len - 1).toLowerCase() +
          upperCasePrefix.charAt(len - 1)
        );
    }
  });
}

// Like Object.keys, but aware of what fields each AST type should have.
export function getFieldNames(object: any): string[] {
  const d = defFromValue(object);
  if (d) {
    return d.fieldNames.slice(0);
  }

  if ("type" in object) {
    throw new Error(
      "did not recognize object of type " + JSON.stringify(object.type)
    );
  }

  return Object.keys(object);
}

// Get the value of an object property, taking object.type and default
// functions into account.
export function getFieldValue(object: any, fieldName: string): any {
  const d = defFromValue(object);
  if (d) {
    const field = d.allFields[fieldName];
    if (field) {
      return field.getValue(object);
    }
  }

  return object && object[fieldName];
}

// Iterate over all defined fields of an object, including those missing
// or undefined, passing each field name and effective value (as returned
// by getFieldValue) to the callback. If the object has no corresponding
// Def, the callback will never be called.
export function eachField(
  object: any,
  callback: (name: string, value: any) => any,
  context?: any
): void {
  getFieldNames(object).forEach(function (this: any, name: string) {
    callback.call(this, name, getFieldValue(object, name));
  }, context);
}

// Similar to eachField, except that iteration stops as soon as the
// callback returns a truthy value. Like Array.prototype.some, the final
// result is either true or false to indicates whether the callback
// returned true for any element or not.
export function someField(
  object: any,
  callback: (name: string, value: any) => any,
  context?: any
): boolean {
  return getFieldNames(object).some(function (this: any, name: string) {
    return callback.call(this, name, getFieldValue(object, name));
  }, context);
}

function populateSupertypeList(typeName: any, list: any) {
  list.length = 0;
  list.push(typeName);

  const lastSeen = Object.create(null);

  for (let pos = 0; pos < list.length; ++pos) {
    typeName = list[pos];
    const d = defCache[typeName];
    if (d.finalized !== true) {
      throw new Error("");
    }

    // If we saw typeName earlier in the breadth-first traversal,
    // delete the last-seen occurrence.
    if (hasOwn.call(lastSeen, typeName)) {
      delete list[lastSeen[typeName]];
    }

    // Record the new index of the last-seen occurrence of typeName.
    lastSeen[typeName] = pos;

    // Enqueue the base names of this type.
    list.push(...d.baseNames);
    list.push(...d.aliasNames);
  }

  // Compaction loop to remove array holes.
  let to: number;
  let from: number;
  let len: number;
  for (to = 0, from = to, len = list.length; from < len; ++from) {
    if (hasOwn.call(list, from)) {
      list[to++] = list[from];
    }
  }

  list.length = to;
}

interface ObjKeys {
  [key: string]: any;
}

function extend<T extends ObjKeys, U extends ObjKeys>(into: T, from: U): T & U {
  const ret = into as any;
  Object.keys(from).forEach(function (name) {
    ret[name] = from[name];
  });

  return ret as T & U;
}

export function finalize(): void {
  Object.keys(defCache).forEach(function (name) {
    defCache[name].finalize();
  });
}

export {
  namedTypes,
  OrType,
  ArrayType,
  IdentityType,
  ObjectType,
  PredicateType,
};
