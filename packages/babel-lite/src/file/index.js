import traverse from '../traverse';
import * as t from '../types';
import { codeFrameColumns } from './code-frame';

const errorVisitor = {
  enter(path, state) {
    const loc = path.node.loc;
    if (loc) {
      state.loc = loc;
      path.stop();
    }
  },
};

export default class File {
  constructor() {
    this.hub = {
      // keep it for the usage in babel-core, ex: path.hub.file.opts.filename
      file: this,
      getCode: () => this.code,
      getScope: () => this.scope,
      addHelper: this.addHelper.bind(this),
      buildError: this.buildCodeFrameError.bind(this),
    };
  }

  addHelper(name) {
    return t.memberExpression(t.identifier('pregeneratorHelpers'), t.identifier(name));
  }

  buildCodeFrameError(node, msg, Error) {
    let loc = node && (node.loc || node._loc);

    if (!loc && node) {
      const state = {
        loc: null,
      };
      // traverse(node, errorVisitor, this.scope, state);
      traverse.cheap(traverse.NodePath.get({parent: node, container: node}), errorVisitor.enter, state);
      loc = state.loc;

      let txt =
        'This is an error on an internal node. Probably an internal error.';
      if (loc) txt += ' Location has been estimated.';

      msg += ` (${txt})`;
    }

    if (loc) {
      msg +=
        '\n' +
        codeFrameColumns(
          this.code,
          {
            start: {
              line: loc.start.line,
              column: loc.start.column + 1,
            },
          });
    }

    return new Error(msg);
  }
}