/**
 * This class is responsible for a binding inside of a scope.
 *
 * It tracks the following:
 *
 *  * Node path.
 *  * Amount of times referenced by other nodes.
 *  * Paths to nodes that reassign or modify this binding.
 *  * The kind of binding. (Is it a parameter, declaration etc)
 */

export default class Binding {
  constructor({ existing, identifier, scope, path, kind }) {
    this.identifier = identifier;
    this.scope      = scope;
    this.path       = path;
    this.kind       = kind;

    this.constantViolations = [];
    this.constant = true;

    this.referencePaths = [];
    this.referenced = false;
    this.references = 0;

    this.clearValue();

    if (existing) {
      this.constantViolations = [].concat(
        existing.path,
        existing.constantViolations,
        this.constantViolations
      );
    }
  }

  clearValue() {
    this.hasDeoptedValue = false;
    this.hasValue        = false;
    this.value           = null;
  }

  /**
   * Register a constant violation with the provided `path`.
   */

  reassign(path) {
    this.constant = false;
    this.constantViolations.push(path);
  }

  /**
   * Increment the amount of references to this binding.
   */

  reference(path) {
    this.referenced = true;
    this.references++;
    this.referencePaths.push(path)
  }
}
