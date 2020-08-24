import { traverse } from "@pregenerator/babel-lite";
import * as acorn from "acorn";

function shallowCopy(obj) {
  return Object.assign({}, obj);
}

// based on LLVM libc++ upper_bound / lower_bound
// MIT License

function upperBound(array, func) {
  let diff, len, i, current;

  len = array.length;
  i = 0;

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

function extendCommentRange(comment, tokens) {
  let target;

  target = upperBound(tokens, function search(token) {
    return token.range[0] > comment.range[0];
  });

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
  tree: acorn.Node,
  providedComments: acorn.Comment[],
  tokens: acorn.Token[]
): acorn.Node {
  // At first, we should calculate extended comment ranges.
  const comments = [];
  let len, i, cursor;

  if (!tree.range) {
    throw new Error("attachComments needs range information");
  }

  for (i = 0, len = providedComments.length; i < len; i += 1) {
    comments.push(extendCommentRange(shallowCopy(providedComments[i]), tokens));
  }

  // This is based on John Freeman's implementation.
  cursor = 0;
  traverse(tree, {
    enter(path) {
      const { node } = path;
      let comment;

      while (cursor < comments.length) {
        comment = comments[cursor];
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
        return path.stop();
      }

      if (comments[cursor].extendedRange[0] > node.range[1]) {
        return path.skip();
      }
    },
  });

  cursor = 0;
  traverse(tree, {
    exit(path) {
      const { node } = path;
      let comment;

      while (cursor < comments.length) {
        comment = comments[cursor];
        if (node.range[1] < comment.extendedRange[0]) {
          break;
        }

        if (node.range[1] === comment.extendedRange[0]) {
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
        return path.stop();
      }

      if (comments[cursor].extendedRange[0] > node.range[1]) {
        return path.skip();
      }
    },
  });

  return tree;
}
