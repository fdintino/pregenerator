import Symbol from "es6-symbol";

export default function transformBlockScopingPlugin({types: t, traverse}) {
  function ignoreBlock(path) {
    return t.isLoop(path.parent) || t.isCatchClause(path.parent);
  }

  function buildRetCheck(ret) {
    return t.ifStatement(
      t.binaryExpression( // test
        "===", // operator
        t.unaryExpression( // left
          "typeof", // operator
          ret, // argument
          true, // prefix
        ),
        t.stringLiteral("object"), // right
      ),
      t.returnStatement( // consequent
        t.memberExpression( // argument
          ret, // object
          t.identifier("v"), // property
          false, // computed
        )
      )
    );
  }

  function isBlockScoped(node) {
    if (!t.isVariableDeclaration(node)) return false;
    if (node[t.BLOCK_SCOPED_SYMBOL]) return true;
    if (node.kind !== "let" && node.kind !== "const") return false;
    return true;
  }

  /**
   * If there is a loop ancestor closer than the closest function, we
   * consider ourselves to be in a loop.
   */
  function isInLoop(path) {
    let loopOrFunctionParent = path.find(
      path => path.isLoop() || path.isFunction(),
    );

    return loopOrFunctionParent && loopOrFunctionParent.isLoop();
  }

  function convertBlockScopedToVar(path, node, parent, scope, moveBindingsToParent = false) {
    if (!node) {
      node = path.node;
    }
    // https://github.com/babel/babel/issues/255
    if (isInLoop(path) && !t.isFor(parent)) {
      for (let i = 0; i < node.declarations.length; i++) {
        let declar = node.declarations[i];
        declar.init = declar.init || scope.buildUndefinedNode();
      }
    }

    node[t.BLOCK_SCOPED_SYMBOL] = true;
    node.kind = "var";

    // Move bindings from current block scope to function scope.
    if (moveBindingsToParent) {
      let parentScope = scope.getFunctionParent() || scope.getProgramParent();
      for (let name of Object.keys(path.getBindingIdentifiers())) {
        let binding = scope.getOwnBinding(name);
        if (binding) binding.kind = "var";
        scope.moveBindingTo(name, parentScope);
      }
    }
  }

  function isVar(node) {
    return t.isVariableDeclaration(node, { kind: "var" }) && !isBlockScoped(node);
  }

  let letReferenceBlockVisitor = {
    Loop: {
      enter(path, state) {
        state.loopDepth++;
      },
      exit(path, state) {
        state.loopDepth--;
      },
    },
    Function(path, state) {
      // References to block-scoped variables only require added closures if it's
      // possible for the code to run more than once -- otherwise it is safe to
      // simply rename the variables.
      if (state.loopDepth > 0) {
        path.traverse(letReferenceFunctionVisitor, state);
      }
      return path.skip();
    }
  };

  let letReferenceFunctionVisitor = {
    ReferencedIdentifier(path, state) {
      let ref = state.letReferences[path.node.name];

      // not a part of our scope
      if (!ref) return;

      // this scope has a variable with the same name so it couldn"t belong
      // to our let scope
      let localBinding = path.scope.getBindingIdentifier(path.node.name);
      if (localBinding && localBinding !== ref) return;

      state.closurify = true;
    }
  };

  let hoistVarDeclarationsVisitor = {
    enter(path, self) {
      let { node, parent } = path;

      if (path.isForStatement()) {
        if (isVar(node.init, node)) {
          let nodes = self.pushDeclar(node.init, true);
          if (nodes.length === 1) {
            node.init = nodes[0];
          } else {
            node.init = t.sequenceExpression(nodes);
          }
        }
      } else if (path.isFor()) {
        if (isVar(node.left, node)) {
          self.pushDeclar(node.left);
          node.left = node.left.declarations[0].id;
        }
      } else if (isVar(node, parent)) {
        path.replaceWithMultiple(self.pushDeclar(node).map(expr => t.expressionStatement(expr)));
      } else if (path.isFunction()) {
        return path.skip();
      }
    }
  };

  let loopLabelVisitor = {
    LabeledStatement({ node }, state) {
      state.innerLabels.push(node.label.name);
    }
  };

  let continuationVisitor = {
    enter(path, state) {
      if (path.isAssignmentExpression() || path.isUpdateExpression()) {
        let bindings = path.getBindingIdentifiers();
        for (let name in bindings) {
          if (state.outsideReferences[name] !== path.scope.getBindingIdentifier(name)) continue;
          state.reassignments[name] = true;
        }
      } else if (path.isReturnStatement()) {
        state.returnStatements.push(path);
      }
    },
  };

  function loopNodeTo(node) {
    if (t.isBreakStatement(node)) {
      return "break";
    } else if (t.isContinueStatement(node)) {
      return "continue";
    }
  }

  let loopVisitor = {
    Loop(path, state) {
      let oldIgnoreLabeless = state.ignoreLabeless;
      state.ignoreLabeless = true;
      path.traverse(loopVisitor, state);
      state.ignoreLabeless = oldIgnoreLabeless;
      path.skip();
    },

    Function(path) {
      path.skip();
    },

    SwitchCase(path, state) {
      let oldInSwitchCase = state.inSwitchCase;
      state.inSwitchCase = true;
      path.traverse(loopVisitor, state);
      state.inSwitchCase = oldInSwitchCase;
      path.skip();
    },

    "BreakStatement|ContinueStatement|ReturnStatement"(path, state) {
      let { node, parent, scope } = path;
      if (node[this.LOOP_IGNORE]) return;

      let replace;
      let loopText = loopNodeTo(node);

      if (loopText) {
        if (node.label) {
          // we shouldn't be transforming this because it exists somewhere inside
          if (state.innerLabels.indexOf(node.label.name) >= 0) {
            return;
          }

          loopText = `${loopText}|${node.label.name}`;
        } else {
          // we shouldn't be transforming these statements because
          // they don"t refer to the actual loop we're scopifying
          if (state.ignoreLabeless) return;

          //
          // if (state.inSwitchCase) return;

          // break statements mean something different in this context
          if (t.isBreakStatement(node) && state.inSwitchCase) return;
        }

        state.hasBreakContinue = true;
        state.map[loopText] = node;
        replace = t.stringLiteral(loopText);
      }

      if (path.isReturnStatement()) {
        state.hasReturn = true;
        replace = t.objectExpression([
          t.objectProperty(t.identifier("v"), node.argument || scope.buildUndefinedNode())
        ]);
      }

      /* istanbul ignore else  */
      if (replace) {
        replace = t.returnStatement(replace);
        replace[this.LOOP_IGNORE] = true;
        path.skip();
        path.replaceWith(t.inherits(replace, node));
      }
    }
  };

  class BlockScoping {
    constructor(loopPath, blockPath, parent, scope, file) {
      this.parent = parent;
      this.scope  = scope;
      this.file   = file;

      this.blockPath = blockPath;
      this.block     = blockPath.node;

      this.outsideLetReferences = Object.create(null);
      this.hasLetReferences     = false;
      this.letReferences        = Object.create(null);
      this.body                 = [];

      if (loopPath) {
        this.loopParent = loopPath.parent;
        this.loopLabel  = t.isLabeledStatement(this.loopParent) && this.loopParent.label;
        this.loopPath   = loopPath;
        this.loop       = loopPath.node;
      }
    }

    /**
     * Start the ball rolling.
     */

    run() {
      let block = this.block;
      if (block._letDone) return;
      block._letDone = true;

      let needsClosure = this.getLetReferences();

      // this is a block within a `Function/Program` so we can safely leave it be
      if (t.isFunction(this.parent) || t.isProgram(this.block)) {
        this.updateScopeInfo();
        return;
      }

      // we can skip everything
      if (!this.hasLetReferences) return;

      if (needsClosure) {
        this.wrapClosure();
      } else {
        this.remap();
      }

      this.updateScopeInfo(needsClosure);

      if (this.loopLabel && !t.isLabeledStatement(this.loopParent)) {
        return t.labeledStatement(this.loopLabel, this.loop);
      }
    }

    updateScopeInfo(wrappedInClosure) {
      let scope = this.scope;

      let parentScope = scope.getFunctionParent() || scope.getProgramParent();
      let letRefs = this.letReferences;

      for (let key of Object.keys(letRefs)) {
        let ref = letRefs[key];
        let binding = scope.getBinding(ref.name);
        if (!binding) continue;
        if (binding.kind === "let" || binding.kind === "const") {
          binding.kind = "var";

          if (wrappedInClosure) {
            scope.removeBinding(ref.name);
          } else {
            scope.moveBindingTo(ref.name, parentScope);
          }
        }
      }
    }

    remap() {
      let letRefs = this.letReferences;
      let outsideLetRefs = this.outsideLetReferences;
      let scope = this.scope;
      let blockPathScope = this.blockPath.scope;

      // alright, so since we aren"t wrapping this block in a closure
      // we have to check if any of our let variables collide with
      // those in upper scopes and then if they do, generate a uid
      // for them and replace all references with it

      for (let key of Object.keys(letRefs)) {
        // just an Identifier node we collected in `getLetReferences`
        // this is the defining identifier of a declaration
        let ref = letRefs[key];

        // todo: could skip this if the colliding binding is in another function
        if (scope.parentHasBinding(key) || scope.hasGlobal(key)) {
          // The same identifier might have been bound separately in the block scope and
          // the enclosing scope (e.g. loop or catch statement), so we should handle both
          // individually
          if (scope.hasOwnBinding(key)) {
            scope.rename(ref.name);
          }

          if (blockPathScope.hasOwnBinding(key)) {
            blockPathScope.rename(ref.name);
          }
        }
      }

      for (let key of Object.keys(outsideLetRefs)) {
        let ref = letRefs[key];
        // check for collisions with a for loop's init variable and the enclosing scope's bindings
        // https://github.com/babel/babel/issues/8498
        if (isInLoop(this.blockPath) && blockPathScope.hasOwnBinding(key)) {
          blockPathScope.rename(ref.name);
        }
      }
    }

    wrapClosure() {
      let block = this.block;

      let outsideRefs = this.outsideLetReferences;

      // remap loop heads with colliding variables
      if (this.loop) {
        for (let name of Object.keys(outsideRefs)) {
          let id = outsideRefs[name];

          if (this.scope.hasGlobal(id.name) || this.scope.parentHasBinding(id.name)) {
            delete outsideRefs[id.name];
            delete this.letReferences[id.name];

            this.scope.rename(id.name);

            this.letReferences[id.name] = id;
            outsideRefs[id.name] = id;
          }
        }
      }

      // if we're inside of a for loop then we search to see if there are any
      // `break`s, `continue`s, `return`s etc
      this.has = this.checkLoop();

      // hoist let references to retain scope
      this.hoistVarDeclarations();

      // turn outsideLetReferences into an array
      let args = Object.values(outsideRefs).map(id => t.cloneNode(id));
      let params = args.map(id => t.cloneNode(id));

      let isSwitch = this.blockPath.isSwitchStatement();

      // build the closure that we're going to wrap the block with, possible wrapping switch(){}
      let fn = t.functionExpression(
        null,
        params,
        t.blockStatement(isSwitch ? [block] : block.body),
      );

      // continuation
      this.addContinuations(fn);

      let call = t.callExpression(t.nullLiteral(), args);
      let basePath = ".callee";

      // handle generators
      let hasYield = traverse.hasType(fn.body, this.scope, "YieldExpression", t.FUNCTION_TYPES);

      if (hasYield) {
        fn.generator = true;
        call = t.yieldExpression(call, true);
        basePath = ".argument" + basePath;
      }

      // handlers async functions
      let hasAsync = traverse.hasType(fn.body, this.scope, "AwaitExpression", t.FUNCTION_TYPES);

      if (hasAsync) {
        fn.async = true;
        call = t.awaitExpression(call);
        basePath = ".argument" + basePath;
      }

      let placeholderPath;
      let index;
      if (this.has.hasReturn || this.has.hasBreakContinue) {
        let ret = this.scope.generateUid("ret");

        this.body.push(
          t.variableDeclaration("var", [
            t.variableDeclarator(t.identifier(ret), call),
          ]),
        );
        placeholderPath = "declarations.0.init" + basePath;
        index = this.body.length - 1;

        this.buildHas(t.identifier(ret));
      } else {
        this.body.push(t.expressionStatement(call));
        placeholderPath = "expression" + basePath;
        index = this.body.length - 1;
      }

      let callPath;
      // replace the current block body with the one we're going to build
      if (isSwitch) {
        let { parentPath, listKey, key } = this.blockPath;

        this.blockPath.replaceWithMultiple(this.body);
        callPath = parentPath.get(listKey)[key + index];
      } else {
        block.body = this.body;
        callPath = this.blockPath.get("body")[index];
      }

      let placeholder = callPath.get(placeholderPath);

      let fnPath;
      if (this.loop) {
        let loopId = this.scope.generateUid("loop");
        let p = this.loopPath.insertBefore(
          t.variableDeclaration("var", [
            t.variableDeclarator(t.identifier(loopId), fn),
          ]),
        );

        placeholder.replaceWith(t.identifier(loopId));
        fnPath = p[0].get("declarations.0.init");
      } else {
        placeholder.replaceWith(fn);
        fnPath = placeholder;
      }

      // Ensure "this", "arguments", and "super" continue to work in the wrapped function.
      fnPath.unwrapFunctionEnvironment();
    }

    /**
     * If any of the outer let variables are reassigned then we need to rename them in
     * the closure so we can get direct access to the outer variable to continue the
     * iteration with bindings based on each iteration.
     *
     * Reference: https://github.com/babel/babel/issues/1078
     */

    addContinuations(fn) {
      let state = {
        reassignments: {},
        returnStatements: [],
        outsideReferences: this.outsideLetReferences,
      };

      this.scope.traverse(fn, continuationVisitor, state);

      for (let i = 0; i < fn.params.length; i++) {
        let param = fn.params[i];
        if (!state.reassignments[param.name]) continue;

        let paramName = param.name;
        let newParamName = this.scope.generateUid(param.name);
        fn.params[i] = t.identifier(newParamName);

        this.scope.rename(paramName, newParamName, fn);

        state.returnStatements.forEach(returnStatement => {
          returnStatement.insertBefore(
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.identifier(paramName),
                t.identifier(newParamName),
              ),
            ),
          );
        });

        // assign outer reference as it's been modified internally and needs to be retained
        fn.body.body.push(
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.identifier(paramName),
              t.identifier(newParamName),
            ),
          ),
        );
      }
    }

    getLetReferences() {
      let block = this.block;

      let declarators = [];

      if (this.loop) {
        let init = this.loop.left || this.loop.init;
        if (isBlockScoped(init)) {
          declarators.push(init);
          extend(this.outsideLetReferences, t.getBindingIdentifiers(init));
        }
      }

      let addDeclarationsFromChild = (path, node) => {
        node = node || path.node;
        if (
          t.isClassDeclaration(node) ||
          t.isFunctionDeclaration(node) ||
          isBlockScoped(node)
        ) {
          if (isBlockScoped(node)) {
            convertBlockScopedToVar(path, node, block, this.scope);
          }
          declarators = declarators.concat(node.declarations || node);
        }
        if (t.isLabeledStatement(node)) {
          addDeclarationsFromChild(path.get("body"), node.body);
        }
      };

      if (block.body) {
        let declarPaths = this.blockPath.get("body");
        for (let i = 0; i < block.body.length; i++) {
          addDeclarationsFromChild(declarPaths[i]);
        }
      }

      if (block.cases) {
        let declarPaths = this.blockPath.get("cases");
        for (let i = 0; i < block.cases.length; i++) {
          let consequents = block.cases[i].consequent;

          for (let j = 0; j < consequents.length; j++) {
            let declar = consequents[j];
            addDeclarationsFromChild(declarPaths[i], declar);
          }
        }
      }

      for (let i = 0; i < declarators.length; i++) {
        let declar = declarators[i];
        // Passing true as the third argument causes t.getBindingIdentifiers
        // to return only the *outer* binding identifiers of this
        // declaration, rather than (for example) mistakenly including the
        // parameters of a function declaration. Fixes #4880.
        let keys = t.getBindingIdentifiers(declar, false, true);
        extend(this.letReferences, keys);
        this.hasLetReferences = true;
      }

      // no let references so we can just quit
      if (!this.hasLetReferences) return;

      let state = {
        letReferences: this.letReferences,
        closurify:     false,
        loopDepth:     0,
        file:          this.file
      };

      if (isInLoop(this.blockPath)) {
        state.loopDepth++;
      }

      // traverse through this block, stopping on functions and checking if they
      // contain any local let references
      this.blockPath.traverse(letReferenceBlockVisitor, state);

      return state.closurify;
    }

    /**
     * If we're inside of a loop then traverse it and check if it has one of
     * the following node types `ReturnStatement`, `BreakStatement`,
     * `ContinueStatement` and replace it with a return value that we can track
     * later on.
     */

    checkLoop() {
      let state = {
        hasBreakContinue: false,
        ignoreLabeless:   false,
        inSwitchCase:     false,
        innerLabels:      [],
        hasReturn:        false,
        isLoop:           !!this.loop,
        map:              {},
        LOOP_IGNORE:      Symbol(),
      };

      this.blockPath.traverse(loopLabelVisitor, state);
      this.blockPath.traverse(loopVisitor, state);

      return state;
    }

    /**
     * Hoist all let declarations in this block to before it so they retain scope
     * once we wrap everything in a closure.
     */

    hoistVarDeclarations() {
      this.blockPath.traverse(hoistVarDeclarationsVisitor, this);
    }

    /**
     * Turn a `VariableDeclaration` into an array of `AssignmentExpressions` with
     * their declarations hoisted to before the closure wrapper.
     */

    pushDeclar(node) {
      let declars = [];
      let names = t.getBindingIdentifiers(node);
      for (let name of Object.keys(names)) {
        declars.push(t.variableDeclarator(names[name]));
      }

      this.body.push(t.variableDeclaration(node.kind, declars));

      let replace = [];

      for (let i = 0; i < node.declarations.length; i++) {
        let declar = node.declarations[i];
        if (!declar.init) continue;

        let expr = t.assignmentExpression("=", declar.id, declar.init);
        replace.push(t.inherits(expr, declar));
      }

      return replace;
    }

    buildHas(ret) {
      let body = this.body;
      let retCheck;
      let has = this.has;
      let cases = [];

      if (has.hasReturn) {
        retCheck = buildRetCheck(ret);
      }

      if (has.hasBreakContinue) {
        for (let key in has.map) {
          cases.push(t.switchCase(t.stringLiteral(key), [has.map[key]]));
        }

        if (has.hasReturn) {
          cases.push(t.switchCase(null, [retCheck]));
        }

        if (cases.length === 1) {
          let single = cases[0];
          body.push(t.ifStatement(
            t.binaryExpression("===", ret, single.test),
            single.consequent[0]
          ));
        } else {
          if (this.loop) {
            // https://github.com/babel/babel/issues/998
            for (let i = 0; i < cases.length; i++) {
              let caseConsequent = cases[i].consequent[0];
              if (t.isBreakStatement(caseConsequent) && !caseConsequent.label) {
                if (!this.loopLabel) {
                  this.loopLabel = this.scope.generateUidIdentifier("loop");
                }
                caseConsequent.label = t.cloneNode(this.loopLabel);
              }
            }
          }

          body.push(t.switchStatement(ret, cases));
        }
      } else {
        if (has.hasReturn) {
          body.push(retCheck);
        }
      }
    }
  }

  function extend(target, ...sources) {
    let source = [];
    sources.forEach(src => {
      source = source.concat([src, Object.getPrototypeOf(src)]);
    });
    return Object.assign(target, ...source);
  }

  return {
    visitor: {
      VariableDeclaration(path, file) {
        let { node, parent, scope } = path;
        if (!isBlockScoped(node)) return;
        convertBlockScopedToVar(path, null, parent, scope, true);
      },

      Loop(path, file) {
        let { node, parent, scope } = path;
        t.ensureBlock(node);
        let blockScoping = new BlockScoping(path, path.get("body"), parent, scope, file);
        let replace = blockScoping.run();
        if (replace) path.replaceWith(replace);
      },

      CatchClause(path, file) {
        let { node, parent, scope } = path;
        t.ensureBlock(node);
        let blockScoping = new BlockScoping(path, path.get("body"), parent, scope, file);
        blockScoping.run();
      },

      "BlockStatement|SwitchStatement|Program"(path, file) {
        if (!ignoreBlock(path)) {
          let blockScoping = new BlockScoping(null, path, path.parent, path.scope, file);
          blockScoping.run();
        }
      }
    }
  };
}
