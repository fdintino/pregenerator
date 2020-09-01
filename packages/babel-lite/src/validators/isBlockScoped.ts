import type {
  Node,
  FunctionDeclaration,
  ClassDeclaration,
  VariableDeclaration,
} from "../types";
import { isClassDeclaration, isFunctionDeclaration } from "./generated";
import isLet from "./isLet";

/**
 * Check if the input `node` is block scoped.
 */
export default function isBlockScoped(
  node: Node
): node is FunctionDeclaration | ClassDeclaration | VariableDeclaration {
  return isFunctionDeclaration(node) || isClassDeclaration(node) || isLet(node);
}
