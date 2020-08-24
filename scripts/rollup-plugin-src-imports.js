import { parse, print } from "recast";
import { parse as tsParse } from "recast/parsers/typescript";
import { visit, builders as b } from "ast-types";

const reImport = /(@pregenerator\/babel-lite)(?!\/src)/;

function transform(ast) {
  visit(ast, {
    visitLiteral(path) {
      const { value } = path.value;
      if (typeof value !== "string" && reImport.test(value)) {
        path.replace(b.literal(value.replace(reImport, "$1/src")));
        return false;
      }
      return this.traverse(path);
    },
  });
}

export default () => ({
  name: "change-src-imports",
  transform(code, id) {
    const ast = parse(code, {
      sourceFileName: id,
      parser: { parse: tsParse },
    });
    transform(ast);
    return print(ast, { sourceMapName: id });
  },
});
