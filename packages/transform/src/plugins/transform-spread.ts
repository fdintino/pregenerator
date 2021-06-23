import type { NodePath } from "@pregenerator/ast-types/dist/lib/node-path";
import type { Scope } from "@pregenerator/ast-types/dist/lib/scope";
import type * as K from "@pregenerator/ast-types/dist/gen/kinds";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
} from "@pregenerator/ast-types";
import cloneDeep from "lodash.clonedeep";

function appendToMemberExpression(
  member: n.MemberExpression,
  append: K.IdentifierKind | K.ExpressionKind,
  computed?: boolean
): n.MemberExpression {
  member.object = b.memberExpression(
    member.object,
    member.property,
    member.computed
  );
  member.property = append;
  member.computed = !!computed;
  return member;
}

function gatherNodeParts(node: n.ASTNode | null | undefined, parts: string[]): void {
  if (!node) {
    return;
  }
  switch (node.type) {
    case "Literal":
      parts.push(`${node.value}`);
      break;

    case "MemberExpression":
      gatherNodeParts(node.object, parts);
      gatherNodeParts(node.property, parts);
      break;

    case "Identifier":
      parts.push(node.name);
      break;

    case "CallExpression":
    case "NewExpression":
      gatherNodeParts(node.callee, parts);
      break;

    case "ObjectExpression":
    case "ObjectPattern":
      for (const e of node.properties) {
        gatherNodeParts(e, parts);
      }
      break;

    case "SpreadElement":
    case "RestElement":
      gatherNodeParts(node.argument, parts);
      break;

    case "ObjectProperty":
    case "ObjectMethod":
    case "ClassProperty":
    case "ClassMethod":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
      gatherNodeParts(node.key, parts);
      break;

    case "ThisExpression":
      parts.push("this");
      break;

    case "Super":
      parts.push("super");
      break;

    case "Import":
      parts.push("import");
      break;

    case "DoExpression":
      parts.push("do");
      break;

    case "YieldExpression":
      parts.push("yield");
      gatherNodeParts(node.argument, parts);
      break;

    case "AwaitExpression":
      parts.push("await");
      gatherNodeParts(node.argument, parts);
      break;

    case "AssignmentExpression":
      gatherNodeParts(node.left, parts);
      break;

    case "VariableDeclarator":
      gatherNodeParts(node.id, parts);
      break;

    case "FunctionExpression":
    case "FunctionDeclaration":
    case "ClassExpression":
    case "ClassDeclaration":
      gatherNodeParts(node.id, parts);
      break;

    case "PrivateName":
      gatherNodeParts(node.id, parts);
      break;

    case "ParenthesizedExpression":
      gatherNodeParts(node.expression, parts);
      break;

    case "UnaryExpression":
    case "UpdateExpression":
      gatherNodeParts(node.argument, parts);
      break;
  }
}

function generateUidBasedOnNode(node: n.ASTNode, scope: Scope): n.Identifier {
  const parts: string[] = [];
  gatherNodeParts(node, parts);

  let id = parts.join("$");
  id = id.replace(/^_/, "") || "ref";

  return scope.hoistScope.injectTemporary(scope.hoistScope.declareTemporary(id.slice(0, 20)));
}

function maybeGenerateMemoised(
  node: n.ASTNode,
  scope: Scope
): null | n.Identifier {
  if (isStatic(node, scope)) {
    return null;
  } else {
    return generateUidBasedOnNode(node, scope);
  }
}

function isStatic(node: n.ASTNode, scope: Scope): boolean {
  if (n.ThisExpression.check(node) || n.Super.check(node)) {
    return true;
  }

  if (n.Identifier.check(node)) {
    // let binding = this.getBinding(node.name);
    if (scope.declares(node.name)) {
      // return binding.constant;
      // TODO: determine constancy
      return false;
    } else {
      return !!scope.lookup(node.name);
    }
  }

  return false;
}

function getSpreadLiteral(
  spread: n.SpreadElement
): n.SpreadElement["argument"] | n.CallExpression {
  if (
    !n.Identifier.check(spread.argument) ||
    spread.argument.name !== "arguments"
  ) {
    return spread.argument;
  } else {
    const id = b.identifier;
    const memb = b.memberExpression;
    return b.callExpression(
      memb(memb(memb(id("Array"), id("prototype")), id("slice")), id("call")),
      [spread.argument]
    );
  }
}

function hasSpread(nodes: Array<n.ASTNode | null>): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (n.SpreadElement.check(nodes[i])) {
      return true;
    }
  }
  return false;
}

type SpreadBuildNodes = n.SpreadElement["argument"] | n.CallExpression;

function push(
  _props: n.ArrayExpression["elements"],
  nodes: SpreadBuildNodes[]
): n.ArrayExpression["elements"] {
  if (!_props.length) return _props;
  nodes.push(b.arrayExpression(_props));
  return [];
}

function build(props: n.ArrayExpression["elements"]): SpreadBuildNodes[] {
  const nodes: SpreadBuildNodes[] = [];
  let _props: n.ArrayExpression["elements"] = [];

  for (const prop of props) {
    if (n.SpreadElement.check(prop)) {
      _props = push(_props, nodes);
      nodes.push(getSpreadLiteral(prop));
    } else {
      _props.push(prop);
    }
  }

  push(_props, nodes);

  return nodes;
}

const plugin = {
  name: "transform-spread",

  visitor: PathVisitor.fromMethodsObject({
    visitArrayExpression(path: NodePath<n.ArrayExpression>) {
      const { node } = path;
      const elements = node.elements;
      if (!hasSpread(elements)) {
        this.traverse(path);
        return;
      }

      const nodes = build(elements);
      let first = nodes[0];

      // If there is only one element in the ArrayExpression and
      // the element was transformed (Array.prototype.slice.call or toConsumableArray)
      // we know that the transformed code already takes care of cloning the array.
      // So we can simply return that element.
      if (nodes.length === 1 && first !== (elements[0] as n.SpreadElement).argument) {
        return first;
        // path.replaceWith(first);
        // return;
      }

      // If the first element is a ArrayExpression we can directly call
      // concat on it.
      // `[..].concat(..)`
      // If not then we have to use `[].concat(arr)` and not `arr.concat`
      // because `arr` could be extended/modified (e.g. Immutable) and we do not know exactly
      // what concat would produce.
      if (!n.ArrayExpression.check(first)) {
        first = b.arrayExpression([]);
      } else {
        nodes.shift();
      }

      return b.callExpression(
        b.memberExpression(first, b.identifier("concat")),
        nodes
      );
    },

    visitCallExpression(path: NodePath<n.CallExpression>) {
      const { node, scope } = path;

      const args = node.arguments;
      if (!hasSpread(args)) {
        this.traverse(path);
        return;
      }

      let contextLiteral: K.ExpressionKind = b.unaryExpression("void", b.literal(0), true);

      node.arguments = [];

      let nodes;
      if (args.length === 1 && n.SpreadElement.check(args[0]) && n.Identifier.check(args[0].argument) && args[0].argument.name === "arguments") {
        nodes = [args[0].argument];
      } else {
        nodes = build(args);
      }

      const first = nodes.shift() as K.ExpressionKind;
      if (nodes.length) {
        node.arguments.push(
          b.callExpression(
            b.memberExpression(first, b.identifier("concat")),
            nodes
          )
        );
      } else {
        node.arguments.push(first);
      }

      const callee = node.callee;

      if (n.MemberExpression.check(callee)) {
        const temp = maybeGenerateMemoised(callee.object, scope);
        if (temp) {
          callee.object = b.assignmentExpression("=", temp, callee.object);
          contextLiteral = temp;
        } else {
          contextLiteral = cloneDeep(callee.object);
        }
        appendToMemberExpression(callee, b.identifier("apply"));
      } else {
        node.callee = b.memberExpression(node.callee, b.identifier("apply"));
      }

      node.arguments.unshift(cloneDeep(contextLiteral));

      this.traverse(path);
    },

    visitNewExpression(path: NodePath<n.NewExpression>) {
      const { node } = path;
      const _args = node.arguments;
      if (!hasSpread(_args)) return false;

      const nodes = build(_args);

      const context = b.arrayExpression([b.nullLiteral()]);

      const id = b.identifier;
      const memb = b.memberExpression;

      const args = b.callExpression(memb(context, id("concat")), nodes);

      return b.newExpression(
        b.callExpression(
          memb(
            memb(memb(id("Function"), id("prototype")), id("bind")),
            id("apply")
          ),
          [node.callee, args]
        ),
        []
      );
    },
  }),
};

export default plugin;
