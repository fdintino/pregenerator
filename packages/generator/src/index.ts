import * as acorn from "acorn";
import * as astring from "astring";
import type { Node as EstreeNode } from "estree";
import { State as AStringState } from "astring";
import { Options as AStringOptionsOrig } from "astring";
import cloneDeep from "lodash.clonedeep";
import type { NodePath } from "@pregenerator/ast-types";
import { visit, namedTypes as n } from "@pregenerator/ast-types";
import type { Writable } from "stream";

interface SimpleNode {
  type: string;
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

declare module "astring" {
  function generate(node: SimpleNode, options?: AStringOptions<null>): string;
  function generate(
    node: SimpleNode,
    options?: AStringOptions<Writable>
  ): Writable;
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

export default function generate(
  ast: n.Node,
  opts: AStringOptions = {}
): string {
  ast = cloneDeep(ast);
  // Change node.leadingComments to node.comments
  visit(ast, {
    visitNode(path: NodePath<n.Node>) {
      const node = path.node as n.Node & {
        leadingComments?: acorn.Comment[];
        comments?: acorn.Comment[];
      };
      if (node.leadingComments && !node?.comments?.length) {
        (node as any).comments = node.leadingComments;
        delete (node as any).leadingComments;
      }
      this.traverse(path);
    },
  });

  const baseGenerator = (astring as any).baseGenerator as AStringGenerator;

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
      baseGenerator.MethodDefinition.call(this, _node, state);
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
      baseGenerator.CallExpression.call(this, node, state);
    },
    UnaryExpression(node: EstreeType<"UnaryExpression">, state: State): void {
      if (
        node.operator === "void" &&
        n.Literal.check(node.argument) &&
        (node.argument as any).value === 0
      ) {
        state.write("undefined");
        // state.writeAndMap("undefined", node);
      } else {
        baseGenerator.UnaryExpression.call(this, node, state);
      }
    },
  });
  return astring.generate(n.File.check(ast) ? ast.program : ast, {
    generator: customGenerator,
    comments: true,
    ...opts,
  });
}
