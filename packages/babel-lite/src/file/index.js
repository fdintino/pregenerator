import * as t from '../types';

export default class File {
  constructor() {
    this.hub = {
      // keep it for the usage in babel-core, ex: path.hub.file.opts.filename
      file: this,
      addHelper: this.addHelper.bind(this),
    };
  }

  addHelper(name) {
    return t.memberExpression(t.identifier('pregeneratorHelpers'), t.identifier(name));
  }
}
