import * as acorn from "acorn";
import * as astring from "astring";

import { Options as AStringOptions } from "astring";

import { types, traverse } from "@pregenerator/babel-lite";
import transform from "@pregenerator/transform";

import * as pregeneratorHelpers from "@pregenerator/helpers";

import attachComments from "./attach-comments";

global.pregeneratorHelpers = pregeneratorHelpers;

function parse(src: string, opts?: acorn.Options): acorn.Node {
  const comments: acorn.Comment[] = [];
  const tokens: acorn.Token[] = [];
  opts = Object.assign({}, opts || {}, {
    onComment: comments,
    onToken: tokens,
    locations: true,
    ranges: true,
  });

  const program = acorn.parse(src, opts);

  const ast = {
    type: "File",
    program: program,
    start: program.start,
    end: program.end,
    range: program.range,
    loc: program.loc,
  };

  attachComments(ast, comments, tokens);

  traverse(ast, {
    enter(path) {
      const { node } = path;
      if (node.type === "Property") {
        if (node.kind === "init") {
          node.type = "ObjectProperty";
          delete node.kind;
        } else {
          // kind === 'get' or 'set'
          const { value } = node;
          delete node.value;
          Object.assign(node, {
            type: "ObjectMethod",
            generator: !!value.generator,
            async: !!value.async,
            body: value.body,
            params: value.params,
          });
        }
      }
      if (node.type === "Literal") {
        if (node.value === null) {
          node.type = "NullLiteral";
        } else if (typeof node.value === "boolean") {
          node.type = "BooleanLiteral";
        } else if (typeof node.value === "string") {
          node.type = "StringLiteral";
        } else if (typeof node.value === "number") {
          node.type = "NumericLiteral";
        } else if (
          Object.prototype.toString.call(node.value) === "[object RegExp]"
        ) {
          node.type = "RegExpLiteral";
          node.pattern = node.regex.pattern;
          node.flags = node.regex.flags;
          delete node.regex;
        }
      }
    },
  });

  return ast;
}

function reindent(state, text, indent, lineEnd) {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines = text.split("\n");
  const end = lines.length - 1;
  state.write(lines[0].trim());
  if (end > 0) {
    state.write(lineEnd);
    for (let i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd);
    }
    state.write(indent + lines[end].trim());
  }
}

function formatComments(state, comments, indent, lineEnd) {
  /*
  Writes into `state` the provided list of `comments`, with the given `indent`
  and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
  if (!comments) return;
  const { length } = comments;
  for (let i = 0; i < length; i++) {
    const comment = comments[i];
    state.write(indent);
    if (comment.type[0] === "L") {
      // Line comment
      state.write("// " + comment.value.trim() + "\n");
    } else {
      // Block comment
      state.write("/*");
      reindent(state, comment.value, indent, lineEnd);
      state.write("*/" + lineEnd);
    }
  }
}

function generate(ast: acorn.Node, opts: AStringOptions = {}): string {
  ast = types.cloneNode(ast);
  // Change node.leadingComments to node.comments
  traverse(ast, {
    enter(path) {
      const { node } = path;
      node.comments = node.leadingComments;
      delete node.leadingComments;
    },
  });

  const baseGenerator = astring.baseGenerator;

  const customGenerator = Object.assign({}, baseGenerator, {
    StringLiteral(node, state) {
      baseGenerator.Literal.call(this, node, state);
    },
    NullLiteral(node, state) {
      baseGenerator.Literal.call(this, node, state);
    },
    BooleanLiteral(node, state) {
      baseGenerator.Literal.call(this, node, state);
    },
    NumericLiteral(node, state) {
      baseGenerator.Literal.call(this, node, state);
    },
    ObjectProperty(node, state) {
      const indent = state.indent.repeat(state.indentLevel++);
      const { lineEnd } = state;

      if (node.computed) {
        state.write("[", node);
        this[node.key.type](node.key, state);
        state.write("]", node);
      } else {
        this[node.key.type](node.key, state);
      }
      state.write(": ", node);
      this[node.value.type](node.value, state);

      formatComments(state, node.trailingComments || [], indent, lineEnd);
      state.indentLevel--;
    },
    ObjectMethod(node, state) {
      node.value = {
        generator: !!node.generator,
        async: !!node.async,
        body: node.body,
        params: node.params,
        type: "FunctionExpression",
      };
      return astring.baseGenerator.MethodDefinition.call(this, node, state);
    },
    RegExpLiteral(node, state) {
      state.write(`/${node.pattern}/${node.flags}`, node);
    },
    CallExpression(node, state) {
      if (node.leadingComments) {
        for (let i = 0; i < node.leadingComments.length; i++) {
          const comment = node.leadingComments[i];
          if (comment.type === "CommentBlock") {
            state.write("/* " + comment.value + " */ ");
          }
        }
      }
      astring.baseGenerator.CallExpression.call(this, node, state);
    },
    UnaryExpression(node, state) {
      if (node.operator === "void" && node.argument.value === 0) {
        state.write("undefined", node);
      } else {
        astring.baseGenerator.UnaryExpression.call(this, node, state);
      }
    },
  });
  if (types.isFile(ast)) {
    ast = ast.program;
  }
  return astring.generate(ast, {
    generator: customGenerator,
    comments: true,
    ...opts,
  });
}

function compile(src: string, opts: acorn.Options): string {
  const transformOpts = Object.assign({ noClone: true }, opts || {});
  let ast = parse(src, opts);
  ast = transform(ast, transformOpts);
  return generate(ast);
}

export { transform, compile, parse, generate, types };
