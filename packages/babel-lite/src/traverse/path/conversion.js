// This file contains methods that convert the path node into another node or some other type of data.

import * as t from '../../types';

export function toComputedKey() {
  let node = this.node;

  let key;
  if (this.isMemberExpression()) {
    key = node.property;
  } else if (this.isProperty() || this.isMethod()) {
    key = node.key;
  } else {
    throw new ReferenceError('todo');
  }

  if (!node.computed) {
    if (t.isIdentifier(key)) key = t.stringLiteral(key.name);
  }

  return key;
}

export function ensureBlock() {
  return t.ensureBlock(this.node);
}

export function arrowFunctionToShadowed() {
  // todo: maybe error
  if (!this.isArrowFunctionExpression()) return;

  this.ensureBlock();

  let { node } = this;
  node.expression = false;
  node.type = 'FunctionExpression';
  node.shadow = node.shadow || true;
}

export function arrowFunctionToExpression() {
  // todo: maybe error
  if (!this.isArrowFunctionExpression()) return;

  this.ensureBlock();

  let { node } = this;
  node.expression = false;
  node.type = 'FunctionExpression';
  node.shadow = node.shadow || true;
}

/**
 * Given an arbitrary function, process its content as if it were an arrow function, moving references
 * to 'this', 'arguments', 'super', and such into the function's parent scope. This method is useful if
 * you have wrapped some set of items in an IIFE or other function, but want 'this', 'arguments', and super'
 * to continue behaving as expected.
 */
export function unwrapFunctionEnvironment() {
  hoistFunctionEnvironment(this);
}

/**
 * Given a function, traverse its contents, and if there are references to 'arguments',
 * ensure that these references reference the parent environment around this function.
 */
function hoistFunctionEnvironment(fnPath) {
  const thisEnvFn = fnPath.findParent(p => (
    (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram()));

  const argumentsPaths = getArgumentsPaths(fnPath);

  // Convert all 'arguments' references in the arrow to point at the alias.
  if (argumentsPaths.length > 0) {
    const argumentsBinding = getBinding(thisEnvFn, 'arguments', () =>
      t.identifier('arguments'),
    );

    argumentsPaths.forEach(argumentsChild => {
      const argsRef = t.identifier(argumentsBinding);
      argsRef.loc = argumentsChild.node.loc;

      argumentsChild.replaceWith(argsRef);
    });
  }
}

function getBinding(thisEnvFn, key, init) {
  const cacheKey = '_binding' + key;
  // let data = thisEnvFn.getData(cacheKey);
  let data = thisEnvFn[cacheKey];
  if (!data) {
    const id = thisEnvFn.scope.generateUidIdentifier(key);
    data = id.name;
    thisEnvFn[cacheKey] = data;

    thisEnvFn.scope.push({id: id, init: init(data)});
  }

  return data;
}

function getArgumentsPaths(fnPath) {
  const argumentsPaths = [];

  fnPath.traverse({
    Function(child) {
      if (child.isArrowFunctionExpression()) return;
      child.skip();
    },
    ReferencedIdentifier(child) {
      if (child.node.name !== 'arguments') return;

      argumentsPaths.push(child);
    },
  });

  return argumentsPaths;
}
