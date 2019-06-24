import * as t from "../../../types";

export let ReferencedIdentifier = {
  types: ["Identifier"],
  checkPath({ node, parent }, opts) {
    if (!t.isIdentifier(node, opts)) {
      return false;
    }

    // check if node is referenced
    return t.isReferenced(node, parent);
  }
};

export let ReferencedMemberExpression = {
  types: ["MemberExpression"],
  checkPath({ node, parent }) {
    return t.isMemberExpression(node) && t.isReferenced(node, parent);
  }
};

export let BindingIdentifier = {
  types: ["Identifier"],
  checkPath({ node, parent }) {
    return t.isIdentifier(node) && t.isBinding(node, parent);
  }
};

export let Statement = {
  types: ["Statement"],
  checkPath({ node, parent }) {
    if (t.isStatement(node)) {
      if (t.isVariableDeclaration(node)) {
        if (t.isForXStatement(parent, { left: node })) return false;
        if (t.isForStatement(parent, { init: node })) return false;
      }

      return true;
    } else {
      return false;
    }
  }
};

export let Expression = {
  types: ["Expression"],
  checkPath(path) {
    if (path.isIdentifier()) {
      return path.isReferencedIdentifier();
    } else {
      return t.isExpression(path.node);
    }
  }
};

export let Scope = {
  types: ["Scopable"],
  checkPath(path) {
    return t.isScope(path.node, path.parent);
  }
};

export let Referenced = {
  checkPath(path) {
    return t.isReferenced(path.node, path.parent);
  }
};

export let BlockScoped = {
  checkPath(path) {
    return t.isBlockScoped(path.node);
  }
};

export let Var = {
  types: ["VariableDeclaration"],
  checkPath(path) {
    return t.isVar(path.node);
  }
};

export let User = {
  checkPath(path) {
    return path.node && !!path.node.loc;
  }
};

export let Generated = {
  checkPath(path) {
    return !path.isUser();
  }
};

export let Pure = {
  checkPath(path, opts) {
    return path.scope.isPure(path.node, opts);
  }
};

// export let Flow = {
//   types: ["Flow", "ImportDeclaration", "ExportDeclaration"],
//   checkPath({ node }) {
//     if (t.isFlow(node)) {
//       return true;
//     } else if (t.isImportDeclaration(node)) {
//       return node.importKind === "type" || node.importKind === "typeof";
//     } else if (t.isExportDeclaration(node)) {
//       return node.exportKind === "type";
//     } else {
//       return false;
//     }
//   }
// };
