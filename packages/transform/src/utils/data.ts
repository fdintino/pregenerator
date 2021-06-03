import { ASTNode } from "@pregenerator/ast-types";

const mMap: WeakMap<ASTNode, any> = new WeakMap();

export type NodeData = Record<string, any>;

export function getData<T>(node: ASTNode, key: string): T | undefined {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  const data = mMap.get(node) as NodeData;
  if (key in data) {
    return data[key] as T;
  }
}

export function setData<T>(node: ASTNode, key: string, value: T): void {
  if (!mMap.has(node)) {
    mMap.set(node, {});
  }
  const data = mMap.get(node) as NodeData;
  data[key] = value;
}
