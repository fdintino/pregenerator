import { builtInTypes, getFieldValue, builders as b, Type } from "./types";
import { namedTypes as n } from "../gen/namedTypes";
import { Scope } from "./scope";
import type { ScopeType } from "./scope";
import { getFieldNames } from "./types";
import "../def";

const Op = Object.prototype;
const hasOwn = Op.hasOwnProperty;

const isArray = builtInTypes.array;
const isNumber = builtInTypes.number;
const isString = builtInTypes.string;

const assertIsArray: typeof isArray["assert"] = isArray.assert.bind(isArray);
const assertIsNumber: typeof isNumber["assert"] =
  isNumber.assert.bind(isNumber);

const assertIsString: typeof isString["assert"] =
  isString.assert.bind(isString);

export type PathName = string | number;
export type ChildCache = Record<PathName, NodePath>;

export type MapCallback<N extends n.Node, T, U, V> = U extends (infer L)[]
  ? L extends n.Node
    ? (this: T, childPath: NodePath<L, L, number>) => V
    : (this: T, childPath: NodePath<N, L, number>) => V
  : never;
export type EachCallback<N extends n.Node, T, U> = MapCallback<N, T, U, void>;

export interface NodePathConstructor {
  new <N extends n.Node = n.Node, V = any>(
    value: V,
    parentPath?: any,
    name?: PathName
  ): NodePath<N, V>;
}

type NodePathValueType<T> = T extends n.Node
  ? NodePath<T, T>
  : NodePath<n.Node, T>;

type NodePathGetRetTKNumber<V, N extends n.Node> = V extends n.Node
  ? NodePath<V, V, number>
  : NodePath<N, V, number>;
type NodePathGetRetTK<
  V,
  N extends n.Node,
  K extends PropertyKey
> = K extends keyof N
  ? V extends n.Node
    ? NodePath<V, V, K>
    : NodePath<N, V, K>
  : never;
type NodePathGetRet<T extends n.Node, K extends PropertyKey> = K extends keyof T
  ? NodePathGetRetTK<T[K], T, K>
  : never;
type NodePathListGetRetTK<
  V extends any[],
  N extends n.Node
> = V extends (infer L)[] ? NodePathGetRetTKNumber<L, N> : never;

type NodePathRet<V, N extends n.Node, K extends PropertyKey> = V extends n.Node
  ? K extends keyof V
    ? NodePathGetRetTK<V[K], V, K>
    : NodePath
  : V extends (infer L)[]
  ? K extends number
    ? L extends n.Node
      ? NodePath<L, L, number>
      : NodePath<N, L, number>
    : NodePath
  : NodePath;
export class NodePath<
  N extends n.Node = n.Node,
  V = any,
  K extends PropertyKey = PropertyKey
> {
  __childCache: null | ChildCache;
  parentPath: NodePath | null;
  value: V;
  name: K | null;

  scope: Scope | null;
  parent: NodePath | null;
  node: N;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(value: V, parentPath?: any, name?: K | null) {
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
    this.name = name !== null && name !== undefined ? name : null;

    // Calling path.get("child") multiple times always returns the same
    // child Path object, for both performance and consistency reasons.
    this.__childCache = null;
  }

  check<T extends n.Node>(nodeType: Type<T>): this is NodePath<T> {
    return nodeType.check(this.node);
  }
  checkValue<T extends n.Node>(nodeType: Type<T>): this is NodePath<T, T> {
    return nodeType.check(this.value);
  }

  _getChildCache(): ChildCache {
    return (
      this.__childCache ||
      (this.__childCache = Object.create(null) as ChildCache)
    );
  }
  _getChildPath<T extends n.Node, K extends keyof T>(
    this: NodePath<n.Node, T>,
    name: K
  ): NodePathGetRet<T, K> & { parent: NodePath<N, V>; parentPath: NodePath<N> };
  _getChildPath<T extends any[]>(
    this: NodePath<n.Node, T>,
    name: number
  ): NodePathListGetRetTK<T, N> & {
    parent: NodePath<N, V>;
    parentPath: NodePath<N>;
  };

  _getChildPath(
    name: PathName
  ): NodePath & { parent: NodePath<N, V>; parentPath: NodePath<N> };

  _getChildPath(
    name: PathName
  ): NodePath & { parent: NodePath<N, V>; parentPath: NodePath<N> } {
    const cache = this._getChildCache();
    const actualChildValue = this.getValueProperty(name);
    let childPath = cache[name];
    if (
      !hasOwn.call(cache, name) ||
      // Ensure consistency between cache and reality.
      childPath.value !== actualChildValue
    ) {
      childPath = cache[name] = new NodePath(actualChildValue, this, name);
    }
    return childPath as NodePath & {
      parent: NodePath<N, V>;
      parentPath: NodePath<N>;
    };
  }

  get<K extends PropertyKey>(
    name: K
  ): NodePathRet<V, N, K> & {
    parent: NodePath<N, V>;
    parentPath: NodePath<N, N>;
  };
  get<K extends PropertyKey>(
    name: K
  ): NodePathRet<V, N, K> & {
    parent: NodePath<N, V>;
    parentPath: NodePath<N, N>;
  } {
    return (this as any)._getChildPath(name as any) as unknown as NodePathRet<
      V,
      N,
      K
    > & {
      parent: NodePath<N, V>;
      parentPath: NodePath<N, N>;
    };
  }

  getMany(...names: PropertyKey[]): NodePath & {
    parent: NodePath;
    parentPath: NodePath;
  } {
    let path: NodePath = this as unknown as NodePath;

    for (let i = 0; i < names.length; ++i) {
      path = path._getChildPath(names[i]);
    }

    return path as unknown as NodePath & {
      parent: NodePath;
      parentPath: NodePath;
    };
  }

  each<T = this>(callback: EachCallback<N, T, V>, context?: T): void;
  each(callback: EachCallback<N, this, V>): void;
  each<T = this>(callback: EachCallback<N, T, V>, context?: T): void {
    const childPaths: NodePath[] = [];
    assertIsArray(this.value);
    const len = this.value.length;
    let i;

    // Collect all the original child paths before invoking the callback.
    for (i = 0; i < len; ++i) {
      if (hasOwn.call(this.value, i)) {
        childPaths[i] = (this as any).get(i);
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

  map<R, T = this>(callback: MapCallback<N, T, V, R>, context?: T): R[] {
    const result: R[] = [];
    function mapCallback(this: T, childPath: NodePath) {
      result.push(callback.call(this, childPath));
    }
    this.each<T>(mapCallback as any, (context || this) as T);

    return result;
  }

  filter<T = this>(
    callback: MapCallback<N, T, V, boolean>,
    context?: T
  ): NodePath[] {
    const result: NodePath[] = [];
    function filterCallback(this: T, childPath: any) {
      if (callback.call(this, childPath)) {
        result.push(childPath);
      }
    }
    this.each<T>(filterCallback as any, (context || this) as T);

    return result;
  }

  *iterChildren(): Generator<NodePath> {
    const value = this.value;
    const childPaths: NodePath[] = [];
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        childPaths.push((this as any).get(i));
      }
    } else if (value && typeof value === "object") {
      for (const childName of getFieldNames(value)) {
        if (!hasOwn.call(value, childName)) {
          (value as any)[childName] = getFieldValue(value, childName);
        }
        childPaths.push((this as any).get(childName));
        // yield this.get(childName);
      }
    }
    for (const childPath of childPaths) {
      yield childPath;
    }
  }

  *iterFind<U>(type: Type<U>): Generator<NodePathValueType<U>> {
    for (const child of this.iterChildren()) {
      if (type.check(child.value)) {
        yield child as unknown as NodePathValueType<U>;
      } else {
        for (const match of child.iterFind(type)) {
          yield match;
        }
      }
    }
  }

  findAll<U>(type: Type<U>): NodePathValueType<U>[] {
    const matches: NodePathValueType<U>[] = [];
    for (const match of this.iterFind(type)) {
      matches.push(match);
    }
    return matches;
  }

  find<U>(type: Type<U>): NodePathValueType<U> | undefined {
    for (const match of this.iterFind(type)) {
      return match;
    }
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

    const moves: Record<number, NodePath> = Object.create(null);
    const cache = this._getChildCache();

    for (let i = start; i < end; ++i) {
      if (hasOwn.call(value, i)) {
        const childPath = (this as any).get(i);
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

  insertAt(index: number, ...args: any[]): NodePath[] {
    const argc = args.length + 1;
    const move = this._getMoves(argc - 1, index);
    if (move === this._emptyMoves && argc <= 1) {
      return [];
    }

    index = Math.max(index, 0);

    const value = this.value;
    assertIsArray(value);

    for (let i = 0; i < args.length; ++i) {
      value[index + i] = args[i];
    }

    move();

    const newPaths = [];

    for (let i = 0; i < args.length; ++i) {
      newPaths.push(this.get(index + i));
    }
    return newPaths as NodePath[];
  }

  insertBefore(...args: any[]): NodePath[] {
    const { name, parentPath: pp } = this;
    assertIsNumber(name);
    if (!pp) {
      throw new Error("Cannot use insertBefore in top-level node");
    } else {
      return pp.insertAt(name, ...args);
    }
  }

  insertAfter(...args: any[]): NodePath[] {
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
    if (!pp || name === undefined || name === null) {
      // Orphan paths have no relationship to repair.
      return this;
    }

    const parentValue = pp.value;
    const parentCache = pp._getChildCache() as any;

    // Make sure parentCache[path.name] is populated.
    if ((parentValue as any)[name] === this.value) {
      parentCache[name] = this;
    } else if (isArray.check(parentValue)) {
      // Something caused this.name to become out of date, so attempt to
      // recover by searching for this.value in parentValue.
      const i = parentValue.indexOf(this.value);
      if (i >= 0) {
        this.name = name = i as unknown as K;
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
    if ((pp.get(name) as any) !== (this as any)) {
      throw new Error("");
    }

    return this;
  }

  _computeNode(): N {
    const value = this.value;
    if (n.Node.check(value)) {
      return value as unknown as N;
    }
    const pp = this.parentPath;
    if (pp === null) {
      throw new Error("");
    }
    return pp.node as N;
  }

  _computeParent(): NodePath | null {
    const value = this.value;
    let pp = this.parentPath;

    if (!n.Node.check(value)) {
      while (pp && !n.Node.check(pp.value)) {
        pp = pp.parentPath;
      }

      if (pp) {
        pp = pp.parentPath;
      }
    }

    while (pp && !n.Node.check(pp.value)) {
      pp = pp.parentPath;
    }

    return pp || null;
  }

  replace(...args: any[]): NodePath[] {
    delete (this as any).node;
    delete (this as any).parent;
    delete (this as any).scope;

    const results: NodePath[] = [];
    const pp = this.parentPath;
    if (pp === null || this.name === null) {
      throw new Error("Cannot replace on orphaned Paths");
    }
    const parentValue = pp.value;
    const parentCache = pp._getChildCache();

    this._repairRelationshipWithParent();

    const { name } = this;

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
        throw new Error("Node being replaced is misindexed with parent");
      }
      if (parentValue.length !== originalLength - 1 + args.length) {
        throw new Error("Replaced list of nodes has incorrect length");
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

  prune(): NodePath {
    const remainingNodePath = this.parent;

    if (remainingNodePath === null) {
      throw new Error("Cannot prune an orphaned NodePath");
    }

    this.replace();

    return cleanUpNodesAfterPrune(remainingNodePath);
  }

  // The closest enclosing scope that governs this node.
  _computeScope(): Scope | null {
    const value = this.value;
    const pp = this.parentPath;
    let scope: Scope | null = pp ? pp.scope : null;

    if (n.Node.check(value) && Scope.isEstablishedBy(value)) {
      scope = new Scope(this as NodePath<ScopeType>, scope);
    }
    return scope || null;
  }

  getValueProperty(name: PathName): any {
    if (n.Node.check(this.value)) {
      assertIsString(name);
      return getFieldValue(this.value, name);
    } else {
      if (hasOwn.call(this.value, name)) {
        return (this.value as any)[name];
      }
    }
  }
}

/**
 * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
 */
function cleanUpNodesAfterPrune(remainingNodePath: any) {
  if (n.VariableDeclaration.check(remainingNodePath.node)) {
    const declarations = remainingNodePath.get("declarations").value;
    if (!declarations || declarations.length === 0) {
      return remainingNodePath.prune();
    }
  } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
    if (!remainingNodePath.get("expression").value) {
      return remainingNodePath.prune();
    }
  } else if (n.IfStatement.check(remainingNodePath.node)) {
    cleanUpIfStatementAfterPrune(remainingNodePath);
  }

  return remainingNodePath;
}

function cleanUpIfStatementAfterPrune(ifStatement: any) {
  const testExpression = ifStatement.get("test").value;
  const alternate = ifStatement.get("alternate").value;
  const consequent = ifStatement.get("consequent").value;

  if (!consequent && !alternate) {
    const testExpressionStatement = b.expressionStatement(testExpression);

    ifStatement.replace(testExpressionStatement);
  } else if (!consequent && alternate) {
    let negatedTestExpression: n.Expression = b.unaryExpression(
      "!",
      testExpression,
      true
    );

    if (
      n.UnaryExpression.check(testExpression) &&
      testExpression.operator === "!"
    ) {
      negatedTestExpression = testExpression.argument;
    }

    ifStatement.get("test").replace(negatedTestExpression);
    ifStatement.get("consequent").replace(alternate);
    ifStatement.get("alternate").replace();
  }
}

Object.defineProperties(NodePath.prototype, {
  node: {
    get: function () {
      Object.defineProperty(this, "node", {
        configurable: true, // Enable deletion.
        value: this._computeNode(),
      });

      return this.node;
    },
  },

  parent: {
    get: function () {
      Object.defineProperty(this, "parent", {
        configurable: true, // Enable deletion.
        value: this._computeParent(),
      });

      return this.parent;
    },
  },

  scope: {
    get: function () {
      Object.defineProperty(this, "scope", {
        configurable: true, // Enable deletion.
        value: this._computeScope(),
      });

      return this.scope;
    },
  },
});
