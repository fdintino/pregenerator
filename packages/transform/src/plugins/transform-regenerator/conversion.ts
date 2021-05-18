// This file contains methods that convert the path node into another node or some other type of data.

import nameFunction from "./helper-function-name";
import type { NodePath } from "ast-types/lib/node-path";
import {
  namedTypes as n,
  builders as b,
  ASTNode,
  PathVisitor,
} from "ast-types";
import * as K from "ast-types/gen/kinds";
import { isReferencedIdentifier } from "./validation";
import { getData, setData } from "./data";
import { findParent } from "./util";

type Loop =
  | n.DoWhileStatement
  | n.ForInStatement
  | n.ForStatement
  | n.WhileStatement
  | n.ForOfStatement;

type Method = n.ObjectMethod | n.ClassMethod | n.ClassPrivateMethod;
type Property =
  | n.ObjectProperty
  | n.ClassProperty
  | n.ClassPrivateProperty
  | n.Property;

type SuperProp = n.MemberExpression & { object: n.Super };

export function toComputedKey(
  path: NodePath<n.MemberExpression | Method | Property>
): K.IdentifierKind | K.ExpressionKind | K.LiteralKind {
  let key;
  const node = path.value;
  if (n.MemberExpression.check(node)) {
    key = node.property;
  } else if (
    n.Property.check(node) ||
    n.ObjectProperty.check(node) ||
    n.ClassProperty.check(node) ||
    n.ClassPrivateProperty.check(node) ||
    n.ObjectMethod.check(node) ||
    n.ClassMethod.check(node) ||
    n.ClassPrivateMethod.check(node)
  ) {
    key = node.key;
  } else {
    throw new ReferenceError("todo");
  }

  if (node.type !== "ClassPrivateProperty" || !node.computed) {
    if (n.Identifier.check(key)) key = b.literal(key.name);
  }

  return key;
}

export function ensureBlock<
  T extends
    | Loop
    | n.WithStatement
    | K.FunctionKind
    | n.LabeledStatement
    | n.CatchClause
>(path: NodePath<T>): n.BlockStatement | (T & { body: n.BlockStatement }) {
  const body = path.get("body");
  const bodyNode = body.node;

  if (Array.isArray(body.value)) {
    throw new Error("Can't convert array path to a block statement");
  }
  if (!bodyNode) {
    throw new Error("Can't convert node without a body");
  }

  if (n.BlockStatement.check(bodyNode)) {
    return bodyNode;
  }

  const statements: K.StatementKind[] = [];

  const stringPath: Array<number | string> = ["body"];
  let key;
  let listKey;
  if (n.Statement.check(bodyNode)) {
    listKey = "body";
    key = 0;
    statements.push(bodyNode as K.StatementKind);
  } else {
    stringPath.push("body", 0);
    if (n.Function.check(path.node)) {
      key = "argument";
      statements.push(b.returnStatement(body.node as K.ExpressionKind));
    } else {
      key = "expression";
      statements.push(b.expressionStatement(body.node as K.ExpressionKind));
    }
  }

  path.node.body = b.blockStatement(statements);

  const parentPath = path.get(...stringPath) as NodePath;
  const value = listKey ? parentPath.node[listKey] : parentPath.node;
  // const { scope } = body;

  // const newPath = new ASTNodePath(value, parentPath, listKey || key);
  // newPath.scope = scope;
  body.replace(value);
  body.parentPath = parentPath;
  body.name = listKey || key;
  // body.replace(newPath);

  path.scope.scan(true);

  return path.node as T & { body: n.BlockStatement };
}

type IFunctionEnv = NodePath<
  n.ArrowFunctionExpression | n.FunctionExpression | n.FunctionDeclaration
>;

/**
 * Given an arbitrary function, process its content as if it were an arrow function, moving references
 * to "this", "arguments", "super", and such into the function's parent scope. This method is useful if
 * you have wrapped some set of items in an IIFE or other function, but want "this", "arguments", and super"
 * to continue behaving as expected.
 */
export function unwrapFunctionEnvironment(
  path: NodePath
): asserts path is IFunctionEnv {
  if (
    !n.ArrowFunctionExpression.check(path.node) &&
    !n.FunctionExpression.check(path.node) &&
    !n.FunctionDeclaration.check(path.node)
  ) {
    throw new TypeError("Can only unwrap the environment of a function.");
  }

  hoistFunctionEnvironment(path);
}

/**
 * Convert a given arrow function into a normal ES5 function expression.
 */
export function arrowFunctionToExpression(
  path: NodePath,
  {
    allowInsertArrow = true,
    /** @deprecated Use `noNewArrows` instead */
    specCompliant = false,
    // TODO(Babel 8): Consider defaulting to `false` for spec compliancy
    noNewArrows = !specCompliant,
  }: {
    allowInsertArrow?: boolean;
    specCompliant?: boolean;
    noNewArrows?: boolean;
  } = {}
): void {
  if (!n.ArrowFunctionExpression.check(path.node)) {
    throw new TypeError(
      "Cannot convert non-arrow function to a function expression."
    );
  }

  const thisBinding = hoistFunctionEnvironment(
    path,
    noNewArrows,
    allowInsertArrow
  );

  ensureBlock(path);

  const newNode = (path.node as unknown) as n.FunctionExpression;

  newNode.type = "FunctionExpression";
  if (!noNewArrows) {
    const checkBinding = thisBinding
      ? null
      : (path.parentPath.scope.declareTemporary(
          "arrowCheckId"
        ) as n.Identifier);
    if (checkBinding) {
      path.parentPath.scope.injectTemporary(
        checkBinding,
        b.objectExpression([])
      );
    }

    path
      .get("body", "body")
      .unshift(
        b.ifStatement(
          b.binaryExpression(
            "!==",
            b.thisExpression(),
            checkBinding
              ? b.identifier(checkBinding.name)
              : b.identifier(thisBinding as string)
          ),
          b.blockStatement([
            b.throwStatement(
              b.newExpression(b.identifier("TypeError"), [
                b.literal("Cannot instantiate an arrow function"),
              ])
            ),
          ])
        )
      );

    path.replace(
      b.callExpression(
        b.memberExpression(
          nameFunction(
            { node: newNode, parent: path.parent.node, scope: path.scope },
            true
          ) || newNode,
          b.identifier("bind")
        ),
        [checkBinding ? b.identifier(checkBinding.name) : b.thisExpression()]
      )
    );

    path.scope.scan(true);
  }
}

type IThisEnvFnNode =
  | Exclude<K.FunctionKind, n.ArrowFunctionExpression>
  | n.Program;

type IThisEnvFn = NodePath<
  Exclude<K.FunctionKind, n.ArrowFunctionExpression> | n.Program
>;

function findParentThisEnvFn(
  fnPath: IFunctionEnv
): NodePath<IThisEnvFnNode | (n.ClassProperty & { static: false })> {
  return findParent(fnPath, (p) => {
    const { node } = p;
    return (
      (n.Function.check(node) && !n.ArrowFunctionExpression.check(node)) ||
      n.Program.check(node) ||
      (n.ClassProperty.check(node) && node.static === false)
    );
  }) as NodePath<IThisEnvFnNode | (n.ClassProperty & { static: false })>;
}

/**
 * Given a function, traverse its contents, and if there are references to "this", "arguments", "super",
 * or "new.target", ensure that these references reference the parent environment around this function.
 */
function hoistFunctionEnvironment(
  fnPath: IFunctionEnv,
  // TODO(Babel 8): Consider defaulting to `false` for spec compliancy
  noNewArrows = true,
  allowInsertArrow = true
) {
  const thisEnvFnTmp = findParentThisEnvFn(fnPath);
  const node = thisEnvFnTmp?.node;
  const inConstructor =
    node && node.type === "ClassMethod" && node.kind === "constructor";

  if (n.ClassProperty.check(thisEnvFnTmp)) {
    throw new TypeError("Unable to transform arrow inside class property");
  }

  const thisEnvFn = thisEnvFnTmp as IThisEnvFn;

  const {
    thisPaths,
    argumentsPaths,
    newTargetPaths,
    superProps,
    superCalls,
  } = getScopeInformation(fnPath);

  // Convert all super() calls in the constructor, if super is used in an arrow.
  if (inConstructor && superCalls.length > 0) {
    if (!allowInsertArrow) {
      throw new TypeError("Unable to handle nested super() usage in arrow");
    }
    const allSuperCalls: NodePath<n.CallExpression>[] = [];
    PathVisitor.fromMethodsObject({
      visitFunction(path: NodePath<K.FunctionKind>) {
        if (n.ArrowFunctionExpression.check(path.node)) {
          this.traverse(path);
        }
        return false;
      },
      visitClassProperty() {
        return false;
      },
      visitCallExpression(path: NodePath<n.CallExpression>) {
        if (!n.Super.check(path.node.callee)) {
          this.traverse(path);
          return;
        }
        allSuperCalls.push(path);
      },
    }).visit(thisEnvFn);

    const superBinding = getSuperBinding(thisEnvFn);
    allSuperCalls.forEach((superCall) => {
      const callee = b.identifier(superBinding);
      callee.loc = superCall.node.callee.loc;

      superCall.get("callee").replace(callee);
    });
  }

  // Convert all "arguments" references in the arrow to point at the alias.
  if (argumentsPaths.length > 0) {
    const argumentsBinding = getBinding(thisEnvFn, "arguments", () =>
      b.identifier("arguments")
    );

    argumentsPaths.forEach((argumentsChild) => {
      const argsRef = b.identifier(argumentsBinding);
      argsRef.loc = argumentsChild.node.loc;

      argumentsChild.replace(argsRef);
    });
  }

  // Convert all "new.target" references in the arrow to point at the alias.
  if (newTargetPaths.length > 0) {
    const newTargetBinding = getBinding(thisEnvFn, "newtarget", () =>
      b.metaProperty(b.identifier("new"), b.identifier("target"))
    );

    newTargetPaths.forEach((targetChild) => {
      const targetRef = b.identifier(newTargetBinding);
      targetRef.loc = targetChild.node.loc;

      targetChild.replace(targetRef);
    });
  }

  // Convert all "super.prop" references to point at aliases.
  if (superProps.length > 0) {
    if (!allowInsertArrow) {
      throw new TypeError("Unable to handle nested super.prop usage");
    }

    const flatSuperProps = ([] as NodePath<SuperProp>[]).concat(
      ...superProps.map((p) => standardizeSuperProperty(p))
    );

    flatSuperProps.forEach((superProp) => {
      const key = superProp.node.computed
        ? ""
        : superProp.get("property").node.name;

      const parentNode = superProp.parent.node;
      const isAssignment =
        n.AssignmentExpression.check(parentNode) &&
        parentNode.left === superProp.node;
      const isCall =
        n.CallExpression.check(parentNode) &&
        parentNode.callee === superProp.node;
      const superBinding = getSuperPropBinding(thisEnvFn, isAssignment, key);

      const args = [];
      if (superProp.node.computed) {
        args.push(superProp.get("property").node);
      }

      if (isAssignment) {
        const value = superProp.parentPath.node.right;
        args.push(value);
      }

      const call = b.callExpression(b.identifier(superBinding), args);

      if (isCall) {
        superProp.parent.get("arguments").unshift(b.thisExpression());
        // superProp.parentPath.unshiftContainer("arguments", b.thisExpression());
        superProp.replace(b.memberExpression(call, b.identifier("call")));

        thisPaths.push(superProp.parentPath.get("arguments", 0));
      } else if (isAssignment) {
        // Replace not only the super.prop, but the whole assignment
        superProp.parentPath.replace(call);
      } else {
        superProp.replace(call);
      }
    });
  }

  // Convert all "this" references in the arrow to point at the alias.
  // let thisBinding: string | null = null;
  if (thisPaths.length > 0 || !noNewArrows) {
    const thisBinding = getThisBinding(thisEnvFn, inConstructor);

    if (
      noNewArrows ||
      // In subclass constructors, still need to rewrite because "this" can't be bound in spec mode
      // because it might not have been initialized yet.
      (inConstructor && hasSuperClass(thisEnvFn))
    ) {
      thisPaths.forEach((thisChild) => {
        const thisRef = b.identifier(thisBinding);

        thisRef.loc = thisChild.node.loc;
        thisChild.replace(thisRef);
      });

      if (!noNewArrows) return null;
    }
    return thisBinding;
  }

  return null;
}

function standardizeSuperProperty(
  superProp: NodePath<SuperProp>
): NodePath<SuperProp>[] {
  if (
    n.AssignmentExpression.check(superProp.parentPath.node) &&
    superProp.parentPath.node.operator !== "="
  ) {
    const assignmentPath = superProp.parentPath;

    const op = assignmentPath.node.operator.slice(0, -1);
    const value = assignmentPath.node.right;

    assignmentPath.node.operator = "=";
    if (superProp.node.computed) {
      const tmp = superProp.scope.generateDeclaredUidIdentifier("tmp");

      assignmentPath
        .get("left")
        .replace(
          b.memberExpression(
            superProp.node.object,
            b.assignmentExpression("=", tmp, superProp.node.property),
            true /* computed */
          )
        );

      assignmentPath
        .get("right")
        .replace(
          b.binaryExpression(
            op,
            b.memberExpression(
              superProp.node.object,
              b.identifier(tmp.name),
              true /* computed */
            ),
            value
          )
        );
    } else {
      assignmentPath
        .get("left")
        .replace(
          b.memberExpression(superProp.node.object, superProp.node.property)
        );

      assignmentPath
        .get("right")
        .replace(
          b.binaryExpression(
            op,
            b.memberExpression(
              superProp.node.object,
              b.identifier((superProp.node.property as n.Identifier).name)
            ),
            value
          )
        );
    }
    return [
      assignmentPath.get("left"),
      assignmentPath.get("right").get("left"),
    ];
  } else if (n.UpdateExpression.check(superProp.parentPath.node)) {
    const updateExpr = superProp.parentPath;

    const tmp = superProp.scope.injectTemporary("tmp");
    const computedKey = superProp.node.computed
      ? superProp.scope.injectTemporary("prop")
      : null;

    const parts: K.ExpressionKind[] = [
      b.assignmentExpression(
        "=",
        tmp,
        b.memberExpression(
          superProp.node.object,
          computedKey
            ? b.assignmentExpression("=", computedKey, superProp.node.property)
            : superProp.node.property,
          superProp.node.computed
        )
      ),
      b.assignmentExpression(
        "=",
        b.memberExpression(
          superProp.node.object,
          computedKey
            ? b.identifier(computedKey.name)
            : superProp.node.property,
          superProp.node.computed
        ),
        b.binaryExpression("+", b.identifier(tmp.name), b.literal(1))
      ),
    ];

    if (!superProp.parentPath.node.prefix) {
      parts.push(b.identifier(tmp.name));
    }

    updateExpr.replace(b.sequenceExpression(parts));

    const left = updateExpr.get("expressions", 0, "right");
    const right = updateExpr.get("expressions", 1, "left");
    return [left, right];
  }

  return [superProp];
}

function hasSuperClass(
  thisEnvFn: IThisEnvFn
): thisEnvFn is NodePath<n.ClassMethod> {
  return (
    n.ClassMethod.check(thisEnvFn.node) &&
    !!thisEnvFn.parentPath.parentPath.node.superClass
  );
}

// Create a binding that evaluates to the "this" of the given function.
function getThisBinding(thisEnvFn: IThisEnvFn, inConstructor: boolean): string {
  return getBinding(thisEnvFn, "this", (thisBinding) => {
    if (!inConstructor || !hasSuperClass(thisEnvFn)) return b.thisExpression();

    const supers: WeakSet<n.CallExpression> = new WeakSet();
    PathVisitor.fromMethodsObject({
      visitFunction(path: NodePath<K.FunctionKind>) {
        if (n.ArrowFunctionExpression.check(path)) {
          this.traverse(path);
        }
      },
      ClassProperty() {
        return false;
      },
      CallExpression(path: NodePath<n.CallExpression>) {
        const { node } = path;
        if (!n.Super.check(node.callee)) {
          this.traverse(path);
          return;
        }
        if (supers.has(node)) {
          this.traverse(path);
          return;
        }
        supers.add(node);

        path.replace(
          node,
          b.assignmentExpression(
            "=",
            b.identifier(thisBinding),
            b.identifier("this")
          )
        );
      },
    }).visit(thisEnvFn.node);
  });
}

// Create a binding for a function that will call "super()" with arguments passed through.
function getSuperBinding(thisEnvFn: IThisEnvFn): string {
  return getBinding(thisEnvFn, "supercall", () => {
    const argsBinding = thisEnvFn.scope.declareTemporary(
      "args"
    ) as n.Identifier;
    return b.arrowFunctionExpression(
      [b.restElement(argsBinding)],
      b.callExpression(b.super(), [
        b.spreadElement(b.identifier(argsBinding.name)),
      ])
    );
  });
}

// Create a binding for a function that will call "super.foo" or "super[foo]".
function getSuperPropBinding(
  thisEnvFn: IThisEnvFn,
  isAssignment: boolean,
  propName: string
): string {
  const op = isAssignment ? "set" : "get";

  return getBinding(thisEnvFn, `superprop_${op}:${propName || ""}`, () => {
    const argsList: n.Identifier[] = [];

    let fnBody;
    if (propName) {
      // () => super.foo
      fnBody = b.memberExpression(b.super(), b.identifier(propName));
    } else {
      const method = thisEnvFn.scope.declareTemporary("prop") as n.Identifier;
      // (method) => super[method]
      argsList.unshift(method);
      fnBody = b.memberExpression(
        b.super(),
        b.identifier(method.name),
        true /* computed */
      );
    }

    if (isAssignment) {
      const valueIdent = thisEnvFn.scope.declareTemporary(
        "value"
      ) as n.Identifier;
      argsList.push(valueIdent);

      fnBody = b.assignmentExpression(
        "=",
        fnBody,
        b.identifier(valueIdent.name)
      );
    }

    return b.arrowFunctionExpression(argsList, fnBody);
  });
}

function getBinding(
  thisEnvFn: IThisEnvFn,
  key: string,
  init: (data: string) => undefined | ASTNode
): string {
  const cacheKey = "binding:" + key;
  let data: string | undefined = getData<string>(thisEnvFn.node, cacheKey);
  if (!data) {
    const id = thisEnvFn.scope.declareTemporary(key) as n.Identifier;
    data = id.name;
    setData(thisEnvFn.node, cacheKey, data);
    thisEnvFn.scope.injectTemporary(id, init(data));
  }

  return data;
}

function getScopeInformation(fnPath: IFunctionEnv) {
  const thisPaths: Array<NodePath<n.ThisExpression>> = [];
  const argumentsPaths: Array<NodePath<n.Identifier>> = [];
  const newTargetPaths: Array<NodePath<n.MetaProperty>> = [];
  const superProps: Array<NodePath<SuperProp>> = [];
  const superCalls: Array<NodePath<n.CallExpression>> = [];

  const scopeVisitor = PathVisitor.fromMethodsObject({
    visitClassProperty() {
      return false;
    },
    visitFunction(path: NodePath<K.FunctionKind>) {
      if (n.ArrowFunctionExpression.check(path.node)) {
        this.traverse(path);
      }
      return false;
    },
    visitThisExpression(path: NodePath<n.ThisExpression>) {
      thisPaths.push(path);
      return false;
    },
    visitCallExpression(path: NodePath<n.CallExpression>) {
      const { node } = path;
      if (n.Super.check(node.callee)) {
        superCalls.push(path);
      }
      this.traverse(path);
    },
    visitMemberExpression(path: NodePath<n.MemberExpression>) {
      if (n.Super.check(path.node.object)) {
        superProps.push(path as NodePath<SuperProp>);
      }
      this.traverse(path);
    },
    visitIdentifier(path: NodePath<n.Identifier>) {
      if (path.node.name === "arguments" && isReferencedIdentifier(path)) {
        argumentsPaths.push(path);
      }
      return false;
    },
    visitMetaProperty(path: NodePath<n.MetaProperty>) {
      const { node } = path;
      const { meta, property } = node;
      if (n.Identifier.check(meta) && meta.name === "new") {
        return false;
      }
      if (n.Identifier.check(property) && meta.name === "target") {
        return false;
      }

      newTargetPaths.push(path);

      return false;
    },
  });

  scopeVisitor.visit(fnPath);

  return {
    thisPaths,
    argumentsPaths,
    newTargetPaths,
    superProps,
    superCalls,
  };
}
