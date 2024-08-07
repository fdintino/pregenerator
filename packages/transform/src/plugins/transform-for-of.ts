import type { NodePath } from "@pregenerator/ast-types";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  cloneNode,
} from "@pregenerator/ast-types";
import { ensureBlock } from "../utils/conversion";
import { inherits, nodeHasProp } from "../utils/util";

type ForOfLooseStatement = n.ForStatement & {
  init: n.VariableDeclaration & {
    kind: "var";
    declarations: [
      n.VariableDeclarator & {
        id: n.Identifier;
        init: n.Expression;
      },
      n.VariableDeclarator & {
        id: n.Identifier;
        init: n.CallExpression;
      },
      n.VariableDeclarator & {
        id: n.Identifier;
        init: n.Literal;
      },
      n.VariableDeclarator & {
        id: n.Identifier;
        init: n.ConditionalExpression;
      }
    ];
  };
  test: null;
  update: null;
  body: n.BlockStatement;
};

function buildForOfLoose({
  loopObj,
  obj,
  isArr,
  index,
  intermediate,
  id,
}: {
  loopObj: n.Identifier;
  obj: n.Expression;
  isArr: n.Identifier;
  index: n.Identifier;
  id: n.LVal;
  intermediate: n.VariableDeclaration | undefined;
}): ForOfLooseStatement {
  const memb = b.memberExpression;
  const ident = b.identifier;
  const c = cloneNode;

  return b.forStatement(
    b.variableDeclaration("var", [
      b.variableDeclarator(c(loopObj), c(obj)),
      b.variableDeclarator(
        c(isArr),
        b.callExpression(memb(ident("Array"), ident("isArray")), [c(loopObj)])
      ),
      b.variableDeclarator(c(index), b.numericLiteral(0)),
      b.variableDeclarator(
        c(loopObj),
        b.conditionalExpression(
          c(isArr),
          c(loopObj),
          b.callExpression(
            memb(
              c(loopObj),
              b.conditionalExpression(
                b.binaryExpression(
                  "===",
                  b.unaryExpression("typeof", ident("Symbol")),
                  b.stringLiteral("undefined")
                ),
                b.stringLiteral("@@iterator"),
                memb(ident("Symbol"), ident("iterator"))
              ),
              true
            ),
            []
          )
        )
      ),
    ]),
    null,
    null,
    b.blockStatement([
      ...(intermediate ? [c(intermediate)] : []),
      b.ifStatement(
        isArr,
        b.blockStatement([
          b.ifStatement(
            b.binaryExpression(
              ">=",
              c(index),
              memb(c(loopObj), ident("length"))
            ),
            b.breakStatement()
          ),
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              c(id),
              memb(c(loopObj), b.updateExpression("++", c(index), false), true)
            )
          ),
        ]),
        b.blockStatement([
          b.expressionStatement(
            b.assignmentExpression(
              "=",
              c(index),
              b.callExpression(memb(c(loopObj), ident("next")), [])
            )
          ),
          b.ifStatement(memb(c(index), ident("done")), b.breakStatement()),
          b.expressionStatement(
            b.assignmentExpression("=", c(id), memb(c(index), ident("value")))
          ),
        ])
      ),
    ])
  ) as ForOfLooseStatement;
}

function pushComputedPropsLoose(path: NodePath<n.ForOfStatement>): {
  replaceParent: boolean;
  declar: n.VariableDeclaration | undefined;
  node: n.LabeledStatement | n.ForStatement;
  loop: ForOfLooseStatement;
} {
  const { node, scope } = path;
  if (!scope || !path.parent) {
    throw new Error("TK9");
  }
  const parent = path.parent.node;
  const { left } = node;
  let declar: n.VariableDeclaration | undefined;
  let id: n.LVal;
  let intermediate: n.VariableDeclaration | undefined;

  if (n.VariableDeclaration.check(left)) {
    // for (let i of test)
    const tempId = scope.declareTemporary("ref");
    id = tempId;
    declar = b.variableDeclaration(left.kind, [
      b.variableDeclarator(
        (left.declarations[0] as n.VariableDeclarator).id,
        b.identifier(tempId.name)
      ),
    ]);
    intermediate = b.variableDeclaration("var", [
      b.variableDeclarator(b.identifier(tempId.name)),
    ]);
  } else {
    // for (i of test), for ({ i } of test)
    id = left;
  }

  const loop = buildForOfLoose({
    loopObj: scope.declareTemporary("iterator"),
    isArr: scope.declareTemporary("isArray"),
    obj: node.right,
    index: scope.declareTemporary("i"),
    id,
    intermediate,
  });

  let labeled;

  if (n.LabeledStatement.check(parent)) {
    labeled = b.labeledStatement(parent.label, loop);
  }

  return {
    replaceParent: n.LabeledStatement.check(parent),
    node: labeled || loop,
    declar,
    loop,
  };
}

const plugin = {
  name: "transform-for-of",
  visitor: PathVisitor.fromMethodsObject({
    visitForOfStatement(path: NodePath<n.ForOfStatement>) {
      const { node } = path;

      const build = pushComputedPropsLoose(path);
      const declar = build.declar;
      const loop = build.loop;
      const block = loop.body;

      // ensure that it's a block so we can take all its statements
      ensureBlock(path);

      // add the value declaration to the new loop body
      if (declar) {
        block.body.push(declar);
      }

      // push the rest of the original loop body onto our new body
      if (nodeHasProp(node.body, "body") && Array.isArray(node.body.body)) {
        node.body.body.forEach((body: n.Node) => {
          n.assertStatement(body);
          block.body.push(body as n.Statement);
        });
      }

      inherits(loop, node);
      inherits(loop.body, node.body);

      if (build.replaceParent) {
        const parentPath = path.parentPath;
        if (!parentPath) {
          throw new Error("TK5");
        }
        parentPath.replace(build.node);
        this.traverse(parentPath);
      } else {
        path.replace(build.node);
        this.traverse(path);
      }
    },
  }),
};

export default plugin;
