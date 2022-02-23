import { namedTypes as n } from "@pregenerator/ast-types";

const mMap: WeakMap<n.Node, any> = new WeakMap();

export type NodeData = Record<string | symbol, any>;

export function getData<T>(node: n.Node, key: string | symbol): T | undefined {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  const data = mMap.get(node) as NodeData;
  if (key in data) {
    return data[key] as T;
  }
}

export function setData<T>(node: n.Node, key: string | symbol, value: T): void {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  const data = mMap.get(node) as NodeData;
  data[key] = value;
}
