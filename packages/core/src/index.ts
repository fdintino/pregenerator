import * as acorn from "acorn";
import * as astring from "astring";
import type { Node as EstreeNode } from "estree";
import { State as AStringState } from "astring";
import { Options as AStringOptionsOrig } from "astring";
import cloneDeep from "lodash.clonedeep";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import { visit, namedTypes as n } from "@pregenerator/ast-types";
import transform from "@pregenerator/transform";
import type { Writable } from "stream";
import attachComments from "./attach-comments";
import "@pregenerator/helpers";

interface SimpleNode {
  type: string;
}

interface AcornOptions {
  ecmaVersion:
    | 3
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 2015
    | 2016
    | 2017
    | 2018
    | 2019
    | 2020
    | 2021
    | "latest";
  sourceType?: "script" | "module";
  onInsertedSemicolon?: (
    lastTokEnd: number,
    lastTokEndLoc?: acorn.Position
  ) => void;
  onTrailingComma?: (
    lastTokEnd: number,
    lastTokEndLoc?: acorn.Position
  ) => void;
  allowReserved?: boolean | "never";
  allowReturnOutsideFunction?: boolean;
  allowImportExportEverywhere?: boolean;
  allowAwaitOutsideFunction?: boolean;
  allowHashBang?: boolean;
  locations?: boolean;
  onToken?: ((token: acorn.Token) => any) | acorn.Token[];
  onComment?:
    | ((
        isBlock: boolean,
        text: string,
        start: number,
        end: number,
        startLoc?: acorn.Position,
        endLoc?: acorn.Position
      ) => void)
    | acorn.Comment[];
  ranges?: boolean;
  program?: acorn.Node;
  sourceFile?: string;
  directSourceFile?: string;
  preserveParens?: boolean;
}

type State = AStringState & {
  writeAndMap(code: string, node: SimpleNode): void;
};

type EstreeType<T extends string> = EstreeNode & { type: T };

type AStringGenerator = {
  [T in EstreeNode["type"]]: (
    node: EstreeNode & { type: T },
    state: State
  ) => void;
};

type AStringOptions<T = null> = Omit<AStringOptionsOrig<T>, "generator"> & {
  generator?: AStringGenerator;
};

type File = n.File & {
  range?: [number, number];
  start: number;
  end: number;
};

declare module "astring" {
  const baseGenerator: AStringGenerator;

  function generate(node: SimpleNode, options?: AStringOptions<null>): string;
  function generate(
    node: SimpleNode,
    options?: AStringOptions<Writable>
  ): Writable;
}

export function parse(src: string, _opts?: Partial<AcornOptions>): n.File {
  const comments: acorn.Comment[] = [];
  const tokens: acorn.Token[] = [];
  const opts: AcornOptions = Object.assign({}, _opts || {}, {
    onComment: comments,
    onToken: tokens,
    locations: true,
    ranges: true,
    ecmaVersion: "latest",
  }) as AcornOptions;

  const program = acorn.parse(src, opts) as n.Program & {
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
    visitNode(path: NodePath<n.ASTNode>) {
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
      if (node.type === "Literal") {
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

  return ast as unknown as n.File;
}

function trim(s: string): string {
  return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}

function reindent(
  state: State,
  text: string,
  indent: string,
  lineEnd: string
): void {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines: string[] = text.split("\n");
  const end = lines.length - 1;
  state.write(trim(lines[0]));
  if (end > 0) {
    state.write(lineEnd);
    for (let i = 1; i < end; i++) {
      state.write(indent + trim(lines[i]) + lineEnd);
    }
    state.write(indent + trim(lines[end]));
  }
}

function formatComments(
  state: State,
  comments: acorn.Comment[],
  indent: string,
  lineEnd: string
): void {
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
      state.write("// " + trim(comment.value) + "\n");
    } else {
      // Block comment
      state.write("/*");
      reindent(state, comment.value, indent, lineEnd);
      state.write("*/" + lineEnd);
    }
  }
}

export function generate(ast: n.ASTNode, opts: AStringOptions = {}): string {
  ast = cloneDeep(ast);
  // Change node.leadingComments to node.comments
  visit(ast, {
    visitNode(path: NodePath<n.ASTNode>) {
      const node = path.node as n.ASTNode & {
        leadingComments?: acorn.Comment[];
        comments?: acorn.Comment[];
      };
      node.comments = node.leadingComments;
      delete node.leadingComments;
      this.traverse(path);
    },
  });

  const baseGenerator = astring.baseGenerator;

  const customGenerator: AStringGenerator = Object.assign({}, baseGenerator, {
    StringLiteral(node: EstreeType<"Literal">, state: State): void {
      baseGenerator.Literal.call(this, node, state);
    },
    NullLiteral(node: EstreeType<"Literal">, state: State): void {
      baseGenerator.Literal.call(this, node, state);
    },
    BooleanLiteral(node: EstreeType<"Literal">, state: State): void {
      baseGenerator.Literal.call(this, node, state);
    },
    NumericLiteral(node: EstreeType<"Literal">, state: State): void {
      baseGenerator.Literal.call(this, node, state);
    },
    ObjectProperty(node: EstreeType<"Property">, state: State): void {
      const indent = state.indent.repeat(state.indentLevel++);
      const { lineEnd } = state;

      if (node.computed) {
        state.write("[");
        // state.writeAndMap("[", node);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[node.key.type](node.key, state);
        state.write("]");
        // state.writeAndMap("]", node);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[node.key.type](node.key, state);
      }
      state.write(": ");
      // state.writeAndMap(": ", node);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[node.value.type](node.value, state);

      const trailingComments = (node.trailingComments || []) as acorn.Comment[];

      formatComments(state, trailingComments, indent, lineEnd);
      state.indentLevel--;
    },
    ObjectMethod(node: n.ObjectMethod, state: State): void {
      const _node = node as unknown as EstreeType<"MethodDefinition">;
      _node.value = {
        generator: !!node.generator,
        async: !!node.async,
        body: node.body as EstreeType<"FunctionExpression">["body"],
        params: node.params as EstreeType<"FunctionExpression">["params"],
        type: "FunctionExpression",
      };
      astring.baseGenerator.MethodDefinition.call(this, _node, state);
    },
    RegExpLiteral(node: n.RegExpLiteral, state: State): void {
      state.write(`/${node.pattern}/${node.flags}`);
      // state.writeAndMap(`/${node.pattern}/${node.flags}`, node);
    },
    CallExpression(node: EstreeType<"CallExpression">, state: State): void {
      const _node = node as Record<string, any>;
      if (_node.comments) {
        for (let i = 0; i < _node.comments.length; i++) {
          const comment = _node.comments[i];
          if (comment.type === "CommentBlock") {
            state.write("/* " + comment.value + " */ ");
          }
        }
      }
      astring.baseGenerator.CallExpression.call(this, node, state);
    },
    UnaryExpression(node: EstreeType<"UnaryExpression">, state: State): void {
      if (
        node.operator === "void" &&
        n.Literal.check(node.argument) &&
        node.argument.value === 0
      ) {
        state.write("undefined");
        // state.writeAndMap("undefined", node);
      } else {
        astring.baseGenerator.UnaryExpression.call(this, node, state);
      }
    },
  });
  return astring.generate(n.File.check(ast) ? ast.program : ast, {
    generator: customGenerator,
    comments: true,
    ...opts,
  });
}

type CompileOpts = acorn.Options & {
  plugins?: string[];
};

export function compile(src: string, opts?: CompileOpts): string {
  const { plugins, ...acornOpts } = opts || {};
  const ast = parse(src, acornOpts);
  const ret = transform(ast, { plugins }) as n.ASTNode;
  return generate(ret);
}
