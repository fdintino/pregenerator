import { builtInTypes } from "./types";

const Op = Object.prototype;
const hasOwn = Op.hasOwnProperty;
const isArray = builtInTypes.array;
const isNumber = builtInTypes.number;

const assertIsArray: typeof isArray["assert"] = isArray.assert.bind(isArray);
const assertIsNumber: typeof isNumber["assert"] =
  isNumber.assert.bind(isNumber);

type PathName = string | number;
type ChildCache<T> = Record<PathName, T>;

export interface PathConstructor<T extends Path = Path> {
  new <V = any>(value: V, parentPath?: any, name?: PathName): T;
}

type MapCallback<T, U, V> = (this: T, childPath: U, index: number) => V;
type EachCallback<T, U> = MapCallback<T, U, void>;

export class Path<V = any> {
  __childCache: null | ChildCache<this>;
  parentPath: this | null;
  value: V;
  name: PathName | null;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(value: V, parentPath?: any, name?: PathName | null) {
    if (!(this instanceof Path)) {
      throw new Error("Path constructor cannot be invoked without 'new'");
    }

    if (parentPath) {
      if (!(parentPath instanceof this.constructor)) {
        throw new Error("");
      }
    } else {
      parentPath = null;
      name = null;
    }

    // The value encapsulated by this Path, generally equal to
    // parentPath.value[name] if we have a parentPath.
    this.value = value;

    // The immediate parent Path of this Path.
    this.parentPath = parentPath;

    // The name of the property of parentPath.value through which this
    // Path's value was reached.
    this.name = name || null;

    // Calling path.get("child") multiple times always returns the same
    // child Path object, for both performance and consistency reasons.
    this.__childCache = null;
  }

  _getChildCache(): ChildCache<this> {
    return (
      this.__childCache ||
      (this.__childCache = Object.create(null) as ChildCache<this>)
    );
  }

  _getChildPath(name: PathName): this {
    const cache = this._getChildCache();
    const actualChildValue = this.getValueProperty(name);
    let childPath = cache[name];
    if (
      !hasOwn.call(cache, name) ||
      // Ensure consistency between cache and reality.
      childPath.value !== actualChildValue
    ) {
      const constructor = this.constructor as PathConstructor<this>;
      childPath = cache[name] = new constructor(actualChildValue, this, name);
    }
    return childPath;
  }

  // This method is designed to be overridden by subclasses that need to
  // handle missing properties, etc.
  getValueProperty(name: PathName): any {
    if (hasOwn.call(this.value, name)) {
      return (this.value as any)[name];
    }
  }

  get(...names: PathName[]): this {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let path: this = this;

    for (let i = 0; i < names.length; ++i) {
      path = path._getChildPath(names[i]);
    }

    return path;
  }

  each<T>(callback: EachCallback<T, this>, context: T): void;
  each(callback: EachCallback<this, this>): void;

  each<T = this>(callback: EachCallback<T, this>, context?: T): void {
    const childPaths = [];
    assertIsArray(this.value);
    const len = this.value.length;
    let i;

    // Collect all the original child paths before invoking the callback.
    for (i = 0; i < len; ++i) {
      if (hasOwn.call(this.value, i)) {
        childPaths[i] = this.get(i);
      }
    }

    // Invoke the callback on just the original child paths, regardless of
    // any modifications made to the array by the callback. I chose these
    // semantics over cleverly invoking the callback on new elements because
    // this way is much easier to reason about.
    for (i = 0; i < len; ++i) {
      if (hasOwn.call(childPaths, i)) {
        callback.call((context || this) as T, childPaths[i], i);
      }
    }
  }

  map<V, T = this>(callback: MapCallback<T, this, V>, context?: T): V[] {
    const result: V[] = [];

    this.each(function mapCallback(this: T, childPath: any, index: number) {
      result.push(callback.call(this, childPath, index));
    }, (context || this) as T);

    return result;
  }

  filter<T = this>(
    callback: MapCallback<T, this, boolean>,
    context?: T
  ): this[] {
    const result: this[] = [];

    this.each(function filterCallback(this: T, childPath: any, index: number) {
      if (callback.call(this, childPath, index)) {
        result.push(childPath);
      }
    }, (context || this) as T);

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _emptyMoves(): void {}

  _getMoves(offset: number, start?: number, end?: number): () => void {
    const value = this.value;
    assertIsArray(value);

    if (offset === 0) {
      return this._emptyMoves;
    }

    const length = value.length;
    if (length < 1) {
      return this._emptyMoves;
    }

    if (typeof start === "undefined") {
      start = 0;
      end = length;
    } else if (typeof end === "undefined") {
      start = Math.max(start, 0);
      end = length;
    } else {
      start = Math.max(start, 0);
      end = Math.min(end, length);
    }

    assertIsNumber(start);
    assertIsNumber(end);

    const moves: Record<number, this> = Object.create(null);
    const cache = this._getChildCache();

    for (let i = start; i < end; ++i) {
      if (hasOwn.call(value, i)) {
        const childPath = this.get(i);
        if (childPath.name !== i) {
          throw new Error("");
        }
        const newIndex = i + offset;
        childPath.name = newIndex;
        moves[newIndex] = childPath;
        delete cache[i];
      }
    }

    delete cache.length;

    return () => {
      for (const newIndex in moves) {
        const childPath = moves[newIndex];
        if (childPath.name !== +newIndex) {
          throw new Error("");
        }
        cache[newIndex] = childPath;
        value[newIndex] = childPath.value;
      }
    };
  }

  shift(): any {
    const move = this._getMoves(-1);
    const value = this.value;
    assertIsArray(value);
    const result = value.shift();
    move();
    return result;
  }

  unshift(...args: any[]): number {
    const move = this._getMoves(args.length);
    const value = this.value;
    assertIsArray(value);
    const result = value.unshift(...args);
    move();
    return result;
  }

  push(...args: any[]): number {
    const value = this.value;
    assertIsArray(value);
    const childCache = this._getChildCache();
    delete childCache.length;
    return value.push(...args);
  }

  pop(): any {
    const value = this.value;
    assertIsArray(value);
    const cache = this._getChildCache();
    delete cache[value.length - 1];
    delete cache.length;
    return value.pop();
  }

  insertAt(index: number, ...args: any[]): this {
    const argc = args.length + 1;
    const move = this._getMoves(argc - 1, index);
    if (move === this._emptyMoves && argc <= 1) {
      return this;
    }

    index = Math.max(index, 0);

    const value = this.value;
    assertIsArray(value);

    for (let i = 0; i < args.length; ++i) {
      value[index + i] = args[i];
    }

    move();

    return this;
  }

  insertBefore(...args: any[]): this {
    const { name, parentPath: pp } = this;
    assertIsNumber(name);
    if (!pp) {
      throw new Error("Cannot use insertBefore in top-level node");
    } else {
      return pp.insertAt(name, ...args);
    }
  }

  insertAfter(...args: any[]): this {
    const { name, parentPath: pp } = this;
    assertIsNumber(name);
    if (!pp) {
      throw new Error("Cannot use insertBefore in top-level node");
    } else {
      return pp.insertAt(name + 1, ...args);
    }
  }

  _repairRelationshipWithParent(): this {
    const pp = this.parentPath;
    let { name } = this;
    if (!pp || !name) {
      // Orphan paths have no relationship to repair.
      return this;
    }

    const parentValue = pp.value;
    const parentCache = pp._getChildCache();

    // Make sure parentCache[path.name] is populated.
    if ((parentValue as any)[name] === this.value) {
      parentCache[name] = this;
    } else if (isArray.check(parentValue)) {
      // Something caused this.name to become out of date, so attempt to
      // recover by searching for this.value in parentValue.
      const i = parentValue.indexOf(this.value);
      if (i >= 0) {
        this.name = name = i;
        parentCache[name] = this;
      }
    } else {
      // If this.value disagrees with parentValue[this.name], and
      // this.name is not an array index, let this.value become the new
      // parentValue[this.name] and update parentCache accordingly.
      (parentValue as any)[name] = this.value;
      parentCache[name] = this;
    }

    if ((parentValue as any)[name] !== this.value) {
      throw new Error("");
    }
    if (pp.get(name) !== this) {
      throw new Error("");
    }

    return this;
  }

  replace(...args: any[]): this[] {
    const results: this[] = [];
    const { name, parentPath: pp } = this;
    if (pp === null || name === null) {
      throw new Error("Cannot replace on orphaned Paths");
    }
    const parentValue = pp.value;
    const parentCache = pp._getChildCache();

    this._repairRelationshipWithParent();

    if (isArray.check(parentValue)) {
      const originalLength = parentValue.length;
      assertIsNumber(name);
      const move = pp._getMoves(args.length - 1, name + 1);

      const spliceArgs: [number, number, ...any[]] = [name, 1];
      for (let i = 0; i < args.length; ++i) {
        spliceArgs.push(args[i]);
      }

      const splicedOut = parentValue.splice(...spliceArgs);

      if (splicedOut[0] !== this.value) {
        throw new Error("");
      }
      if (parentValue.length !== originalLength - 1 + args.length) {
        throw new Error("");
      }

      move();

      if (args.length === 0) {
        this.value = undefined as unknown as V;
        delete parentCache[name];
        this.__childCache = null;
      } else {
        if (parentValue[name] !== args[0]) {
          throw new Error("");
        }

        if (this.value !== args[0]) {
          this.value = args[0];
          this.__childCache = null;
        }

        for (let i = 0; i < args.length; ++i) {
          results.push(pp.get(name + i));
        }

        if (results[0] !== this) {
          throw new Error("");
        }
      }
    } else if (args.length === 1) {
      if (this.value !== args[0]) {
        this.__childCache = null;
      }
      this.value = (parentValue as any)[name] = args[0];
      results.push(this);
    } else if (args.length === 0) {
      delete (parentValue as any)[name];
      this.value = undefined as unknown as V;
      this.__childCache = null;

      // Leave this path cached as parentCache[this.name], even though
      // it no longer has a value defined.
    } else {
      throw new Error("Could not replace path");
    }

    return results;
  }
}
