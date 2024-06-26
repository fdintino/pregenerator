import * as acorn from "acorn";
import generate from "@pregenerator/generator";
import parse from "@pregenerator/parser";
import transform from "@pregenerator/transform";
import { namedTypes as n, builders } from "@pregenerator/ast-types";
import * as pregeneratorHelpers from "@pregenerator/helpers";

type CompileOpts = acorn.Options & {
  plugins?: string[];
};

export { generate, parse, transform, builders, n as types };

export function compile(src: string, opts?: CompileOpts): string {
  const { plugins, ...acornOpts } = opts || {};
  const ast = parse(src, acornOpts);
  const ret = transform(ast, { plugins }) as n.Node;
  return generate(ret);
}

(typeof window !== "undefined" ? window : global).pregeneratorHelpers =
  pregeneratorHelpers;
