import "../def";
import {
  Type,
  // namedTypes as n,
  // Node,
  // Expression,
  // ASTNode,
  eachField,
  builtInTypes,
  builders as b,
} from "./types";
import { namedTypes as n } from "../gen/namedTypes";
import { NodePath } from "./node-path";
import type * as K from "../gen/kinds";
import { PassThrough } from "stream";

const hasOwn = Object.prototype.hasOwnProperty;

const isArray = builtInTypes.array;

type Loop =
  | n.DoWhileStatement
  | n.ForInStatement
  | n.ForStatement
  | n.WhileStatement
  | n.ForOfStatement;

const scopeTypes = () => [
  // Program nodes introduce global scopes.
  n.Program,

  // Function is the supertype of FunctionExpression,
  // FunctionDeclaration, ArrowExpression, etc.
  n.Function,

  // In case you didn't know, the caught parameter shadows any variable
  // of the same name in an outer scope.
  n.CatchClause,

  // The following are statements that create block scopes
  n.BlockStatement,
  n.DoWhileStatement,
  n.SwitchStatement,
  n.WhileStatement,
  // n.ClassExpression,
  // n.ClassDeclaration,
  n.IfStatement,
  n.ForStatement,
  n.ForInStatement,
  n.ForOfStatement,
];

export type ScopeType =
  | n.Program
  | n.Function
  | n.CatchClause
  | n.BlockStatement
  | n.DoWhileStatement
  | n.SwitchStatement
  | n.WhileStatement
  // | n.ClassExpression
  // | n.ClassDeclaration
  | n.IfStatement
  | n.ForStatement
  | n.ForInStatement
  | n.ForOfStatement;

let ScopeType: Type<ScopeType> = null as unknown as Type<ScopeType>;

const assertScopeType: typeof ScopeType["assert"] = (...args) => {
  if ((ScopeType as any) === null) {
    ScopeType = Type.or(...scopeTypes());
  }
  return ScopeType.assert.bind(ScopeType)(...args);
};

export type ScopeBindings = Record<
  string,
  Array<NodePath<n.Node>> | NodePath<n.Node>
>;

export class Scope<P extends NodePath<ScopeType> = NodePath<ScopeType>> {
  path: P;
  node: ScopeType;
  isGlobal: boolean;
  depth: number;
  parent: this | null;
  hoistScope: this;
  bindings: ScopeBindings;
  hoistBindings: ScopeBindings;
  types: ScopeBindings;
  didScan: boolean;

  constructor(path: P, parentScope?: Scope | null) {
    if ((ScopeType as any) === null) {
      ScopeType = Type.or(...scopeTypes());
    }

    const node = path.value;
    assertScopeType(node);

    let depth: number;

    if (parentScope) {
      if (!(parentScope instanceof Scope)) {
        throw new Error("");
      }
      depth = (parentScope as Scope).depth + 1;
    } else {
      parentScope = null;
      depth = 0;
    }

    const HoistScopeType = Type.or(n.Program, n.Function);

    const hoistScope: Scope =
      !parentScope || HoistScopeType.check(path.value)
        ? this
        : (parentScope as Scope).hoistScope;

    Object.defineProperties(this, {
      path: { value: path },
      node: { value: path.value },
      isGlobal: { value: !parentScope, enumerable: true },
      depth: { value: depth },
      parent: { value: parentScope },
      hoistScope: { value: hoistScope },
      bindings: { value: {} },
      hoistBindings: { value: {} },
      types: { value: {} },
    });

    this.didScan = false;
  }

  static isEstablishedBy(node: unknown): node is ScopeType {
    if ((ScopeType as any) === null) {
      ScopeType = Type.or(...scopeTypes());
    }
    return ScopeType.check(node);
  }

  declares(name: string): boolean {
    this.scan();
    return hasOwn.call(this.bindings, name);
  }

  declaresType(name: string): boolean {
    this.scan();
    return hasOwn.call(this.types, name);
  }

  declareTemporary(prefix?: string | null, dontPush = false): n.Identifier {
    if (prefix) {
      if (!/^[a-z$_]/i.test(prefix)) {
        throw new Error("Invalid prefix " + prefix);
      }
    } else {
      prefix = "temp";
    }

    // Include this.depth in the name to make sure the name does not
    // collide with any variables in nested/enclosing scopes.
    // prefix += this.depth.toString(36) + "$";
    // prefix = `_${prefix}${this.depth.toString(36)}`;
    prefix = `_${prefix}`;

    this.scan();

    let index = -1;
    while (this.lookup(prefix + (index === -1 ? "" : index))) {
      ++index;
    }

    const name = prefix + (index === -1 ? "" : index);
    const id = b.identifier(name);
    if (!dontPush) {
      this.pushIdentifier(id);
    }
    return id;
  }

  injectTemporary(
    id?: n.Identifier | string | null,
    init?: K.ExpressionKind
  ): n.Identifier {
    let identifier: n.Identifier;
    if (typeof id === "string") {
      identifier = this.declareTemporary(id, true);
    } else if (n.Identifier.check(id)) {
      identifier = id;
    } else {
      identifier = this.declareTemporary(null, true);
    }

    let path: NodePath = this.path;
    if (n.SwitchStatement.check(path.node)) {
      path = this.hoistScope.path;
    }

    let bodyPath: NodePath = path.get("body");
    if (n.BlockStatement.check(bodyPath.value)) {
      bodyPath = bodyPath.get("body");
    }

    bodyPath.unshift(
      b.variableDeclaration("var", [
        b.variableDeclarator(identifier, init || null),
      ])
    );

    this.bindings[identifier.name] = bodyPath
      .get(0)
      .get("declarations")
      .get(0)
      .get("id") as NodePath<n.Identifier>;

    return identifier;
  }

  scan(force?: boolean): void {
    if (force || !this.didScan) {
      for (const name in this.bindings) {
        // Empty out this.bindings, just in cases.
        delete this.bindings[name];
      }
      const hoistBindings = this.hoistScope.hoistBindings;
      scanScope(this.path, this.bindings, hoistBindings, this.types);
      this.didScan = true;
    }
  }

  getBindings(): ScopeBindings {
    this.scan();
    return this.bindings;
  }

  getHoistBindings(): ScopeBindings {
    this.scan();
    return this.hoistScope.hoistBindings;
  }

  getTypes(): ScopeBindings {
    this.scan();
    return this.types;
  }

  pushIdentifier(id: n.Identifier): void {
    const { path } = this;
    const { node } = path;
    const statement = b.expressionStatement(id);
    if (n.BlockStatement.check(node)) {
      const index = node.body.length;
      node.body.push(statement);
      this.push(path.get("body").get(index).get("expression"));
      node.body.pop();
    } else if (n.IfStatement.check(node)) {
      const { consequent } = node;
      node.consequent = statement;
      this.push(path.get("consequent").get("expression"));
      node.consequent = consequent;
    } else if (n.Program.check(node)) {
      const index = node.body.length;
      node.body.push(statement);
      this.push(path.get("body").get(index).get("expression"));
      node.body.pop();
    } else if (n.SwitchStatement.check(node)) {
      const switchCase = b.switchCase(id, [statement]);
      const index = node.cases.length;
      node.cases.push(switchCase);
      this.push(
        path.get("cases").get(index).get("consequent").get(0).get("expression")
      );
      node.cases.pop();
    } else {
      const _path = path as NodePath<typeof node>;
      const origBody = node.body;
      node.body = statement;
      this.push(path.get("body").get("expression"));
      node.body = origBody;
    }
  }

  push(path: NodePath): void {
    addPattern(path, this.bindings);
  }

  lookup(name: string): Scope | null {
    let scope: Scope | null = this;
    for (scope = this; scope; scope = scope.parent)
      if (scope.declares(name)) break;
    return scope;
  }

  lookupType(name: string): Scope | null {
    let scope: Scope | null = this;
    for (scope = this; scope; scope = scope.parent)
      if (scope.declaresType(name)) break;
    return scope;
  }

  getGlobalScope(): Scope | null {
    let scope: Scope | null = this;
    while (scope && !scope.isGlobal) scope = scope.parent;
    return scope;
  }
}

function scanScope(
  path: NodePath,
  bindings: ScopeBindings,
  hoistBindings: ScopeBindings,
  scopeTypes: ScopeBindings
): void {
  const node = path.value;
  assertScopeType(node);

  if (n.CatchClause.check(node)) {
    // A catch clause establishes a new scope but the only variable
    // bound in that scope is the catch parameter. Any other
    // declarations create bindings in the outer scope.
    const param = path.get("param");
    if (param.value) {
      addPattern(param, bindings);
    }
  } else {
    recursiveScanScope(path, bindings, hoistBindings, scopeTypes);
  }
}

function recursiveScanScope(
  path: NodePath,
  bindings: ScopeBindings,
  hoistBindings: ScopeBindings,
  scopeTypes: ScopeBindings
): void {
  const node = path.value;

  if (
    path.parent &&
    n.FunctionExpression.check(path.parent.node) &&
    path.parent.node.id
  ) {
    addPattern(path.parent.get("id"), bindings);
  }

  if (!node) {
    // None of the remaining cases matter if node is falsy.
  } else if (isArray.check(node)) {
    path.each(function (childPath: any) {
      recursiveScanChild(childPath, bindings, hoistBindings, scopeTypes);
    });
  } else if (n.Function.check(node)) {
    path.get("params").each(function (paramPath: any) {
      addPattern(paramPath, bindings);
    });

    recursiveScanChild(path.get("body"), bindings, hoistBindings, scopeTypes);
  } else if (
    (n.TSTypeAliasDeclaration && n.TSTypeAliasDeclaration.check(node)) ||
    (n.TSInterfaceDeclaration && n.TSInterfaceDeclaration.check(node))
  ) {
    addTypePattern(path.get("id"), scopeTypes);
  } else if (n.VariableDeclarator.check(node)) {
    if (
      path.parent &&
      n.VariableDeclaration.check(path.parent.node) &&
      path.parent.node.kind === "var"
    ) {
      addPattern(path.get("id"), hoistBindings);
    }
    addPattern(path.get("id"), bindings);
    recursiveScanChild(path.get("init"), bindings, hoistBindings, scopeTypes);
  } else if (
    node.type === "ImportSpecifier" ||
    node.type === "ImportNamespaceSpecifier" ||
    node.type === "ImportDefaultSpecifier"
  ) {
    addPattern(
      // Esprima used to use the .name field to refer to the local
      // binding identifier for ImportSpecifier nodes, but .id for
      // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
      // ESTree/Acorn/ESpree use .local for all three node types.
      path.get(node.local ? "local" : node.name ? "name" : "id"),
      bindings
    );
  } else if (n.Node.check(node) && !n.Expression.check(node)) {
    eachField(node, function (name: any, child: any) {
      const childPath = path.get(name);
      if (!pathHasValue(childPath, child)) {
        throw new Error("");
      }
      recursiveScanChild(childPath, bindings, hoistBindings, scopeTypes);
    });
  }
}

function pathHasValue(path: NodePath, value: any): boolean {
  if (path.value === value) {
    return true;
  }

  // Empty arrays are probably produced by defaults.emptyArray, in which
  // case is makes sense to regard them as equivalent, if not ===.
  if (
    Array.isArray(path.value) &&
    path.value.length === 0 &&
    Array.isArray(value) &&
    value.length === 0
  ) {
    return true;
  }

  return false;
}

function recursiveScanChild(
  path: any,
  bindings: any,
  hoistBindings: any,
  scopeTypes: any
): void {
  const node = path.value;

  if (!node || n.Expression.check(node)) {
    // Ignore falsy values and Expressions.
  } else if (n.FunctionDeclaration.check(node) && node.id !== null) {
    addPattern(path.get("id"), bindings);
    addPattern(path.get("id"), hoistBindings);
  } else if (n.ClassDeclaration && n.ClassDeclaration.check(node)) {
    addPattern(path.get("id"), bindings);
  } else if (ScopeType.check(node)) {
    if (
      n.CatchClause.check(node) &&
      // TODO Broaden this to accept any pattern.
      n.Identifier.check(node.param)
    ) {
      const catchParamName = node.param.name;
      const hadBinding = hasOwn.call(bindings, catchParamName);

      // Any declarations that occur inside the catch body that do
      // not have the same name as the catch parameter should count
      // as bindings in the outer scope.
      recursiveScanScope(path.get("body"), bindings, hoistBindings, scopeTypes);

      // If a new binding matching the catch parameter name was
      // created while scanning the catch body, ignore it because it
      // actually refers to the catch parameter and not the outer
      // scope that we're currently scanning.
      if (!hadBinding) {
        delete bindings[catchParamName];
      }
    }
  } else {
    recursiveScanScope(path, bindings, hoistBindings, scopeTypes);
  }
}

function addPattern(patternPath: NodePath, bindings: ScopeBindings): void {
  const pattern = patternPath.value;
  n.assertPatternLike(pattern);

  if (n.Identifier.check(pattern)) {
    if (hasOwn.call(bindings, pattern.name)) {
      bindings[pattern.name].push(patternPath);
    } else {
      bindings[pattern.name] = [patternPath];
    }
  } else if (n.AssignmentPattern && n.AssignmentPattern.check(pattern)) {
    addPattern(patternPath.get("left"), bindings);
  } else if (n.ObjectPattern && n.ObjectPattern.check(pattern)) {
    patternPath.get("properties").each(function (propertyPath: any) {
      const property = propertyPath.value;
      if (n.PatternLike.check(property)) {
        addPattern(propertyPath, bindings);
      } else if (
        n.Property.check(property) ||
        n.ObjectProperty.check(property)
      ) {
        addPattern(propertyPath.get("value"), bindings);
      }
    });
  } else if (n.ArrayPattern && n.ArrayPattern.check(pattern)) {
    patternPath.get("elements").each(function (elementPath: any) {
      const element = elementPath.value;
      if (n.PatternLike.check(element)) {
        addPattern(elementPath, bindings);
      } else if (n.SpreadElement && n.SpreadElement.check(element)) {
        addPattern(elementPath.get("argument"), bindings);
      }
    });
  } else if (n.RestElement && n.RestElement.check(pattern)) {
    addPattern(patternPath.get("argument"), bindings);
  }
}

function addTypePattern(patternPath: NodePath, types: ScopeBindings): void {
  const pattern = patternPath.value;
  n.assertPatternLike(pattern);

  if (n.Identifier.check(pattern)) {
    if (hasOwn.call(types, pattern.name)) {
      types[pattern.name].push(patternPath);
    } else {
      types[pattern.name] = [patternPath];
    }
  }
}
