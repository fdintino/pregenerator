import * as acorn from "acorn";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { visit, namedTypes as n } from "@pregenerator/ast-types";
import attachComments from "./attach-comments";

type File = n.File & {
  range?: [number, number];
  start: number;
  end: number;
};

export type ParserOptions = Partial<acorn.Options> & {
  Parser?: typeof acorn.Parser;
};

export default function parse(src: string, _opts?: ParserOptions): n.File {
  const comments: acorn.Comment[] = [];
  const tokens: acorn.Token[] = [];
  const { Parser, ...acornOpts } = _opts || {};
  const opts: acorn.Options = Object.assign({}, acornOpts || {}, {
    onComment: comments,
    onToken: tokens,
    locations: true,
    ranges: true,
    ecmaVersion: "latest",
  });
  const parser = new (Parser || acorn.Parser)(opts, src);
  const program = parser.parse() as n.Program & {
    start: number;
    end: number;
    range: [number, number];
  };

  const ast: File = {
    type: "File",
    program: program,
    start: program.start,
    end: program.end,
    range: program.range,
    loc: program.loc || undefined,
  };

  attachComments(ast, comments, tokens);

  visit(ast, {
    visitNode(path: NodePath<n.Node>) {
      const { node } = path;
      const _node = node as Record<string, any>;
      if (n.Property.check(node)) {
        if (node.kind === "init") {
          _node.type = "ObjectProperty";
          _node.shorthand = false;
          delete _node.kind;
        } else {
          // kind === 'get' or 'set'
          const value = _node.value as n.ObjectMethod;
          delete _node.value;
          Object.assign(_node, {
            type: "ObjectMethod",
            generator: !!value.generator,
            async: !!value.async,
            body: value.body,
            params: value.params,
          });
        }
      }
      if (_node.type === "Literal" && "value" in node) {
        if (node.value === null) {
          _node.type = "NullLiteral";
        } else if (typeof node.value === "boolean") {
          _node.type = "BooleanLiteral";
        } else if (typeof node.value === "string") {
          _node.type = "StringLiteral";
        } else if (typeof node.value === "number") {
          _node.type = "NumericLiteral";
        } else if (
          Object.prototype.toString.call(_node.value) === "[object RegExp]"
        ) {
          _node.type = "RegExpLiteral";
          _node.pattern = _node.regex.pattern;
          _node.flags = _node.regex.flags;
          delete _node.regex;
        }
      }
      this.traverse(path);
    },
  });

  return ast;
}
