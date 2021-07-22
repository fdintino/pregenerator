import { Fork } from "../types";
import typesPlugin from "./types";

var hasOwn = Object.prototype.hasOwnProperty;

export interface Scope {
  path: any;
  node: any;
  isGlobal: boolean;
  depth: number;
  parent: any;
  hoistScope: Scope;
  bindings: any;
  hoistBindings: any;
  types: any;
  didScan: boolean;
  declares(name: any): any
  declaresType(name: any): any
  declareTemporary(prefix?: any): any;
  injectTemporary(identifier: any, init?: any): any;
  scan(force?: any): any;
  getBindings(): any;
  getHoistBindings(): any;
  getTypes(): any;
  push(path: any): any;
  lookup(name: any): any;
  lookupType(name: any): any;
  getGlobalScope(): Scope;
}

export interface ScopeConstructor {
  new(path: any, parentScope: any): Scope;
  isEstablishedBy(node: any): any;
}

export default function scopePlugin(fork: Fork) {
  var types = fork.use(typesPlugin);
  var Type = types.Type;
  var namedTypes = types.namedTypes;
  var Node = namedTypes.Node;
  var Expression = namedTypes.Expression;
  var isArray = types.builtInTypes.array;
  var b = types.builders;

  const Scope = function Scope(this: Scope, path: any, parentScope: unknown) {
    if (!(this instanceof Scope)) {
      throw new Error("Scope constructor cannot be invoked without 'new'");
    }

    ScopeType.assert(path.value);

    var depth: number;

    if (parentScope) {
      if (!(parentScope instanceof Scope)) {
        throw new Error("");
      }
      depth = (parentScope as Scope).depth + 1;
    } else {
      parentScope = null;
      depth = 0;
    }

    var hoistScope: Scope = (!parentScope || HoistScopeType.check(path.value))
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
  } as any as ScopeConstructor;

  var scopeTypes = [
    // Program nodes introduce global scopes.
    namedTypes.Program,

    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,

    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause,


    // The following are statements that create block scopes
    namedTypes.BlockStatement,
    namedTypes.DoWhileStatement,
    namedTypes.SwitchStatement,
    namedTypes.WhileStatement,
    namedTypes.ClassExpression,
    namedTypes.ClassDeclaration,
    namedTypes.IfStatement,
    namedTypes.ForStatement,
    namedTypes.ForInStatement,
    namedTypes.ForOfStatement,
  ];

  var ScopeType = Type.or.apply(Type, scopeTypes);
  var HoistScopeType = Type.or.apply(Type, [namedTypes.Program, namedTypes.Function]);

  Scope.isEstablishedBy = function(node) {
    return ScopeType.check(node);
  };

  var Sp: Scope = Scope.prototype;

// Will be overridden after an instance lazily calls scanScope.
  Sp.didScan = false;

  Sp.declares = function(name) {
    this.scan();
    return hasOwn.call(this.bindings, name);
  };

  Sp.declaresType = function(name) {
    this.scan();
    return hasOwn.call(this.types, name);
  };

  Sp.declareTemporary = function(prefix) {
    if (prefix) {
      if (!/^[a-z$_]/i.test(prefix)) {
        throw new Error("");
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

    var index = -1;
    while (this.lookup(prefix + (index === -1 ? "" : index))) {
      ++index;
    }

    var name = prefix + ((index === -1) ? "" : index);
    return this.bindings[name] = types.builders.identifier(name);
  };

  Sp.injectTemporary = function(identifier, init) {
    identifier || (identifier = this.declareTemporary());

    var bodyPath = this.path.get("body");
    if (namedTypes.BlockStatement.check(bodyPath.value)) {
      bodyPath = bodyPath.get("body");
    }

    bodyPath.unshift(
      b.variableDeclaration(
      "var",
      [b.variableDeclarator(identifier, init || null)]
      )
    );

    return identifier;
  };

  Sp.scan = function(force) {
    if (force || !this.didScan) {
      for (var name in this.bindings) {
        // Empty out this.bindings, just in cases.
        delete this.bindings[name];
      }
      const hoistBindings = this.hoistScope.hoistBindings;
      scanScope(this.path, this.bindings, hoistBindings, this.types);
      this.didScan = true;
    }
  };

  Sp.getBindings = function () {
    this.scan();
    return this.bindings;
  };

  Sp.getHoistBindings = function () {
    this.scan();
    return this.hoistScope.hoistBindings;
  };

  Sp.getTypes = function () {
    this.scan();
    return this.types;
  };

  function scanScope(path: any, bindings: any, hoistBindings: any, scopeTypes: any) {
    var node = path.value;
    ScopeType.assert(node);

    if (namedTypes.CatchClause.check(node)) {
      // A catch clause establishes a new scope but the only variable
      // bound in that scope is the catch parameter. Any other
      // declarations create bindings in the outer scope.
      var param = path.get("param");
      if (param.value) {
        addPattern(param, bindings);
      }

    } else {
      recursiveScanScope(path, bindings, hoistBindings, scopeTypes);
    }
  }

  function recursiveScanScope(path: any, bindings: any, hoistBindings: any, scopeTypes: any) {
    var node = path.value;

    if (path.parent &&
      namedTypes.FunctionExpression.check(path.parent.node) &&
      path.parent.node.id) {
      addPattern(path.parent.get("id"), bindings);
    }

    if (!node) {
      // None of the remaining cases matter if node is falsy.

    } else if (isArray.check(node)) {
      path.each(function(childPath: any) {
        recursiveScanChild(childPath, bindings, hoistBindings, scopeTypes);
      });

    } else if (namedTypes.Function.check(node)) {
      path.get("params").each(function(paramPath: any) {
        addPattern(paramPath, bindings);
      });

      recursiveScanChild(path.get("body"), bindings, hoistBindings, scopeTypes);

    } else if (
      (namedTypes.TypeAlias && namedTypes.TypeAlias.check(node)) ||
      (namedTypes.InterfaceDeclaration && namedTypes.InterfaceDeclaration.check(node)) ||
      (namedTypes.TSTypeAliasDeclaration && namedTypes.TSTypeAliasDeclaration.check(node)) ||
      (namedTypes.TSInterfaceDeclaration && namedTypes.TSInterfaceDeclaration.check(node))
    ) {
      addTypePattern(path.get("id"), scopeTypes);

    } else if (namedTypes.VariableDeclarator.check(node)) {
      if (
        path.parent &&
        namedTypes.VariableDeclaration.check(path.parent.node) &&
        path.parent.node.kind === "var"
      ) {
        addPattern(path.get("id"), hoistBindings);
      }
      addPattern(path.get("id"), bindings);
      recursiveScanChild(path.get("init"), bindings, hoistBindings, scopeTypes);

    } else if (node.type === "ImportSpecifier" ||
      node.type === "ImportNamespaceSpecifier" ||
      node.type === "ImportDefaultSpecifier") {
      addPattern(
        // Esprima used to use the .name field to refer to the local
        // binding identifier for ImportSpecifier nodes, but .id for
        // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
        // ESTree/Acorn/ESpree use .local for all three node types.
        path.get(node.local ? "local" :
        node.name ? "name" : "id"),
        bindings
      );

    } else if (Node.check(node) && !Expression.check(node)) {
      types.eachField(node, function(name: any, child: any) {
        var childPath = path.get(name);
        if (!pathHasValue(childPath, child)) {
          throw new Error("");
        }
        recursiveScanChild(childPath, bindings, hoistBindings, scopeTypes);
      });
    }
  }

  function pathHasValue(path: any, value: any) {
    if (path.value === value) {
      return true;
    }

    // Empty arrays are probably produced by defaults.emptyArray, in which
    // case is makes sense to regard them as equivalent, if not ===.
    if (Array.isArray(path.value) &&
      path.value.length === 0 &&
      Array.isArray(value) &&
      value.length === 0) {
      return true;
    }

    return false;
  }

  function recursiveScanChild(path: any, bindings: any, hoistBindings: any, scopeTypes: any) {
    var node = path.value;

    if (!node || Expression.check(node)) {
      // Ignore falsy values and Expressions.

    } else if (namedTypes.FunctionDeclaration.check(node) &&
           node.id !== null) {
      addPattern(path.get("id"), bindings);
      addPattern(path.get("id"), hoistBindings);

    } else if (namedTypes.ClassDeclaration &&
      namedTypes.ClassDeclaration.check(node)) {
      addPattern(path.get("id"), bindings);

    } else if (ScopeType.check(node)) {
      if (
        namedTypes.CatchClause.check(node) &&
        // TODO Broaden this to accept any pattern.
        namedTypes.Identifier.check(node.param)
      ) {
        var catchParamName = node.param.name;
        var hadBinding = hasOwn.call(bindings, catchParamName);

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

  function addPattern(patternPath: any, bindings: any) {
    var pattern = patternPath.value;
    namedTypes.PatternLike.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
      if (hasOwn.call(bindings, pattern.name)) {
        bindings[pattern.name].push(patternPath);
      } else {
        bindings[pattern.name] = [patternPath];
      }

    } else if (namedTypes.AssignmentPattern &&
      namedTypes.AssignmentPattern.check(pattern)) {
      addPattern(patternPath.get('left'), bindings);

    } else if (namedTypes.ObjectPattern &&
      namedTypes.ObjectPattern.check(pattern)) {
      patternPath.get('properties').each(function(propertyPath: any) {
        var property = propertyPath.value;
        if (namedTypes.PatternLike.check(property)) {
          addPattern(propertyPath, bindings);
        } else if (
          namedTypes.Property.check(property) ||
          namedTypes.ObjectProperty.check(property)
        ) {
          addPattern(propertyPath.get('value'), bindings);
        } else if (namedTypes.SpreadProperty &&
          namedTypes.SpreadProperty.check(property)) {
          addPattern(propertyPath.get('argument'), bindings);
        }
      });

    } else if (namedTypes.ArrayPattern &&
      namedTypes.ArrayPattern.check(pattern)) {
      patternPath.get('elements').each(function(elementPath: any) {
        var element = elementPath.value;
        if (namedTypes.PatternLike.check(element)) {
          addPattern(elementPath, bindings);
        } else if (namedTypes.SpreadElement &&
          namedTypes.SpreadElement.check(element)) {
          addPattern(elementPath.get("argument"), bindings);
        }
      });

    } else if (namedTypes.RestElement && namedTypes.RestElement.check(pattern)) {
      addPattern(patternPath.get('argument'), bindings);
    }
  }

  function addTypePattern(patternPath: any, types: any) {
    var pattern = patternPath.value;
    namedTypes.PatternLike.assert(pattern);

    if (namedTypes.Identifier.check(pattern)) {
      if (hasOwn.call(types, pattern.name)) {
        types[pattern.name].push(patternPath);
      } else {
        types[pattern.name] = [patternPath];
      }

    }
  }

  Sp.push = function(path: any) {
    addPattern(path, this.bindings);
  };

  Sp.lookup = function(name) {
    for (var scope = this; scope; scope = scope.parent)
      if (scope.declares(name))
        break;
    return scope;
  };

  Sp.lookupType = function(name) {
    for (var scope = this; scope; scope = scope.parent)
      if (scope.declaresType(name))
        break;
    return scope;
  };

  Sp.getGlobalScope = function() {
    var scope = this;
    while (!scope.isGlobal)
      scope = scope.parent;
    return scope;
  };

  return Scope;
};
