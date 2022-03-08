import { getFieldNames } from "./types";
import * as n from "../gen/namedTypes";

const has = Function.call.bind(Object.prototype.hasOwnProperty);

// This function will never be called for comments, only for real nodes.
function cloneIfNode(obj: unknown, deep?: boolean, withoutLoc?: boolean) {
  if (n.Node.check(obj)) {
    return cloneNode(obj, deep, withoutLoc);
  }

  return obj;
}

function cloneIfNodeOrArray(
  obj: unknown,
  deep?: boolean,
  withoutLoc?: boolean
) {
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
export default function cloneNode<T extends n.Node | undefined | null>(
  node: T,
  deep = true,
  withoutLoc = false
): T {
  if (!node) return node;

  const newNode: any = { type: node.type };

  // Special-case identifiers since they are the most cloned nodes.
  if (n.Identifier.check(node)) {
    newNode.name = node.name;

    if (has(node, "optional") && typeof node.optional === "boolean") {
      newNode.optional = node.optional;
    }

    if (has(node, "typeAnnotation")) {
      newNode.typeAnnotation = deep
        ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc)
        : node.typeAnnotation;
    }
  } else {
    for (const field of getFieldNames(node)) {
      if (field === "comments") continue;
      if (has(node, field)) {
        if (deep) {
          newNode[field] = cloneIfNodeOrArray(
            (node as any)[field],
            true,
            withoutLoc
          );
        } else {
          newNode[field] = (node as any)[field];
        }
      }
    }
  }

  const oldNode = node as any;

  if (has(oldNode, "loc")) {
    if (withoutLoc) {
      newNode.loc = null;
    } else {
      newNode.loc = oldNode.loc;
    }
  }
  if (has(oldNode, "leadingComments")) {
    newNode.leadingComments = maybeCloneComments(
      oldNode.leadingComments,
      deep,
      withoutLoc
    );
  }
  if (has(oldNode, "comments")) {
    newNode.comments = maybeCloneComments(oldNode.comments, deep, withoutLoc);
  }
  if (has(oldNode, "innerComments")) {
    newNode.innerComments = maybeCloneComments(
      oldNode.innerComments,
      deep,
      withoutLoc
    );
  }
  if (has(oldNode, "trailingComments")) {
    newNode.trailingComments = maybeCloneComments(
      oldNode.trailingComments,
      deep,
      withoutLoc
    );
  }
  if (has(oldNode, "extra")) {
    newNode.extra = {
      ...oldNode.extra,
    };
  }

  return newNode;
}

function maybeCloneComments<T extends n.Comment>(
  comments: ReadonlyArray<T> | null | undefined,
  deep: boolean,
  withoutLoc: boolean
): ReadonlyArray<T> | null {
  if (!comments || !deep) {
    return comments || null;
  }
  return comments.map(({ type, value, loc, ...rest }) => {
    if (withoutLoc) {
      return { type, value, loc: null, ...rest } as T;
    }
    return { type, value, loc, ...rest } as T;
  });
}
