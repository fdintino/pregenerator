import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import type { Scope } from "@pregenerator/ast-types/lib/scope";
import {
  namedTypes as n,
  builders as b,
  PathVisitor,
  visit,
} from "@pregenerator/ast-types";
import cloneDeep from "lodash.clonedeep";
import { getBindingIdentifiers, isReferenced } from "../utils/validation";
import { getData, setData } from "../utils/data";
import {
  generateUidBasedOnNode,
  maybeGenerateMemoised,
  isStatic,
} from "../utils/scope";
import { inherits } from "../utils/util";
import toArray from "../utils/toArray";
import isPure from "../utils/isPure";
import { ensureBlock } from "../utils/conversion";
import addHelper from "../utils/addHelper";
import { replaceWithMultiple } from "../utils/modification";

function buildUndefinedNode(): n.UnaryExpression {
  return b.unaryExpression("void", b.numericLiteral(0), true);
}

function isCompletionRecord(
  _path: NodePath,
  allowInsideFunction?: boolean
): boolean {
  let path: NodePath | null = _path;
  let first = true;

  do {
    const container = path.parent;

    // we're in a function so can't be a completion record
    if (n.Function.check(path.node) && !first) {
      return !!allowInsideFunction;
    }

    first = false;

    // check to see if we're the last item in the container and if we are
    // we're a completion record!
    if (Array.isArray(container) && path.name !== container.length - 1) {
      return false;
    }
  } while ((path = path.parentPath) && !n.Program.check(path.node));

  return true;
}
/**
 * Test if a VariableDeclaration's declarations contains any Patterns.
 */

function variableDeclarationHasPattern(node: n.VariableDeclaration): boolean {
  for (const declar of node.declarations) {
    if (n.VariableDeclarator.check(declar) && n.Pattern.check(declar.id)) {
      return true;
    }
  }
  return false;
}

/**
 * Test if an ArrayPattern's elements contain any RestElements.
 */

function hasRest(pattern: n.ArrayPattern): boolean {
  for (const elem of pattern.elements) {
    if (n.RestElement.check(elem)) {
      return true;
    }
  }
  return false;
}

function hasObjectRest(pattern: n.ObjectPattern): boolean {
  for (const elem of pattern.properties) {
    if (n.RestElement.check(elem)) {
      return true;
    }
  }
  return false;
}

interface UnpackableArrayPatternProps {
  pattern: n.ArrayPattern & {
    elements: Array<
      Exclude<n.ArrayPattern["elements"][number], null | n.MemberExpression>
    >;
  };
  arr: n.ArrayExpression & {
    elements: Array<
      Exclude<
        n.ArrayExpression["elements"][number],
        n.SpreadElement | n.CallExpression | n.MemberExpression
      >
    >;
  };
}

class DestructuringTransformer {
  blockHoist: number | null;
  kind: "var" | "let" | "const";
  nodes: Array<n.VariableDeclaration | n.ExpressionStatement>;
  arrays: Record<string, boolean>;
  operator?: n.AssignmentExpression["operator"];
  scope: Scope;

  constructor(opts: {
    kind: "var" | "let" | "const";
    nodes: Array<n.VariableDeclaration | n.ExpressionStatement>;
    scope: Scope;
    blockHoist?: number | null;
    operator?: n.AssignmentExpression["operator"];
  }) {
    this.blockHoist = opts.blockHoist || null;
    this.operator = opts.operator;
    this.arrays = {};
    this.nodes = opts.nodes;
    this.scope = opts.scope;
    this.kind = opts.kind;
  }

  buildVariableAssignment(
    id: n.PatternLike | n.LVal,
    init: n.Expression | null
  ): n.ExpressionStatement | n.VariableDeclaration {
    let op = this.operator;
    if (n.MemberExpression.check(id)) op = "=";

    let node;

    if (op) {
      node = b.expressionStatement(
        b.assignmentExpression(
          op,
          id,
          init ? cloneDeep(init) : buildUndefinedNode()
        )
      );
    } else {
      n.assertPatternLike(id);
      node = b.variableDeclaration(this.kind, [
        b.variableDeclarator(id, cloneDeep(init)),
      ]);
    }

    if (this.blockHoist !== null) {
      setData(node, "_blockHoist", this.blockHoist);
    }

    return node;
  }

  buildVariableDeclaration(
    id: n.Identifier,
    init: n.Expression | null
  ): n.VariableDeclaration {
    const declar = b.variableDeclaration("var", [
      b.variableDeclarator(cloneDeep(id), cloneDeep(init)),
    ]);
    if (this.blockHoist !== null) {
      setData(declar, "_blockHoist", this.blockHoist);
    }
    return declar;
  }

  push(id: n.LVal | n.PatternLike, _init: n.Expression | null): void {
    const init = cloneDeep(_init);
    if (n.ObjectPattern.check(id)) {
      this.pushObjectPattern(id, init);
    } else if (n.ArrayPattern.check(id)) {
      n.assertExpression(init);
      this.pushArrayPattern(id, init);
    } else if (n.AssignmentPattern.check(id)) {
      this.pushAssignmentPattern(id, init);
    } else {
      this.nodes.push(this.buildVariableAssignment(id, init));
    }
  }

  toArray(
    node: n.Expression,
    count?: number | boolean
  ): n.ArrayExpression | n.CallExpression | n.Identifier {
    if (n.Identifier.check(node) && this.arrays[node.name]) {
      return node;
    } else {
      return toArray(node, count);
    }
  }

  pushAssignmentPattern(
    { left, right }: n.AssignmentPattern,
    valueRef: n.Expression | null
  ): void {
    // we need to assign the current value of the assignment to avoid evaluating
    // it more than once
    const tempId = generateUidBasedOnNode(valueRef, this.scope);
    this.nodes.push(this.buildVariableDeclaration(tempId, valueRef));

    const tempConditional = b.conditionalExpression(
      b.binaryExpression("===", cloneDeep(tempId), buildUndefinedNode()),
      right,
      cloneDeep(tempId)
    );

    if (n.Pattern.check(left)) {
      let patternId: n.Identifier;
      let node;

      if (this.kind === "const") {
        patternId = this.scope.declareTemporary(tempId.name);
        node = this.buildVariableDeclaration(patternId, tempConditional);
      } else {
        patternId = tempId;
        node = b.expressionStatement(
          b.assignmentExpression("=", cloneDeep(tempId), tempConditional)
        );
      }

      this.nodes.push(node);
      this.push(left, patternId);
    } else {
      this.nodes.push(this.buildVariableAssignment(left, tempConditional));
    }
  }

  pushObjectRest(
    pattern: n.ObjectPattern,
    objRef: n.Expression,
    spreadProp: n.RestElement,
    spreadPropIndex: number
  ): void {
    // get all the keys that appear in this object before the current spread

    const keys: n.Expression[] = [];
    let allLiteral = true;

    for (let i = 0; i < pattern.properties.length; i++) {
      const prop = pattern.properties[i];

      // we've exceeded the index of the spread property to all properties to the
      // right need to be ignored
      if (i >= spreadPropIndex) break;

      // TODO: how is this possible? there can't be more than one
      // rest element in a pattern
      /* istanbul ignore if */
      if (n.RestElement.check(prop)) continue; // ignore other spread properties

      const { key } = prop;
      // TODO: first if is unreachable code
      /* istanbul ignore if */
      if (n.TemplateLiteral.check(key)) {
        keys.push(cloneDeep(key));
      } else if (n.Identifier.check(key) && !prop.computed) {
        keys.push(b.stringLiteral(key.name));
      } else if (n.Literal.check(key)) {
        keys.push(b.stringLiteral(String(key.value)));
      } else {
        keys.push(cloneDeep(key));
        allLiteral = false;
      }
    }

    let value: n.CallExpression;
    if (keys.length === 0) {
      value = b.callExpression(addHelper("_extends"), [
        b.objectExpression([]),
        cloneDeep(objRef),
      ]);
    } else {
      let keyExpression: n.Expression = b.arrayExpression(keys);

      if (!allLiteral) {
        keyExpression = b.callExpression(
          b.memberExpression(keyExpression, b.identifier("map")),
          [addHelper("toPropertyKey")]
        );
      }

      value = b.callExpression(addHelper("objectWithoutProperties"), [
        cloneDeep(objRef),
        keyExpression,
      ]);
    }

    this.nodes.push(this.buildVariableAssignment(spreadProp.argument, value));
  }

  pushObjectProperty(
    prop: n.Property | n.ObjectProperty,
    propRef: n.Expression
  ): void {
    if (n.Literal.check(prop.key)) prop.computed = true;

    const pattern = prop.value;
    const objRef = b.memberExpression(
      cloneDeep(propRef),
      prop.key,
      prop.computed
    );

    if (n.Pattern.check(pattern)) {
      this.push(pattern, objRef);
    } else {
      n.assertPatternLike(pattern);
      this.nodes.push(this.buildVariableAssignment(pattern, objRef));
    }
  }

  pushObjectPattern(
    pattern: n.ObjectPattern,
    objRef: n.Expression | null
  ): void {
    // https://github.com/babel/babel/issues/681

    if (!pattern.properties.length) {
      this.nodes.push(
        b.expressionStatement(
          b.callExpression(addHelper("objectDestructuringEmpty"), [
            objRef ? objRef : buildUndefinedNode(),
          ])
        )
      );
    }

    // if we have more than one properties in this pattern and the objectRef is a
    // member expression then we need to assign it to a temporary variable so it's
    // only evaluated once

    if (pattern.properties.length > 1 && !isStatic(objRef, this.scope)) {
      const temp = generateUidBasedOnNode(objRef, this.scope);
      this.nodes.push(this.buildVariableDeclaration(temp, objRef));
      objRef = temp;
    }

    // Replace impure computed key expressions if we have a rest parameter
    if (hasObjectRest(pattern)) {
      let copiedPattern: n.ObjectPattern | undefined;
      for (let i = 0; i < pattern.properties.length; i++) {
        const prop = pattern.properties[i];
        if (n.RestElement.check(prop)) {
          break;
        }
        const key = prop.key;
        if (prop.computed && !isPure(key, this.scope)) {
          const name = generateUidBasedOnNode(key, this.scope);
          this.nodes.push(this.buildVariableDeclaration(name, key));
          if (!copiedPattern) {
            copiedPattern = pattern = {
              ...pattern,
              properties: pattern.properties.slice(),
            };
          }
          copiedPattern.properties[i] = {
            ...(copiedPattern.properties[i] as n.Property),
            key: name,
          } as n.Property;
        }
      }
    }
    //

    for (let i = 0; i < pattern.properties.length; i++) {
      const prop = pattern.properties[i];
      n.assertExpression(objRef);
      if (n.RestElement.check(prop)) {
        this.pushObjectRest(pattern, objRef, prop, i);
      } else {
        this.pushObjectProperty(prop, objRef);
      }
    }
  }

  canUnpackArrayPattern(props: {
    pattern: n.ArrayPattern;
    arr: n.Expression | null;
  }): props is UnpackableArrayPatternProps {
    const { pattern, arr } = props;
    // not an array so there's no way we can deal with this
    if (!n.ArrayExpression.check(arr)) return false;

    // pattern has less elements than the array and doesn't have a rest so some
    // elements wont be evaluated
    if (pattern.elements.length > arr.elements.length) return false;
    if (pattern.elements.length < arr.elements.length && !hasRest(pattern)) {
      return false;
    }

    for (const elem of pattern.elements) {
      // deopt on holes
      if (!elem) return false;

      // deopt on member expressions as they may be included in the RHS
      if (n.MemberExpression.check(elem)) return false;
    }

    for (const elem of arr.elements) {
      // deopt on spread elements
      if (n.SpreadElement.check(elem)) return false;

      // deopt call expressions as they might change values of LHS variables
      if (n.CallExpression.check(elem)) return false;

      // deopt on member expressions as they may be getter/setters and have side-effects
      if (n.MemberExpression.check(elem)) return false;
    }

    // deopt on reference to left side identifiers
    const bindings = getBindingIdentifiers(pattern);
    const ancestors: n.Node[] = [];
    let deopt = false;

    visit(arr, {
      visitNode(path: NodePath<n.Node>) {
        const { node } = path;
        if (!ancestors.length) {
          // Top-level node: this is the array literal.
          ancestors.push(node);
          this.traverse(path);
          ancestors.pop();
          return;
        }

        if (
          n.Identifier.check(node) &&
          isReferenced(node, ancestors[ancestors.length - 1]) &&
          bindings[node.name]
        ) {
          deopt = true;
          this.abort();
        }

        ancestors.push(node);
        this.traverse(path);
        ancestors.pop();
      },
    });

    return !deopt;
  }

  pushUnpackedArrayPattern(props: UnpackableArrayPatternProps): void {
    const { pattern, arr } = props;
    for (let i = 0; i < pattern.elements.length; i++) {
      const elem = pattern.elements[i];
      if (n.RestElement.check(elem)) {
        this.push(elem.argument, b.arrayExpression(arr.elements.slice(i)));
      } else {
        this.push(elem, arr.elements[i]);
      }
    }
  }

  pushArrayPattern(pattern: n.ArrayPattern, arrayRef: n.Expression): void {
    // TODO: this conditional is in babel, but I don't think it can ever be reached
    /* istanbul ignore if */
    if (!pattern.elements) return;

    // optimise basic array destructuring of an array expression
    //
    // we can't do this to a pattern of unequal size to it's right hand
    // array expression as then there will be values that wont be evaluated
    //
    // eg: let [a, b] = [1, 2];

    const unpackArrayProps = { pattern, arr: arrayRef };
    if (this.canUnpackArrayPattern(unpackArrayProps)) {
      return this.pushUnpackedArrayPattern(unpackArrayProps);
    }

    // if we have a rest then we need all the elements so don't tell
    // `scope.toArray` to only get a certain amount

    const count = !hasRest(pattern) && pattern.elements.length;

    // so we need to ensure that the `arrayRef` is an array, `scope.toArray` will
    // return a locally bound identifier if it's been inferred to be an array,
    // otherwise it'll be a call to a helper that will ensure it's one

    const toArrayNode = this.toArray(arrayRef, count);

    if (n.Identifier.check(toArrayNode)) {
      // we've been given an identifier so it must have been inferred to be an
      // array
      arrayRef = toArrayNode;
    } else {
      arrayRef = generateUidBasedOnNode(arrayRef, this.scope);
      this.arrays[arrayRef.name] = true;
      this.nodes.push(this.buildVariableDeclaration(arrayRef, toArrayNode));
    }

    //

    for (let i = 0; i < pattern.elements.length; i++) {
      let elem: n.LVal | n.PatternLike | null = pattern.elements[i];

      // hole
      if (!elem) continue;

      let elemRef: n.Expression;

      if (n.RestElement.check(elem)) {
        elemRef = this.toArray(arrayRef);
        elemRef = b.callExpression(
          b.memberExpression(elemRef, b.identifier("slice")),
          [b.numericLiteral(i)]
        );

        // set the element to the rest element argument since we've dealt with it
        // being a rest already
        elem = elem.argument;
      } else {
        elemRef = b.memberExpression(arrayRef, b.numericLiteral(i), true);
      }

      this.push(elem, elemRef);
    }
  }

  init(
    pattern: n.LVal | n.PatternLike,
    ref: n.Expression
  ): Array<n.VariableDeclaration | n.ExpressionStatement> {
    // trying to destructure a value that we can't evaluate more than once so we
    // need to save it to a variable

    if (!n.ArrayExpression.check(ref) && !n.MemberExpression.check(ref)) {
      const memo = maybeGenerateMemoised(ref, this.scope, true);
      if (memo) {
        this.nodes.push(this.buildVariableDeclaration(memo, cloneDeep(ref)));
        ref = memo;
      }
    }

    this.push(pattern, ref);

    return this.nodes;
  }
}

const plugin = {
  name: "transform-destructuring",

  visitor: PathVisitor.fromMethodsObject({
    visitForX(path) {
      const { scope } = path;
      const { left } = path.node;

      if (!scope) {
        throw new Error("Scope unexpectedly undefined");
      }

      if (n.Pattern.check(left)) {
        // for ({ length: k } in { abc: 3 });

        const temp = scope.declareTemporary("ref");
        path.node.left = b.variableDeclaration("var", [
          b.variableDeclarator(temp),
        ]);

        const { node } = ensureBlock(path);

        if (node.body.body.length === 0 && isCompletionRecord(path)) {
          node.body.body.unshift(b.expressionStatement(buildUndefinedNode()));
        }

        node.body.body.unshift(
          b.expressionStatement(b.assignmentExpression("=", left, temp))
        );

        this.traverse(path);
        return;
      }

      if (!n.VariableDeclaration.check(left)) {
        this.traverse(path);
        return;
      }

      const decl = left;

      n.assertVariableDeclarator(decl.declarations[0]);
      const pattern = decl.declarations[0].id;
      if (!n.Pattern.check(pattern)) {
        this.traverse(path);
        return;
      }

      const key = scope.declareTemporary("ref");
      path.node.left = b.variableDeclaration(decl.kind, [
        b.variableDeclarator(key, null),
      ]);

      const nodes: Array<n.VariableDeclaration | n.ExpressionStatement> = [];

      const destructuring = new DestructuringTransformer({
        kind: decl.kind,
        scope: scope,
        nodes: nodes,
      });

      destructuring.init(pattern, key);

      const { node } = ensureBlock(path);

      const block = node.body;
      block.body = [...nodes, ...block.body];

      this.traverse(path);
    },
    // visitForInStatement(path: NodePath<n.ForInStatement>): void {
    //   visitForXStatement.call(this, path);
    // },
    // visitForOfStatement(path: NodePath<n.ForOfStatement>): void {
    //   visitForXStatement.call(this, path);
    // },
    visitCatchClause(path: NodePath<n.CatchClause>): void {
      const { node, scope } = path;
      const pattern = node.param;
      if (!n.Pattern.check(pattern)) {
        this.traverse(path);
        return;
      }
      if (!scope) {
        throw new Error("Scope unexpectedly undefined");
      }

      const ref = scope.declareTemporary("ref");
      node.param = ref;

      const nodes: Array<n.VariableDeclaration | n.ExpressionStatement> = [];

      const destructuring = new DestructuringTransformer({
        kind: "var",
        scope: scope,
        nodes: nodes,
      });
      destructuring.init(pattern, ref);

      node.body.body = [...nodes, ...node.body.body];

      this.traverse(path);
    },

    visitAssignmentExpression(path: NodePath<n.AssignmentExpression>) {
      const { node, scope } = path;
      if (!n.Pattern.check(node.left)) {
        this.traverse(path);
        return;
      }

      if (!scope) {
        throw new Error("Scope unexpectedly undefined");
      }

      const _nodes: Array<n.VariableDeclaration | n.ExpressionStatement> = [];

      const destructuring = new DestructuringTransformer({
        kind: "var",
        operator: node.operator,
        scope: scope,
        nodes: _nodes,
      });

      const nodes: Array<
        n.VariableDeclaration | n.ExpressionStatement | n.ReturnStatement
      > = _nodes;
      let ref;
      if (
        isCompletionRecord(path) ||
        !n.ExpressionStatement.check(path.parentPath?.node)
      ) {
        ref = generateUidBasedOnNode(node.right, scope, "ref");

        // const { left } = node;
        // // Temporarily set left to our ref identifier so we can push its path
        // // into scope
        // node.left = ref;
        // scope.push(path.get("left"));
        // node.left = left;

        nodes.push(
          b.variableDeclaration("var", [b.variableDeclarator(ref, node.right)])
        );

        if (n.ArrayExpression.check(node.right)) {
          destructuring.arrays[ref.name] = true;
        }
      }

      destructuring.init(node.left, ref || node.right);

      if (ref) {
        if (n.ArrowFunctionExpression.check(path.parentPath?.node)) {
          path.replace(b.blockStatement([]));
          nodes.push(b.returnStatement(cloneDeep(ref)));
        } else {
          nodes.push(b.expressionStatement(cloneDeep(ref)));
        }
      }

      if (
        path.parentPath &&
        n.ExpressionStatement.check(path.parentPath.value)
      ) {
        replaceWithMultiple(path.parentPath, nodes);
        return false;
      } else {
        replaceWithMultiple(path, nodes);
        return false;
      }
    },

    visitVariableDeclaration(path: NodePath<n.VariableDeclaration>) {
      const { node, scope, parent } = path;
      if (
        n.ForInStatement.check(parent?.node) ||
        n.ForOfStatement.check(parent?.node)
      ) {
        this.traverse(path);
        return;
      }
      if (!variableDeclarationHasPattern(node)) {
        this.traverse(path);
        return;
      }
      if (!scope) {
        throw new Error("Scope unexpectedly undefined");
      }
      const nodeKind = node.kind;
      const nodes = [];

      for (let i = 0; i < node.declarations.length; i++) {
        const declar = node.declarations[i];
        n.assertVariableDeclarator(declar);

        const patternId = declar.init;
        const pattern = declar.id;

        const destructuring: DestructuringTransformer =
          new DestructuringTransformer({
            blockHoist: getData<number>(node, "_blockHoist"),
            nodes: nodes,
            scope: scope,
            kind: node.kind,
          });

        if (n.Pattern.check(pattern)) {
          n.assertExpression(patternId);
          destructuring.init(pattern, patternId);

          if (+i !== node.declarations.length - 1) {
            // we aren't the last declarator so let's just make the
            // last transformed node inherit from us
            inherits(nodes[nodes.length - 1], declar);
          }
        } else {
          nodes.push(
            inherits(
              destructuring.buildVariableAssignment(
                declar.id,
                cloneDeep(declar.init || null)
              ),
              declar
            )
          );
        }
      }

      let tail = null;
      const nodesOut = [];
      for (const node of nodes) {
        if (tail !== null && n.VariableDeclaration.check(node)) {
          // Create a single compound declarations
          tail.declarations.push(...node.declarations);
        } else {
          // Make sure the original node kind is used for each compound declaration
          if (n.VariableDeclaration.check(node)) {
            node.kind = nodeKind;
          }
          nodesOut.push(node);
          tail = n.VariableDeclaration.check(node) ? node : null;
        }
      }

      // Need to unmark the current binding to this var as a param, or other hoists
      // could be placed above this ref.
      // https://github.com/babel/babel/issues/4516
      // for (const nodeOut of nodesOut) {
      //   if (!n.VariableDeclaration.check(nodeOut) || !nodeOut.declarations) continue;
      //   for (const declaration of nodeOut.declarations) {
      //     const { name } = declaration.id;
      //     if (scope.bindings[name]) {
      //       scope.bindings[name].kind = nodeOut.kind;
      //     }
      //   }
      // }

      if (nodesOut.length === 1) {
        path.replace(nodesOut[0]);
      } else {
        replaceWithMultiple(path, nodesOut);
      }
      return false;
    },
  }),
};

export default plugin;
