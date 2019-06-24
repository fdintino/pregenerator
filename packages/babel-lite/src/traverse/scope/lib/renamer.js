import Binding from "../binding";
import * as t from "../../../types";

let renameVisitor = {
  ReferencedIdentifier({ node }, state) {
    if (node.name === state.oldName) {
      node.name = state.newName;
    }
  },

  Scope(path, state) {
    if (!path.scope.bindingIdentifierEquals(state.oldName, state.binding.identifier)) {
      path.skip();
    }
  },

  "AssignmentExpression|Declaration"(path, state) {
    let ids = path.getBindingIdentifiers();

    for (let name in ids) {
      if (name === state.oldName) ids[name].name = state.newName;
    }
  }
};

function maybeConvertFromExportDeclaration(renamer, parentDeclar) {
  let exportDeclar = parentDeclar.parentPath.isExportDeclaration() && parentDeclar.parentPath;
  if (!exportDeclar) return;

  // build specifiers that point back to this export declaration
  let isDefault = exportDeclar.isExportDefaultDeclaration();
  let bindingIdentifiers = parentDeclar.getOuterBindingIdentifiers();
  let specifiers = [];

  for (let name in bindingIdentifiers) {
    let localName = name === renamer.oldName ? renamer.newName : name;
    let exportedName = isDefault ? "default" : name;
    specifiers.push(t.exportSpecifier(t.identifier(localName), t.identifier(exportedName)));
  }

  let aliasDeclar = t.exportNamedDeclaration(null, specifiers);

  // hoist to the top if it's a function
  if (parentDeclar.isFunctionDeclaration()) {
    aliasDeclar._blockHoist = 3;
  }

  exportDeclar.insertAfter(aliasDeclar);
  exportDeclar.replaceWith(parentDeclar.node);
}

export default class Renamer {
  constructor(binding, oldName, newName) {
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }

  rename(block) {
    let { binding, oldName, newName } = this;
    let { scope, path } = binding;

    let parentDeclar = path.find((path) => path.isDeclaration() || path.isFunctionExpression());
    if (parentDeclar) {
      maybeConvertFromExportDeclaration(this, parentDeclar);
    }

    scope.traverse(block || scope.block, renameVisitor, this);

    if (!block) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    }

    if (binding.type === "hoisted") {
      // https://github.com/babel/babel/issues/2435
      // todo: hoist and convert function to a let
    }
  }
}
