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

export default class Renamer {
  constructor(binding, oldName, newName) {
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }

  rename(block) {
    let { binding, oldName, newName } = this;
    let { scope, path } = binding;

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
