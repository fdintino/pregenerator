import * as acorn from "acorn";
import clone from "lodash.clone";
import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import { visit, namedTypes as n } from "@pregenerator/ast-types";

type File = n.File & {
  range?: [number, number];
  start: number;
  end: number;
};

function upperBound<T>(array: T[], func: (v: T) => boolean): number {
  let diff: number;
  let current: number;
  let len = array.length;
  let i = 0;

  while (len) {
    diff = len >>> 1;
    current = i + diff;
    if (func(array[current])) {
      len = diff;
    } else {
      i = current + 1;
      len -= diff + 1;
    }
  }
  return i;
}

type ExtendedComment = acorn.Comment & {
  range: [number, number];
  extendedRange: [number, number];
};
type RangedToken = acorn.Token & { range: [number, number] };

function extendCommentRange(
  _comment: acorn.Comment,
  _tokens: acorn.Token[]
): ExtendedComment {
  let target: number;

  const comment = _comment as ExtendedComment;
  const tokens = _tokens as RangedToken[];

  target = upperBound(
    tokens,
    (token: RangedToken) => token.range[0] > comment.range[0]
  );

  comment.extendedRange = [comment.range[0], comment.range[1]];

  if (target !== tokens.length) {
    comment.extendedRange[1] = tokens[target].range[0];
  }

  target -= 1;
  if (target >= 0) {
    comment.extendedRange[0] = tokens[target].range[1];
  }

  return comment;
}

export default function attachComments(
  tree: File,
  providedComments: acorn.Comment[],
  tokens: acorn.Token[]
): File {
  // At first, we should calculate extended comment ranges.
  const comments: ExtendedComment[] = [];

  if (!tree.range) {
    throw new Error("attachComments needs range information");
  }

  for (let i = 0, len = providedComments.length; i < len; i += 1) {
    comments.push(extendCommentRange(clone(providedComments[i]), tokens));
  }

  // This is based on John Freeman's implementation.
  let cursor = 0;
  visit(tree, {
    visitNode(path: NodePath<n.ASTNode>) {
      const node = path.node as n.ASTNode & {
        leadingComments?: acorn.Comment[];
        range?: [number, number];
      };

      if (!node.range) {
        return false;
      }

      while (cursor < comments.length) {
        const comment = comments[cursor];
        if (comment.extendedRange[1] > node.range[0]) {
          break;
        }

        if (comment.extendedRange[1] === node.range[0]) {
          if (!node.leadingComments) {
            node.leadingComments = [];
          }
          node.leadingComments.push(comment);
          comments.splice(cursor, 1);
        } else {
          cursor += 1;
        }
      }

      // already out of owned node
      if (cursor === comments.length) {
        return false;
      } else if (comments[cursor].extendedRange[0] > node.range[1]) {
        return false;
      } else {
        this.traverse(path);
      }
    },
  });

  cursor = 0;
  visit(tree, {
    visitNode(path: NodePath<n.ASTNode>) {
      this.traverse(path);
      const node = path.node as n.ASTNode & {
        trailingComments?: acorn.Comment[];
        range: [number, number];
      };

      while (cursor < comments.length) {
        const comment = comments[cursor];
        if (node.range[1] < comment.extendedRange[0]) {
          break;
        }

        if (
          node.range[1] === comment.extendedRange[0] ||
          (node.range[0] === comment.extendedRange[0] - 1 &&
            node.range[1] === comment.extendedRange[1] + 1)
        ) {
          if (!node.trailingComments) {
            node.trailingComments = [];
          }
          node.trailingComments.push(comment);
          comments.splice(cursor, 1);
        } else {
          cursor += 1;
        }
      }

      // already out of owned node
      if (cursor === comments.length) {
        this.abort();
      } else if (comments[cursor].extendedRange[0] > node.range[1]) {
        return false;
      } else {
        this.traverse(path);
      }
    },
  });

  return tree;
}
