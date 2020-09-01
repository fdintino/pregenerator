import is from "../validators/is";
import { validateField, validateChild } from "../validators/validate";
import type {
  BaseNode,
  Node,
  Validator,
  FieldOptions,
  Aliases,
  OptionalCallExpression,
  OptionalMemberExpression,
} from "../types";

type VisitorKeys = Record<Node["type"], string[]>;

export const VISITOR_KEYS: VisitorKeys = {} as VisitorKeys;

type AliasKeys = Record<Node["type"], Array<keyof Aliases>>;

export const ALIAS_KEYS: AliasKeys = {} as AliasKeys;

type FlippedAliasKeys = Record<keyof Aliases, Array<Node["type"]>>;

export const FLIPPED_ALIAS_KEYS: FlippedAliasKeys = {} as FlippedAliasKeys;

type NodeFields = Record<
  Node["type"],
  Record<string, FieldOptions>
>;

export const NODE_FIELDS: NodeFields = {} as NodeFields;

type BuilderKeys = Record<Node["type"], string[]>;
export const BUILDER_KEYS: BuilderKeys = {} as BuilderKeys;
export const DEPRECATED_KEYS: Record<string, string> = {};
export const NODE_PARENT_VALIDATIONS: Record<string, Validator> = {};

function getType(val) {
  if (Array.isArray(val)) {
    return "array";
  } else if (val === null) {
    return "null";
  } else {
    return typeof val;
  }
}

export function validate<T extends Node = Node>(validate: Validator<T>): FieldOptions<T> {
  return { validate };
}

export function typeIs<T extends Node = Node>(typeName: string | string[]): Validator<T> {
  return typeof typeName === "string"
    ? assertNodeType<T>(typeName)
    : assertNodeType<T>(...typeName);
}

export function validateType<T extends Node = Node>(typeName: string | string[]): FieldOptions<T> {
  return validate<T>(typeIs<T>(typeName));
}

export function validateOptional<T extends Node = Node>(validate: Validator<T>): FieldOptions<T> {
  return { validate, optional: true };
}

export function validateOptionalType<T extends Node = Node>(
  typeName: string | string[]
): FieldOptions<T> {
  return { validate: typeIs<T>(typeName), optional: true };
}

export function arrayOf<T extends Node = Node>(elementType: Validator<T>): Validator<T> {
  return chain<T>(assertValueType<T>("array"), assertEach<T>(elementType));
}

export function arrayOfType<T extends Node = Node>(
  typeName: string | string[]
): Validator<T> {
  return arrayOf<T>(typeIs<T>(typeName));
}

export function validateArrayOfType<T extends Node = Node>(
  typeName: string | string[]
): FieldOptions<T> {
  return validate<T>(arrayOfType<T>(typeName));
}

export function assertEach<T extends Node = Node>(callback: Validator<T>): Validator<T> {
  function validator(node: T, key: string, val: any) {
    if (!Array.isArray(val)) return;

    for (let i = 0; i < val.length; i++) {
      const subkey = `${key}[${i}]`;
      const v = val[i];
      callback<T>(node, subkey, v);
      if (process.env.BABEL_TYPES_8_BREAKING) validateChild<T>(node, subkey, v);
    }
  }
  validator.each = callback;
  return validator;
}

export function assertOneOf<T extends Node = Node>(...values: Array<string | boolean>): Validator<T> {
  function validate(node: T, key: string, val: any) {
    if (values.indexOf(val) < 0) {
      throw new TypeError(
        `Property ${key} expected value to be one of ${JSON.stringify(
          values
        )} but got ${JSON.stringify(val)}`
      );
    }
  }

  validate.oneOf = values;

  return validate;
}

export function assertNodeType<T extends Node = Node>(...types: string[]): Validator<T> {
  function validate(node: T, key, val) {
    for (const type of types) {
      if (is(type, val)) {
        validateChild<T>(node, key, val);
        return;
      }
    }

    throw new TypeError(
      `Property ${key} of ${
        node.type
      } expected node to be of a type ${JSON.stringify(
        types
      )} but instead got ${JSON.stringify(val?.type)}`
    );
  }

  validate.oneOfNodeTypes = types;

  return validate;
}

export function assertNodeOrValueType<T extends Node = Node>(...types: Array<string>): Validator<T> {
  function validate(node: T, key, val) {
    for (const type of types) {
      if (getType(val) === type || is(type, val)) {
        validateChild<T>(node, key, val);
        return;
      }
    }

    throw new TypeError(
      `Property ${key} of ${
        node.type
      } expected node to be of a type ${JSON.stringify(
        types
      )} but instead got ${JSON.stringify(val?.type)}`
    );
  }

  validate.oneOfNodeOrValueTypes = types;

  return validate;
}

export function assertValueType<T extends Node = Node>(type: string): Validator<T> {
  function validate(node: T, key, val) {
    const valid = getType(val) === type;

    if (!valid) {
      throw new TypeError(
        `Property ${key} expected type of ${type} but got ${getType(val)}`
      );
    }
  }

  validate.type = type;

  return validate;
}

export function assertShape<T extends Node = Node>(shape: Record<string, FieldOptions>): Validator<T> {
  function validate(node: T, key: string, val: any) {
    const errors = [];
    for (const property of Object.keys(shape)) {
      try {
        validateField<T>(node, property, val[property], shape[property]);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.push(error.message);
          continue;
        }
        throw error;
      }
    }
    if (errors.length) {
      throw new TypeError(
        `Property ${key} of ${
          node.type
        } expected to have the following:\n${errors.join("\n")}`
      );
    }
  }

  validate.shapeOf = shape;

  return validate;
}

export function assertOptionalChainStart<T extends Node = Node>(): Validator<T> {
  function validate(node: T) {
    let current = node;
    while (node) {
      const { type } = current;
      if (type === "OptionalCallExpression") {
        if ((current as OptionalCallExpression).optional) return;
        current = (current as OptionalCallExpression).callee;
        continue;
      }

      if (type === "OptionalMemberExpression") {
        if ((current as OptionalMemberExpression).optional) return;
        current = (current as OptionalMemberExpression).object;
        continue;
      }

      break;
    }

    throw new TypeError(
      `Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${current?.type}`
    );
  }

  return validate;
}

export function chain<T extends Node = Node>(...fns: Array<Validator<T>>): Validator<T> {
  function validate(node: T, key: string, value: any): void {
    for (const fn of fns) {
      fn<T>(node, key, value);
    }
  }
  validate.chainOf = fns;
  return validate;
}

const validTypeOpts = [
  "aliases",
  "builder",
  "deprecatedAlias",
  "fields",
  "inherits",
  "visitor",
  "validate",
];
const validFieldKeys = ["default", "optional", "validate"];

type NodeKeys<T> = Exclude<Extract<keyof T, string>, keyof BaseNode>;

export default function defineType<
  T extends Node["type"],
  P extends Extract<Node, { type: T }>
>(
  type: T,
  opts: {
    fields?: Partial<Record<NodeKeys<P>, FieldOptions<P>>>;
    visitor?: Array<NodeKeys<P>>;
    aliases?: Array<keyof Aliases>;
    builder?: Array<NodeKeys<P>>;
    inherits?: Node["type"];
    deprecatedAlias?: string;
    validate?: Validator<P>;
  } = {}
): void {
  const inherits = (opts.inherits && store[opts.inherits]) || {};

  let fields = opts.fields;
  if (!fields) {
    fields = {};
    if (inherits.fields) {
      const keys = Object.getOwnPropertyNames(inherits.fields);
      for (const key of keys) {
        const field = inherits.fields[key];
        fields[key] = {
          default: field.default,
          optional: field.optional,
          validate: field.validate,
        };
      }
    }
  }

  const visitor: string[] = opts.visitor || inherits.visitor || [];
  const aliases: Array<keyof Aliases> =
    opts.aliases || inherits.aliases || [];
  const builder: string[] =
    opts.builder || inherits.builder || opts.visitor || [];

  for (const k of Object.keys(opts)) {
    if (validTypeOpts.indexOf(k) === -1) {
      throw new Error(`Unknown type option "${k}" on ${type}`);
    }
  }

  if (opts.deprecatedAlias) {
    DEPRECATED_KEYS[opts.deprecatedAlias] = type;
  }

  // ensure all field keys are represented in `fields`
  for (const key of visitor.concat(builder)) {
    fields[key] = fields[key] || {};
  }

  for (const key of Object.keys(fields)) {
    const field = fields[key];

    if (field.default !== undefined && builder.indexOf(key) === -1) {
      field.optional = true;
    }
    if (field.default === undefined) {
      field.default = null;
    } else if (!field.validate && field.default != null) {
      field.validate = assertValueType<P>(getType(field.default));
    }

    for (const k of Object.keys(field)) {
      if (validFieldKeys.indexOf(k) === -1) {
        throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
      }
    }
  }

  opts.visitor = visitor;

  VISITOR_KEYS[type] = visitor;

  opts.builder = builder;
  BUILDER_KEYS[type] = builder;

  opts.fields = fields;
  NODE_FIELDS[type] = fields;

  opts.aliases = aliases;
  ALIAS_KEYS[type] = aliases;

  aliases.forEach((alias) => {
    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
    FLIPPED_ALIAS_KEYS[alias].push(type);
  });

  if (opts.validate) {
    NODE_PARENT_VALIDATIONS[type] = opts.validate;
  }

  store[type] = opts;
}

const store: Partial<Record<Node["type"], Partial<{
  fields?: Record<string, FieldOptions>;
  visitor?: any[];
  aliases?: Array<keyof Aliases>;
  builder?: string[];
  inherits?: Node["type"];
  deprecatedAlias?: string;
  validate?: Validator;
}>>> = {};
