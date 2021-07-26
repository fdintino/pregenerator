import {
  builtInTypes,
  getFieldValue,
  builders as b,
  // namedTypes as n,
  ASTNode,
} from "./types";
import { namedTypes as n } from "../gen/namedTypes";
import { Path } from "./path";
import { Scope } from "./scope";
import "../def";

const Op = Object.prototype;
const hasOwn = Op.hasOwnProperty;
const isString = builtInTypes.string;

const assertIsString: typeof isString["assert"] =
  isString.assert.bind(isString);

type PathName = string | number;

export interface NodePath<N extends ASTNode = ASTNode, V = any> extends Path<V> {
  // node: N;
  // parent: any;
  // scope: any;
  // replace: Path["replace"];
  prune(...args: any[]): any;
  // _computeNode(): any;
  // _computeParent(): any;
  // _computeScope(): Scope | null;
  getValueProperty(name: any): any;
  needsParens(assumeExpressionContext?: boolean): boolean;
  canBeFirstInStatement(): boolean;
  firstInStatement(): boolean;
}

export interface NodePathConstructor {
  new <N extends ASTNode = ASTNode, V = any>(
    value: V,
    parentPath?: any,
    name?: PathName
  ): NodePath<N, V>;
}

//
// export interface NodePathConstructor {
//   new <N extends ASTNode = any, V = any>(
//     value: any,
//     parentPath?: any,
//     name?: any
//   ): NodePath<N, V>;
// }

const PRECEDENCE: any = {};
[
  ["||"],
  ["&&"],
  ["|"],
  ["^"],
  ["&"],
  ["==", "===", "!=", "!=="],
  ["<", ">", "<=", ">=", "in", "instanceof"],
  [">>", "<<", ">>>"],
  ["+", "-"],
  ["*", "/", "%"],
].forEach(function (tier, i) {
  tier.forEach(function (op) {
    PRECEDENCE[op] = i;
  });
});

const configurable =
  (value: boolean) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.configurable = value;
  };

export class NodePath<N extends ASTNode = ASTNode, V = any> extends Path<V> {
  // constructor(
  //   value: V,
  //   parentPath?: any,
  //   name?: PathName
  // ) {
  //   super(value, parentPath, name);
  //   Object.defineProperties(this, {
  //     node: {
  //       get: function () {
  //         Object.defineProperty(this, "node", {
  //           configurable: true, // Enable deletion.
  //           value: this._computeNode()
  //         });
  //
  //         return this.node;
  //       }
  //     },
  //
  //     parent: {
  //       get: function () {
  //         Object.defineProperty(this, "parent", {
  //           configurable: true, // Enable deletion.
  //           value: this._computeParent()
  //         });
  //
  //         return this.parent;
  //       }
  //     },
  //
  //     scope: {
  //       get: function () {
  //         Object.defineProperty(this, "scope", {
  //           configurable: true, // Enable deletion.
  //           value: this._computeScope()
  //         });
  //
  //         return this.scope;
  //       }
  //     }
  //   });
  //
  // }
  @configurable(true)
  get node(): N {
    Object.defineProperty(this, "node", {
      configurable: true,
      value: () => this._computeNode(),
    });
    return this.node;
  }

  _computeNode(): N {
    const value = this.value;
    if (n.Node.check(value)) {
      return value as unknown as N;
    }
    const pp = this.parentPath;
    if (pp === null) {
      throw new Error("");
    }
    return pp.node as N;
  }

  @configurable(true)
  get parent(): this | null {
    Object.defineProperty(this, "parent", {
      configurable: true,
      value: () => this._computeParent(),
    });
    return this.parent;
  }

  _computeParent(): this | null {
    const value = this.value;
    let pp = this.parentPath;

    if (!n.Node.check(value)) {
      while (pp && !n.Node.check(pp.value)) {
        pp = pp.parentPath;
      }

      if (pp) {
        pp = pp.parentPath;
      }
    }

    while (pp && !n.Node.check(pp.value)) {
      pp = pp.parentPath;
    }

    return pp || null;
  }

  @configurable(true)
  get scope(): Scope<this> | null {
    Object.defineProperty(this, "scope", {
      configurable: true,
      value: () => this._computeScope(),
    });
    return this.scope;
  }

  replace(...args: any[]): this[] {
    delete (this as any).node;
    delete (this as any).parent;
    delete (this as any).scope;

    return super.replace(...args);
  }

  prune(): this {
    const remainingNodePath = this.parent;

    if (remainingNodePath === null) {
      throw new Error("Cannot prune an orphaned NodePath");
    }

    this.replace();

    return cleanUpNodesAfterPrune(remainingNodePath);
  }

  // The closest enclosing scope that governs this node.
  _computeScope(): Scope<this> | null {
    const value = this.value;
    const pp = this.parentPath;
    let scope: Scope<this> | null = (pp) ? pp.scope : null;

    if (n.Node.check(value) && Scope.isEstablishedBy(value)) {
      scope = new Scope(this, scope);
    }

    return scope || null;
  }

  getValueProperty(name: PathName): any {
    if (n.Node.check(this.value)) {
      assertIsString(name);
      return getFieldValue(this.value, name);
    } else {
      if (hasOwn.call(this.value, name)) {
        return (this.value as any)[name];
      }
    }
  }
}

// export const NodePath = function NodePath(
//   this: NodePath,
//   value: any,
//   parentPath?: any,
//   name?: any
// ) {
//   if (!(this instanceof NodePath)) {
//     throw new Error("NodePath constructor cannot be invoked without 'new'");
//   }
//   Path.call(this, value, parentPath, name);
// } as any as NodePathConstructor;
//
// const NPp: NodePath = (NodePath.prototype = Object.create(Path.prototype, {
//   constructor: {
//     value: NodePath,
//     enumerable: false,
//     writable: true,
//     configurable: true,
//   },
// }));

/**
 * Determine whether this.node needs to be wrapped in parentheses in order
 * for a parser to reproduce the same local AST structure.
 *
 * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
 * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
 * parse differently.
 *
 * If assumeExpressionContext === true, we don't worry about edge cases
 * like an anonymous FunctionExpression appearing lexically first in its
 * enclosing statement and thus needing parentheses to avoid being parsed
 * as a FunctionDeclaration with a missing name.
 */
// needsParens(assumeExpressionContext: boolean): boolean {
//   let pp = this.parentPath;
//   if (!pp) {
//     return false;
//   }
//
//   const node = this.value;
//
//   // Only expressions need parentheses.
//   if (!n.Expression.check(node)) {
//     return false;
//   }
//
//   // Identifiers never need parentheses.
//   if (node.type === "Identifier") {
//     return false;
//   }
//
//   while (!n.Node.check(pp.value)) {
//     pp = pp.parentPath;
//     if (!pp) {
//       return false;
//     }
//   }
//
//   const parent = pp.value;
//
//   switch (node.type) {
//     case "UnaryExpression":
//       return (
//         parent.type === "MemberExpression" &&
//         this.name === "object" &&
//         parent.object === node
//       );
//
//     case "BinaryExpression":
//     case "LogicalExpression":
//       switch (parent.type) {
//         case "CallExpression":
//           return this.name === "callee" && parent.callee === node;
//
//         case "UnaryExpression":
//         case "SpreadElement":
//         case "SpreadProperty":
//           return true;
//
//         case "MemberExpression":
//           return this.name === "object" && parent.object === node;
//
//         case "BinaryExpression":
//         case "LogicalExpression": {
//           const n = node as
//             | namedTypes.BinaryExpression
//             | namedTypes.LogicalExpression;
//           const po = parent.operator;
//           const pp = PRECEDENCE[po];
//           const no = n.operator;
//           const np = PRECEDENCE[no];
//
//           if (pp > np) {
//             return true;
//           }
//
//           if (pp === np && this.name === "right") {
//             if (parent.right !== n) {
//               throw new Error("Nodes must be equal");
//             }
//             return true;
//           }
//         }
//
//         default:
//           return false;
//       }
//
//     case "SequenceExpression":
//       switch (parent.type) {
//         case "ForStatement":
//           // Although parentheses wouldn't hurt around sequence
//           // expressions in the head of for loops, traditional style
//           // dictates that e.g. i++, j++ should not be wrapped with
//           // parentheses.
//           return false;
//
//         case "ExpressionStatement":
//           return this.name !== "expression";
//
//         default:
//           // Otherwise err on the side of overparenthesization, adding
//           // explicit exceptions above if this proves overzealous.
//           return true;
//       }
//
//     case "YieldExpression":
//       switch (parent.type) {
//         case "BinaryExpression":
//         case "LogicalExpression":
//         case "UnaryExpression":
//         case "SpreadElement":
//         case "SpreadProperty":
//         case "CallExpression":
//         case "MemberExpression":
//         case "NewExpression":
//         case "ConditionalExpression":
//         case "YieldExpression":
//           return true;
//
//         default:
//           return false;
//       }
//
//     case "Literal":
//       return (
//         parent.type === "MemberExpression" &&
//         isNumber.check((node as namedTypes.Literal).value) &&
//         this.name === "object" &&
//         parent.object === node
//       );
//
//     case "AssignmentExpression":
//     case "ConditionalExpression":
//       switch (parent.type) {
//         case "UnaryExpression":
//         case "SpreadElement":
//         case "SpreadProperty":
//         case "BinaryExpression":
//         case "LogicalExpression":
//           return true;
//
//         case "CallExpression":
//           return this.name === "callee" && parent.callee === node;
//
//         case "ConditionalExpression":
//           return this.name === "test" && parent.test === node;
//
//         case "MemberExpression":
//           return this.name === "object" && parent.object === node;
//
//         default:
//           return false;
//       }
//
//     default:
//       if (
//         parent.type === "NewExpression" &&
//         this.name === "callee" &&
//         parent.callee === node
//       ) {
//         return containsCallExpression(node);
//       }
//   }
//
//   if (
//     assumeExpressionContext !== true &&
//     !this.canBeFirstInStatement() &&
//     this.firstInStatement()
//   )
//     return true;
//
//   return false;
// }

// canBeFirstInStatement(): boolean {
//   const node = this.node;
//   return !n.FunctionExpression.check(node) && !n.ObjectExpression.check(node);
// }
//
// NPp.firstInStatement = function () {
//   let node: n.ASTNode;
//   let parent: n.ASTNode;
//   for (let node, parent; path.parent; path = path.parent) {
//     node = path.node;
//     parent = path.parent.node;
//
//     if (
//       n.BlockStatement.check(parent) &&
//       path.parent.name === "body" &&
//       path.name === 0
//     ) {
//       if (parent.body[0] !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       return true;
//     }
//
//     if (n.ExpressionStatement.check(parent) && path.name === "expression") {
//       if (parent.expression !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       return true;
//     }
//
//     if (
//       n.SequenceExpression.check(parent) &&
//       path.parent.name === "expressions" &&
//       path.name === 0
//     ) {
//       if (parent.expressions[0] !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     if (n.CallExpression.check(parent) && path.name === "callee") {
//       if (parent.callee !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     if (n.MemberExpression.check(parent) && path.name === "object") {
//       if (parent.object !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     if (n.ConditionalExpression.check(parent) && path.name === "test") {
//       if (parent.test !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     if (isBinary(parent) && path.name === "left") {
//       if (parent.left !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     if (
//       n.UnaryExpression.check(parent) &&
//       !parent.prefix &&
//       path.name === "argument"
//     ) {
//       if (parent.argument !== node) {
//         throw new Error("Nodes must be equal");
//       }
//       continue;
//     }
//
//     return false;
//   }
//
//   return true;
// };
//
// function isBinary(node: any) {
//   return n.BinaryExpression.check(node) || n.LogicalExpression.check(node);
// }
//
// function containsCallExpression(node: any): any {
//   if (n.CallExpression.check(node)) {
//     return true;
//   }
//
//   if (isArray.check(node)) {
//     return node.some(containsCallExpression);
//   }
//
//   if (n.Node.check(node)) {
//     return someField(node, function (_name: any, child: any) {
//       return containsCallExpression(child);
//     });
//   }
//
//   return false;
// }
//
// function firstInStatement(path: any) {
// }

/**
 * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
 */
function cleanUpNodesAfterPrune(remainingNodePath: any) {
  if (n.VariableDeclaration.check(remainingNodePath.node)) {
    const declarations = remainingNodePath.get("declarations").value;
    if (!declarations || declarations.length === 0) {
      return remainingNodePath.prune();
    }
  } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
    if (!remainingNodePath.get("expression").value) {
      return remainingNodePath.prune();
    }
  } else if (n.IfStatement.check(remainingNodePath.node)) {
    cleanUpIfStatementAfterPrune(remainingNodePath);
  }

  return remainingNodePath;
}

function cleanUpIfStatementAfterPrune(ifStatement: any) {
  const testExpression = ifStatement.get("test").value;
  const alternate = ifStatement.get("alternate").value;
  const consequent = ifStatement.get("consequent").value;

  if (!consequent && !alternate) {
    const testExpressionStatement = b.expressionStatement(testExpression);

    ifStatement.replace(testExpressionStatement);
  } else if (!consequent && alternate) {
    let negatedTestExpression: n.Expression = b.unaryExpression(
      "!",
      testExpression,
      true
    );

    if (
      n.UnaryExpression.check(testExpression) &&
      testExpression.operator === "!"
    ) {
      negatedTestExpression = testExpression.argument;
    }

    ifStatement.get("test").replace(negatedTestExpression);
    ifStatement.get("consequent").replace(alternate);
    ifStatement.get("alternate").replace();
  }
}
