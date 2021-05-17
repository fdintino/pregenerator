import type { Node, Comment } from "../types";
import isNode from "../validators/isNode";
import { isIdentifier } from "../validators/generated";

import { NODE_FIELDS } from "../definitions";
import has from "../utils/has";

// const has = Function.call.bind(Object.prototype.hasOwnProperty);
// eslint-disable-next-line @typescript-eslint/ban-types

// This function will never be called for comments, only for real nodes.
function cloneIfNode<T extends unknown>(
  obj: T,
  deep: boolean,
  withoutLoc: boolean
): T {
  if (isNode(obj)) {
    return cloneNode(obj, deep, withoutLoc);
  }

  return obj;
}

function cloneIfNodeOrArray<T extends unknown>(
  obj: T | T[],
  deep: boolean,
  withoutLoc: boolean
): T | T[] {
  if (Array.isArray(obj)) {
    return obj.map((node) => cloneIfNode(node, deep, withoutLoc));
  }
  return cloneIfNode(obj, deep, withoutLoc);
}

/**
 * Create a clone of a `node` including only properties belonging to the node.
 * If the second parameter is `false`, cloneNode performs a shallow clone.
 * If the third parameter is true, the cloned nodes exclude location properties.
 */
export default function cloneNode<T extends Node>(
  node: T,
  deep = true,
  withoutLoc = false
): T {
  if (!node) return node;

  const type: Node["type"] = node.type;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newNode: any = { type };

  // Special-case identifiers since they are the most cloned nodes.
  if (isIdentifier(node)) {
    if (has(node, "name") && typeof node.name === "string") {
      newNode.name = node.name;
    }

    if (has(node, "optional") && typeof node.optional === "boolean") {
      newNode.optional = node.optional;
    }

    // if (has(node, "typeAnnotation")) {
    //   newNode.typeAnnotation = deep
    //     ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc)
    //     : node.typeAnnotation;
    // }
  } else if (!has(NODE_FIELDS, type)) {
    throw new Error(`Unknown node type: "${type}"`);
  } else {
    for (const field of Object.keys(NODE_FIELDS[type])) {
      if (has(node, field)) {
        if (deep) {
          newNode[field] =
            type === "File" && field === "comments"
              ? maybeCloneComments(node.comments as Comment[], deep, withoutLoc)
              : cloneIfNodeOrArray(node[field], true, withoutLoc);
        } else {
          newNode[field] = node[field];
        }
      }
    }
  }

  if (has(node, "loc")) {
    if (withoutLoc) {
      newNode.loc = null;
    } else {
      newNode.loc = node.loc;
    }
  }
  if (has(node, "leadingComments")) {
    newNode.leadingComments = maybeCloneComments(
      node.leadingComments,
      deep,
      withoutLoc
    );
  }
  if (has(node, "innerComments")) {
    newNode.innerComments = maybeCloneComments(
      node.innerComments,
      deep,
      withoutLoc
    );
  }
  if (has(node, "trailingComments")) {
    newNode.trailingComments = maybeCloneComments(
      node.trailingComments,
      deep,
      withoutLoc
    );
  }

  return newNode as T;
}

function cloneCommentsWithoutLoc(comments: Comment[]): Comment[] {
  return comments.map(({ type, value }) => ({ type, value, loc: null }));
}

function maybeCloneComments(
  comments: Comment[],
  deep: boolean,
  withoutLoc: boolean
) {
  return deep && withoutLoc ? cloneCommentsWithoutLoc(comments) : comments;
}
