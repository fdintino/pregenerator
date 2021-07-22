/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

import assert from "assert";
import type * as K from "@pregenerator/ast-types/gen/kinds";
import {
  namedTypes as n,
  builders as b,
  visit,
  NodePath as ASTNodePath,
} from "@pregenerator/ast-types";
import type { NodePath } from "@pregenerator/ast-types/lib/node-path";
import clone from "lodash.clone";
import cloneDeep from "lodash.clonedeep";
import * as leap from "./leap";
import * as meta from "./meta";
import { runtimeProperty, isReference } from "./util";

type Loc = n.Literal & { value: number };

const hasOwn = Object.prototype.hasOwnProperty;

// See comment above re: alreadyEnded.
function isSwitchCaseEnder(stmt: K.StatementKind) {
  return (
    n.BreakStatement.check(stmt) ||
    n.ContinueStatement.check(stmt) ||
    n.ReturnStatement.check(stmt) ||
    n.ThrowStatement.check(stmt)
  );
}

function getDeclError(node: K.DeclarationKind | n.Declaration) {
  return new Error(
    "all declarations should have been transformed into " +
      "assignments before the Exploder began its work: " +
      JSON.stringify(node)
  );
}

type AbruptCompletionRecord =
  | {
      type: "break" | "continue";
      target: n.Literal;
    }
  | {
      type: "return" | "throw";
      value: K.ExpressionKind | null | undefined;
    };

function assertIsValidAbruptCompletion(
  record: Record<string, unknown>
): asserts record is AbruptCompletionRecord {
  const type = record.type;
  let isValid;

  assert.notStrictEqual(type, "normal", "normal completions are not abrupt");
  if (type === "break" || type === "continue") {
    isValid = !hasOwn.call(record, "value") && n.Literal.check(record.target);
  } else if (type === "return" || type === "throw") {
    isValid = hasOwn.call(record, "value") && !hasOwn.call(record, "target");
  } else {
    isValid = false;
  }

  if (!isValid) {
    assert.ok(false, "invalid completion record: " + JSON.stringify(record));
  }
}

// function assertIsLoc(node: Record<string, unknown>): node is Loc {
//   n.assertLiteral(node);
//   assert.ok(typeof node.value === "number");
// }

export class Emitter {
  nextTempId: number;
  contextId: n.Identifier;
  listing: K.StatementKind[];
  marked: Array<boolean | undefined>;
  insertedLocs: Set<Loc>;
  finalLoc: Loc;
  tryEntries: leap.TryEntry[];
  leapManager: leap.LeapManager;

  constructor(contextId: n.Identifier) {
    assert.ok(this instanceof Emitter);
    n.assertIdentifier(contextId);

    // Used to generate unique temporary names.
    this.nextTempId = 0;

    // In order to make sure the context object does not collide with
    // anything in the local scope, we might have to rename it, so we
    // refer to it symbolically instead of just assuming that it will be
    // called "context".
    this.contextId = contextId;

    // An append-only list of Statements that grows each time this.emit is
    // called.
    this.listing = [];

    // A sparse array whose keys correspond to locations in this.listing
    // that have been marked as branch/jump targets.
    this.marked = [true];

    this.insertedLocs = new Set();

    // The last location will be marked when this.getDispatchLoop is
    // called.
    this.finalLoc = this.loc();

    // A list of all leap.TryEntry statements emitted.
    this.tryEntries = [];

    // Each time we evaluate the body of a loop, we tell this.leapManager
    // to enter a nested loop context that determines the meaning of break
    // and continue statements therein.
    this.leapManager = new leap.LeapManager(this);
  }

  // Offsets into this.listing that could be used as targets for branches or
  // jumps are represented as numeric Literal nodes. This representation has
  // the amazingly convenient benefit of allowing the exact value of the
  // location to be determined at any time, even after generating code that
  // refers to the location.
  loc(): Loc {
    const l = b.literal(-1) as Loc;
    this.insertedLocs.add(l);
    return l;
  }

  getInsertedLocs(): Set<Loc> {
    return this.insertedLocs;
  }

  getContextId(): n.Identifier {
    return clone(this.contextId);
  }

  // Sets the exact value of the given location to the offset of the next
  // Statement emitted.
  mark(loc: Loc): Loc {
    n.assertLiteral(loc);
    const index = this.listing.length;
    if (loc.value === -1) {
      loc.value = index;
    } else {
      // Locations can be marked redundantly, but their values cannot change
      // once set the first time.
      assert.strictEqual(loc.value, index);
    }
    this.marked[index] = true;
    return loc;
  }

  emit(node: K.ExpressionKind | K.StatementKind): void {
    let stmt;
    if (n.Expression.check(node)) {
      stmt = b.expressionStatement(node as K.ExpressionKind);
    } else {
      n.assertStatement(node);
      stmt = node;
    }
    // const stmt = n.Expression.check(node) ? b.expressionStatement(node) : node;
    n.assertStatement(stmt);
    this.listing.push(stmt);
  }

  // Shorthand for emitting assignment statements. This will come in handy
  // for assignments to temporary variables.
  emitAssign<T extends K.LValKind>(
    lhs: T,
    rhs: K.ExpressionKind
  ): T {
    this.emit(this.assign(lhs, rhs));
    return lhs;
  }

  // Shorthand for an assignment statement.
  assign(
    lhs: K.LValKind,
    rhs: K.ExpressionKind
  ): n.ExpressionStatement {
    return b.expressionStatement(
      b.assignmentExpression("=", cloneDeep(lhs), rhs)
    );
  }

  contextProperty(
    name: string,
    computed?: false
  ): n.MemberExpression & {
    object: n.Identifier;
    property: n.Identifier;
    computed: false;
  };

  contextProperty(
    name: string,
    computed: true
  ): n.MemberExpression & {
    object: n.Identifier;
    property: n.Literal;
    computed: true;
  };

  // Convenience function for generating expressions like context.next,
  // context.sent, and context.rval.
  contextProperty(name: string, computed = false): any {
    return b.memberExpression(
      this.contextId,
      computed ? b.literal(name) : b.identifier(name),
      !!computed
    );
  }

  // Shorthand for setting context.rval and jumping to `context.stop()`.
  stop(rval?: NodePath | null): void {
    if (rval) {
      this.setReturnValue(rval);
    }

    this.jump(this.finalLoc);
  }

  setReturnValue(valuePath: NodePath): void {
    n.assertExpression(valuePath.node);

    this.emitAssign(
      this.contextProperty("rval"),
      this.explodeExpression(valuePath)
    );
  }

  clearPendingException(
    tryLoc: Loc,
    assignee?: n.MemberExpression | null
  ): void {
    n.assertLiteral(tryLoc);

    const catchCall = b.callExpression(this.contextProperty("catch", true), [
      clone(tryLoc),
    ]);

    if (assignee) {
      this.emitAssign(assignee, catchCall);
    } else {
      this.emit(catchCall);
    }
  }

  // Emits code for an unconditional jump to the given location, even if the
  // exact value of the location is not yet known.
  jump(toLoc: Loc | K.ExpressionKind): void {
    this.emitAssign(this.contextProperty("next"), toLoc);
    this.emit(b.breakStatement());
  }

  // Conditional jump.
  jumpIf(test: K.ExpressionKind, toLoc: Loc): void {
    n.assertExpression(test);
    n.assertLiteral(toLoc);

    this.emit(
      b.ifStatement(
        test,
        b.blockStatement([
          this.assign(this.contextProperty("next"), toLoc),
          b.breakStatement(),
        ])
      )
    );
  }

  // Conditional jump, with the condition negated.
  jumpIfNot(test: K.ExpressionKind, toLoc: Loc): void {
    n.assertExpression(test);
    n.assertLiteral(toLoc);

    let negatedTest;
    if (n.UnaryExpression.check(test) && test.operator === "!") {
      // Avoid double negation.
      negatedTest = test.argument;
    } else {
      negatedTest = b.unaryExpression("!", test);
    }

    this.emit(
      b.ifStatement(
        negatedTest,
        b.blockStatement([
          this.assign(this.contextProperty("next"), toLoc),
          b.breakStatement(),
        ])
      )
    );
  }

  // Returns a unique MemberExpression that can be used to store and
  // retrieve temporary values. Since the object of the member expression is
  // the context object, which is presumed to coexist peacefully with all
  // other local variables, and since we just increment `nextTempId`
  // monotonically, uniqueness is assured.
  makeTempVar(): n.MemberExpression & {
    object: n.Identifier;
    property: n.Identifier;
    computed: false;
  } {
    return this.contextProperty("t" + this.nextTempId++);
  }

  getContextFunction(id: n.Identifier | null): n.FunctionExpression {
    return b.functionExpression(
      id || null /*Anonymous*/,
      [this.contextId],
      b.blockStatement([this.getDispatchLoop()]),
      false, // Not a generator anymore!
      false // Nor an expression.
    );
  }

  // Turns this.listing into a loop of the form
  //
  //   while (1) switch (context.next) {
  //   case 0:
  //   ...
  //   case n:
  //     return context.stop();
  //   }
  //
  // Each marked location in this.listing will correspond to one generated
  // case statement.
  getDispatchLoop(): n.WhileStatement {
    const cases = [];
    let current;

    // If we encounter a break, continue, or return statement in a switch
    // case, we can skip the rest of the statements until the next case.
    let alreadyEnded = false;

    this.listing.forEach((stmt, i) => {
      if (hasOwn.call(this.marked, i)) {
        cases.push(b.switchCase(b.literal(i), (current = [])));
        alreadyEnded = false;
      }

      if (!alreadyEnded) {
        current.push(stmt);
        if (isSwitchCaseEnder(stmt)) alreadyEnded = true;
      }
    });

    // Now that we know how many statements there will be in this.listing,
    // we can finally resolve this.finalLoc.value.
    this.finalLoc.value = this.listing.length;

    cases.push(
      b.switchCase(this.finalLoc, [
        // Intentionally fall through to the "end" case...
      ]),

      // So that the runtime can jump to the final location without having
      // to know its offset, we provide the "end" case as a synonym.
      b.switchCase(b.literal("end"), [
        // This will check/clear both context.thrown and context.rval.
        b.returnStatement(b.callExpression(this.contextProperty("stop"), [])),
      ])
    );

    return b.whileStatement(
      b.literal(1),
      b.switchStatement(
        b.assignmentExpression(
          "=",
          this.contextProperty("prev"),
          this.contextProperty("next")
        ),
        cases
      )
    );
  }

  getTryLocsList(): n.ArrayExpression | null {
    if (this.tryEntries.length === 0) {
      // To avoid adding a needless [] to the majority of runtime.wrap
      // argument lists, force the caller to handle this case specially.
      return null;
    }

    let lastLocValue = 0;

    return b.arrayExpression(
      this.tryEntries.map((tryEntry) => {
        const thisLocValue = tryEntry.firstLoc.value;
        assert.ok(thisLocValue >= lastLocValue, "try entries out of order");
        lastLocValue = thisLocValue;

        const ce = tryEntry.catchEntry;
        const fe = tryEntry.finallyEntry;

        const locs = [
          tryEntry.firstLoc,
          // The null here makes a hole in the array.
          ce ? ce.firstLoc : null,
        ];

        if (fe) {
          locs[2] = fe.firstLoc;
          locs[3] = fe.afterLoc;
        }

        return b.arrayExpression(locs.map((loc) => loc && clone(loc)));
      })
    );
  }

  // All side effects must be realized in order.

  // If any subexpression harbors a leap, all subexpressions must be
  // neutered of side effects.

  // No destructive modification of AST nodes.

  explode(path: NodePath, ignoreResult?: boolean): void {
    assert.ok(path instanceof ASTNodePath);

    const { node } = path;

    n.assertNode(node);

    if (n.Statement.check(node)) {
      this.explodeStatement(path);
      return;
    }

    if (n.Expression.check(node)) {
      if (ignoreResult) {
        this.explodeExpression(path, true);
      } else {
        this.explodeExpression(path, false);
      }
      return;
    }

    if (n.Declaration.check(node)) throw getDeclError(node);

    switch (node.type) {
      case "Program":
        path.get("body").map(this.explodeStatement, this);
        return;

      case "VariableDeclarator":
        throw getDeclError(node);

      // These node types should be handled by their parent nodes
      // (ObjectExpression, SwitchStatement, and TryStatement, respectively).
      case "Property":
      case "ObjectProperty":
      case "ObjectMethod":
      case "SwitchCase":
      case "CatchClause":
        throw new Error(
          node.type + " nodes should be handled by their parents"
        );

      default:
        throw new Error("unknown Node of type " + JSON.stringify(node.type));
    }
  }

  explodeStatement(path: NodePath, labelId?: n.Identifier | null): void {
    assert.ok(path instanceof ASTNodePath);

    const stmt = path.node;
    // let before, after, head;
    let before: Loc | undefined;
    let after: Loc | undefined;
    let head: Loc | undefined;

    n.assertStatement(stmt);

    if (labelId) {
      n.assertIdentifier(labelId);
    } else {
      labelId = null;
    }

    // Explode BlockStatement nodes even if they do not contain a yield,
    // because we don't want or need the curly braces.
    if (n.BlockStatement.check(stmt)) {
      path.get("body").each(this.explodeStatement, this);
      return;
    }

    if (!meta.containsLeap(stmt)) {
      // Technically we should be able to avoid emitting the statement
      // altogether if !meta.hasSideEffects(stmt), but that leads to
      // confusing generated code (for instance, `while (true) {}` just
      // disappears) and is probably a more appropriate job for a dedicated
      // dead code elimination pass.
      this.emit(stmt);
      return;
    }

    switch (stmt.type) {
      case "ExpressionStatement":
        this.explodeExpression(path.get("expression"), true);
        break;

      case "LabeledStatement":
        after = this.loc();

        // Did you know you can break from any labeled block statement or
        // control structure? Well, you can! Note: when a labeled loop is
        // encountered, the leap.LabeledEntry created here will immediately
        // enclose a leap.LoopEntry on the leap manager's stack, and both
        // entries will have the same label. Though this works just fine, it
        // may seem a bit redundant. In theory, we could check here to
        // determine if stmt knows how to handle its own label; for example,
        // stmt happens to be a WhileStatement and so we know it's going to
        // establish its own LoopEntry when we explode it (below). Then this
        // LabeledEntry would be unnecessary. Alternatively, we might be
        // tempted not to pass stmt.label down into this.explodeStatement,
        // because we've handled the label here, but that's a mistake because
        // labeled loops may contain labeled continue statements, which is not
        // something we can handle in this generic case. All in all, I think a
        // little redundancy greatly simplifies the logic of this case, since
        // it's clear that we handle all possible LabeledStatements correctly
        // here, regardless of whether they interact with the leap manager
        // themselves. Also remember that labels and break/continue-to-label
        // statements are rare, and all of this logic happens at transform
        // time, so it has no additional runtime cost.
        this.leapManager.withEntry(
          new leap.LabeledEntry(after, stmt.label),
          () => {
            this.explodeStatement(path.get("body"), stmt.label || null);
          }
        );

        this.mark(after);

        break;

      case "WhileStatement":
        before = this.loc();
        after = this.loc();

        this.mark(before);
        this.jumpIfNot(this.explodeExpression(path.get("test")), after);
        this.leapManager.withEntry(
          new leap.LoopEntry(after, before, labelId),
          () => {
            this.explodeStatement(path.get("body"));
          }
        );
        this.jump(before);
        this.mark(after);

        break;

      case "DoWhileStatement": {
        const first = this.loc();
        const test = this.loc();
        after = this.loc();

        this.mark(first);
        this.leapManager.withEntry(
          new leap.LoopEntry(after, test, labelId),
          () => {
            this.explode(path.get("body"));
          }
        );
        this.mark(test);
        this.jumpIf(this.explodeExpression(path.get("test")), first);
        this.mark(after);

        break;
      }

      case "ForStatement": {
        head = this.loc();
        const update = this.loc();
        after = this.loc();

        if (stmt.init) {
          // We pass true here to indicate that if stmt.init is an expression
          // then we do not care about its result.
          this.explode(path.get("init"), true);
        }

        this.mark(head);

        if (stmt.test) {
          this.jumpIfNot(this.explodeExpression(path.get("test")), after);
        } else {
          // No test means continue unconditionally.
        }

        this.leapManager.withEntry(
          new leap.LoopEntry(after, update, labelId),
          () => {
            this.explodeStatement(path.get("body"));
          }
        );

        this.mark(update);

        if (stmt.update) {
          // We pass true here to indicate that if stmt.update is an
          // expression then we do not care about its result.
          this.explode(path.get("update"), true);
        }

        this.jump(head);

        this.mark(after);

        break;
      }

      case "ForInStatement": {
        head = this.loc();
        after = this.loc();

        const keyIterNextFn = this.makeTempVar();
        this.emitAssign(
          keyIterNextFn,
          b.callExpression(runtimeProperty("keys"), [
            this.explodeExpression(path.get("right")),
          ])
        );

        this.mark(head);

        const keyInfoTmpVar = this.makeTempVar();
        this.jumpIf(
          b.memberExpression(
            b.assignmentExpression(
              "=",
              keyInfoTmpVar,
              b.callExpression(cloneDeep(keyIterNextFn), [])
            ),
            b.identifier("done"),
            false
          ),
          after
        );

        n.assertLVal(stmt.left);
        this.emitAssign(
          stmt.left,
          b.memberExpression(
            cloneDeep(keyInfoTmpVar),
            b.identifier("value"),
            false
          )
        );

        this.leapManager.withEntry(
          new leap.LoopEntry(after, head, labelId),
          () => {
            this.explodeStatement(path.get("body"));
          }
        );

        this.jump(head);

        this.mark(after);

        break;
      }

      case "BreakStatement":
        this.emitAbruptCompletion({
          type: "break",
          target: this.leapManager.getBreakLoc(stmt.label || null),
        });

        break;

      case "ContinueStatement":
        this.emitAbruptCompletion({
          type: "continue",
          target: this.leapManager.getContinueLoc(stmt.label || null),
        });

        break;

      case "SwitchStatement": {
        // Always save the discriminant into a temporary variable in case the
        // test expressions overwrite values like context.sent.
        const disc = this.emitAssign(
          this.makeTempVar(),
          this.explodeExpression(path.get("discriminant"))
        );

        after = this.loc();
        const defaultLoc = this.loc();
        let condition: K.ExpressionKind = defaultLoc;
        const caseLocs: Loc[] = [];

        // If there are no cases, .cases might be undefined.
        const cases: K.SwitchCaseKind[] = stmt.cases || [];

        for (let i = cases.length - 1; i >= 0; --i) {
          const c = cases[i];
          n.assertSwitchCase(c);

          if (c.test) {
            condition = b.conditionalExpression(
              b.binaryExpression("===", cloneDeep(disc), c.test),
              (caseLocs[i] = this.loc()),
              condition
            );
          } else {
            caseLocs[i] = defaultLoc;
          }
        }

        this.jump(
          this.explodeExpression(
            new ASTNodePath(condition, path, "discriminant")
          )
        );

        this.leapManager.withEntry(new leap.SwitchEntry(after), () => {
          path.get("cases").each((casePath: NodePath<K.SwitchCaseKind>) => {
            const i = casePath.name;

            this.mark(caseLocs[i]);

            casePath.get("consequent").each(this.explodeStatement, this);
          });
        });

        this.mark(after);
        if (defaultLoc.value === -1) {
          this.mark(defaultLoc);
          assert.strictEqual(after.value, defaultLoc.value);
        }

        break;
      }

      case "IfStatement": {
        const elseLoc = stmt.alternate && this.loc();
        after = this.loc();

        this.jumpIfNot(
          this.explodeExpression(path.get("test")),
          elseLoc || after
        );

        this.explodeStatement(path.get("consequent"));

        if (elseLoc) {
          this.jump(after);
          this.mark(elseLoc);
          this.explodeStatement(path.get("alternate"));
        }

        this.mark(after);

        break;
      }

      case "ReturnStatement":
        this.emitAbruptCompletion({
          type: "return",
          value: this.explodeExpression(path.get("argument")),
        });

        break;

      case "WithStatement":
        throw new Error(
          path.node.type + " not supported in generator functions."
        );

      case "TryStatement": {
        after = this.loc();

        const handler =
          stmt.handler || (stmt.handlers && stmt.handlers[0]) || null;

        const catchLoc = handler && this.loc();
        let catchEntry: leap.CatchEntry | null = null;
        if (catchLoc && handler) {
          n.assertIdentifier(handler.param);
          catchEntry = new leap.CatchEntry(catchLoc, handler.param);
        }

        const finallyLoc = stmt.finalizer && this.loc();
        let finallyEntry: leap.FinallyEntry | null = null;
        if (finallyLoc) {
          finallyEntry = new leap.FinallyEntry(finallyLoc, after);
        }
        // const finallyEntry =
        //   finallyLoc && new leap.FinallyEntry(finallyLoc, after);

        const tryEntry = new leap.TryEntry(
          this.getUnmarkedCurrentLoc(),
          catchEntry,
          finallyEntry
        );

        this.tryEntries.push(tryEntry);
        this.updateContextPrevLoc(tryEntry.firstLoc);

        this.leapManager.withEntry(tryEntry, () => {
          this.explodeStatement(path.get("block"));

          if (catchLoc && handler && catchEntry) {
            if (finallyLoc) {
              // If we have both a catch block and a finally block, then
              // because we emit the catch block first, we need to jump over
              // it to the finally block.
              this.jump(finallyLoc);
            } else {
              // If there is no finally block, then we need to jump over the
              // catch block to the fall-through location.
              this.jump(after as Loc);
            }

            this.updateContextPrevLoc(this.mark(catchLoc));

            const bodyPath = path.get("handler", "body");
            const safeParam = this.makeTempVar();
            this.clearPendingException(tryEntry.firstLoc, safeParam);

            const catchScope = n.BlockStatement.check(bodyPath.scope.node)
              ? bodyPath.scope.parent
              : bodyPath.scope;
            n.assertIdentifier(handler.param);
            const catchParamName = handler.param.name;
            n.assertCatchClause(catchScope.node);
            assert.strictEqual(catchScope.lookup(catchParamName), catchScope);

            visit(bodyPath, {
              visitIdentifier(path) {
                if (
                  isReference(path, catchParamName) &&
                  path.scope.lookup(catchParamName) === catchScope
                ) {
                  return cloneDeep(safeParam);
                }

                this.traverse(path);
              },

              visitFunction(path) {
                if (path.scope.declares(catchParamName)) {
                  // Don't descend into nested scopes that shadow the catch
                  // parameter with their own declarations. This isn't
                  // logically necessary because of the path.scope.lookup we
                  // do in visitIdentifier, but it saves time.
                  return false;
                }

                this.traverse(path);
              },
            });

            this.leapManager.withEntry(catchEntry, () => {
              this.explodeStatement(bodyPath);
            });
          }

          if (finallyLoc && finallyEntry) {
            this.updateContextPrevLoc(this.mark(finallyLoc));

            this.leapManager.withEntry(finallyEntry, () => {
              this.explodeStatement(path.get("finalizer"));
            });

            this.emit(
              b.returnStatement(
                b.callExpression(this.contextProperty("finish"), [
                  finallyEntry.firstLoc,
                ])
              )
            );
          }
        });

        this.mark(after);

        break;
      }

      case "ThrowStatement":
        this.emit(
          b.throwStatement(this.explodeExpression(path.get("argument")))
        );

        break;

      default:
        throw new Error(
          "unknown Statement of type " + JSON.stringify(stmt.type)
        );
    }
  }

  emitAbruptCompletion(record: Record<string, unknown>): void {
    assertIsValidAbruptCompletion(record);

    const abruptArgs: K.ExpressionKind[] = [b.literal(record.type)];

    if (record.type === "break" || record.type === "continue") {
      n.assertLiteral(record.target);
      abruptArgs[1] = this.insertedLocs.has(record.target as Loc)
        ? record.target
        : cloneDeep(record.target);
    } else if (record.type === "return" || record.type === "throw") {
      if (record.value) {
        n.assertExpression(record.value);
        abruptArgs[1] = this.insertedLocs.has(record.value as Loc)
          ? cloneDeep(record.value)
          : cloneDeep(record.value);
      }
    }

    this.emit(
      b.returnStatement(
        b.callExpression(this.contextProperty("abrupt"), abruptArgs)
      )
    );
  }

  // Not all offsets into emitter.listing are potential jump targets. For
  // example, execution typically falls into the beginning of a try block
  // without jumping directly there. This method returns the current offset
  // without marking it, so that a switch case will not necessarily be
  // generated for this offset (I say "not necessarily" because the same
  // location might end up being marked in the process of emitting other
  // statements). There's no logical harm in marking such locations as jump
  // targets, but minimizing the number of switch cases keeps the generated
  // code shorter.
  getUnmarkedCurrentLoc(): Loc {
    return b.literal(this.listing.length) as Loc;
  }

  // The context.prev property takes the value of context.next whenever we
  // evaluate the switch statement discriminant, which is generally good
  // enough for tracking the last location we jumped to, but sometimes
  // context.prev needs to be more precise, such as when we fall
  // successfully out of a try block and into a finally block without
  // jumping. This method exists to update context.prev to the freshest
  // available location. If we were implementing a full interpreter, we
  // would know the location of the current instruction with complete
  // precision at all times, but we don't have that luxury here, as it would
  // be costly and verbose to set context.prev before every statement.
  updateContextPrevLoc(loc: Loc | null): void {
    if (loc) {
      n.assertLiteral(loc);

      if (loc.value === -1) {
        // If an uninitialized location literal was passed in, set its value
        // to the current this.listing.length.
        loc.value = this.listing.length;
      } else {
        // Otherwise assert that the location matches the current offset.
        assert.strictEqual(loc.value, this.listing.length);
      }
    } else {
      loc = this.getUnmarkedCurrentLoc();
    }

    // Make sure context.prev is up to date in case we fell into this try
    // statement without jumping to it. TODO Consider avoiding this
    // assignment when we know control must have jumped here.
    this.emitAssign(this.contextProperty("prev"), loc);
  }

  explodeExpression(path: NodePath, ignoreResult: true): null | undefined;

  explodeExpression(path: NodePath, ignoreResult?: false): K.ExpressionKind;

  explodeExpression(
    path: NodePath,
    ignoreResult = false
  ): K.ExpressionKind | null | undefined {
    assert.ok(path instanceof ASTNodePath);

    const expr = path.value;
    if (expr) {
      n.assertExpression(expr);
    } else {
      return expr;
    }

    let result; // Used optionally by several cases below.

    const finish = (expr: K.ExpressionKind) => {
      n.assertExpression(expr);
      if (ignoreResult) {
        this.emit(expr);
      } else {
        return expr;
      }
    };

    // If the expression does not contain a leap, then we either emit the
    // expression as a standalone statement or return it whole.
    if (!meta.containsLeap(expr)) {
      return finish(expr);
    }

    // If any child contains a leap (such as a yield or labeled continue or
    // break statement), then any sibling subexpressions will almost
    // certainly have to be exploded in order to maintain the order of their
    // side effects relative to the leaping child(ren).
    const hasLeapingChildren = meta.containsLeapingChildren(expr);

    type IExplodeViaTempVarParam =
      | null
      | undefined
      | (n.MemberExpression & {
          object: n.Identifier;
          property: n.Identifier;
          computed: false;
        });

    // In order to save the rest of explodeExpression from a combinatorial
    // trainwreck of special cases, explodeViaTempVar is responsible for
    // deciding when a subexpression needs to be "exploded," which is my
    // very technical term for emitting the subexpression as an assignment
    // to a temporary variable and the substituting the temporary variable
    // for the original subexpression. Think of exploded view diagrams, not
    // Michael Bay movies. The point of exploding subexpressions is to
    // control the precise order in which the generated code realizes the
    // side effects of those subexpressions.
    type IExplodeViaTempVarOverload = {
      (
        tempVar: IExplodeViaTempVarParam,
        childPath: NodePath,
        ignoreChildResult?: false
      ): K.ExpressionKind;
      (
        tempVar: IExplodeViaTempVarParam,
        childPath: NodePath,
        ignoreChildResult: true
      ): void;
    };

    const explodeViaTempVar: IExplodeViaTempVarOverload = (
      tempVar:
        | null
        | undefined
        | (n.MemberExpression & {
            object: n.Identifier;
            property: n.Identifier;
            computed: false;
          }),
      childPath: NodePath,
      ignoreChildResult = false
    ): any => {
      assert.ok(childPath instanceof ASTNodePath);

      assert.ok(
        !ignoreChildResult || !tempVar,
        "Ignoring the result of a child expression but forcing it to " +
          "be assigned to a temporary variable?"
      );

      let result;
      if (ignoreChildResult) {
        this.explodeExpression(childPath, true);
      } else {
        result = this.explodeExpression(childPath, false);
      }
      // let result = this.explodeExpression(childPath, ignoreChildResult);

      if (ignoreChildResult) {
        // Side effects already emitted above.
      } else if (tempVar || (hasLeapingChildren && !n.Literal.check(result))) {
        // If tempVar was provided, then the result will always be assigned
        // to it, even if the result does not otherwise need to be assigned
        // to a temporary variable.  When no tempVar is provided, we have
        // the flexibility to decide whether a temporary variable is really
        // necessary.  Unfortunately, in general, a temporary variable is
        // required whenever any child contains a yield expression, since it
        // is difficult to prove (at all, let alone efficiently) whether
        // this result would evaluate to the same value before and after the
        // yield (see #206).  One narrow case where we can prove it doesn't
        // matter (and thus we do not need a temporary variable) is when the
        // result in question is a Literal value.
        result = this.emitAssign(
          tempVar || this.makeTempVar(),
          result as K.ExpressionKind
        );
      }
      return result;
    };

    let after;

    // If ignoreResult is true, then we must take full responsibility for
    // emitting the expression with all its side effects, and we should not
    // return a result.

    switch (expr.type) {
      case "MemberExpression":
        return finish(
          b.memberExpression(
            this.explodeExpression(path.get("object")),
            expr.computed
              ? explodeViaTempVar(null, path.get("property"))
              : expr.property,
            expr.computed
          )
        );

      case "CallExpression": {
        const calleePath = path.get("callee") as NodePath<
          n.CallExpression["callee"]
        >;
        const argsPath = path.get("arguments") as NodePath<
          n.CallExpression,
          n.CallExpression["arguments"]
        >;

        let newCallee;
        let newArgs;

        const hasLeapingArgs = !!argsPath.filter(
          (argPath: NodePath<n.CallExpression["arguments"][number]>) =>
            meta.containsLeap(argPath.node),
          this
        ).length;

        let injectFirstArg = null;

        if (n.MemberExpression.check(calleePath.node)) {
          if (hasLeapingArgs) {
            // If the arguments of the CallExpression contained any yield
            // expressions, then we need to be sure to evaluate the callee
            // before evaluating the arguments, but if the callee was a member
            // expression, then we must be careful that the object of the
            // member expression still gets bound to `this` for the call.

            const newObject = explodeViaTempVar(
              // Assign the exploded callee.object expression to a temporary
              // variable so that we can use it twice without reevaluating it.
              this.makeTempVar(),
              calleePath.get("object")
            );

            const newProperty = calleePath.node.computed
              ? explodeViaTempVar(null, calleePath.get("property"))
              : calleePath.node.property;

            injectFirstArg = newObject;

            newCallee = b.memberExpression(
              b.memberExpression(
                cloneDeep(newObject),
                newProperty,
                calleePath.node.computed
              ),
              b.identifier("call"),
              false
            );
          } else {
            newCallee = this.explodeExpression(calleePath);
          }
        } else {
          newCallee = explodeViaTempVar(null, calleePath);

          if (n.MemberExpression.check(newCallee)) {
            // If the callee was not previously a MemberExpression, then the
            // CallExpression was "unqualified," meaning its `this` object
            // should be the global object. If the exploded expression has
            // become a MemberExpression (e.g. a context property, probably a
            // temporary variable), then we need to force it to be unqualified
            // by using the (0, object.property)(...) trick; otherwise, it
            // will receive the object of the MemberExpression as its `this`
            // object.
            newCallee = b.sequenceExpression([
              b.literal(0),
              cloneDeep(newCallee),
            ]);
          }
        }

        if (hasLeapingArgs) {
          newArgs = argsPath.map(
            (argPath: NodePath<n.CallExpression["arguments"][number]>) =>
              explodeViaTempVar(null, argPath),
            this
          );
          if (injectFirstArg) newArgs.unshift(injectFirstArg);

          newArgs = newArgs.map((arg: K.ExpressionKind) => cloneDeep(arg));
        } else {
          newArgs = path.node.arguments;
        }

        return finish(b.callExpression(newCallee, newArgs));
      }

      case "NewExpression":
        return finish(
          b.newExpression(
            explodeViaTempVar(null, path.get("callee")),
            path
              .get("arguments")
              .map((argPath: NodePath<n.NewExpression["arguments"][number]>) =>
                explodeViaTempVar(null, argPath)
              )
          )
        );

      case "ObjectExpression":
        return finish(
          b.objectExpression(
            path
              .get("properties")
              .map(
                (propPath: NodePath<K.PropertyKind | K.ObjectPropertyKind>) => {
                  if (n.ObjectProperty.check(propPath.node)) {
                    const objProp = b.objectProperty(
                      propPath.node.key,
                      explodeViaTempVar(null, propPath.get("value"))
                    );
                    objProp.computed = propPath.node.computed;
                    return objProp;
                  } else {
                    return b.property(
                      propPath.node.kind,
                      propPath.node.key,
                      explodeViaTempVar(null, propPath.get("value"))
                    );
                  }
                }
              )
          )
        );

      case "ArrayExpression":
        return finish(
          b.arrayExpression(
            path
              .get("elements")
              .map(
                (elemPath: NodePath<K.ExpressionKind | K.SpreadElementKind>) => {
                  if (n.SpreadElement.check(elemPath.node)) {
                    return b.spreadElement(
                      explodeViaTempVar(null, elemPath.get("argument"))
                    );
                  } else {
                    return explodeViaTempVar(null, elemPath);
                  }
                }
              )
          )
        );

      case "SequenceExpression": {
        const lastIndex = expr.expressions.length - 1;

        path.get("expressions").each((exprPath: NodePath<K.ExpressionKind>) => {
          if (exprPath.name === lastIndex) {
            if (ignoreResult) {
              this.explodeExpression(exprPath, true);
            } else {
              result = this.explodeExpression(exprPath);
            }
          } else {
            this.explodeExpression(exprPath, true);
          }
        });

        return result;
      }

      case "LogicalExpression": {
        after = this.loc();

        if (!ignoreResult) {
          result = this.makeTempVar();
        }

        const left = explodeViaTempVar(result, path.get("left"));

        if (expr.operator === "&&") {
          this.jumpIfNot(left, after);
        } else {
          assert.strictEqual(expr.operator, "||");
          this.jumpIf(left, after);
        }

        if (ignoreResult) {
          explodeViaTempVar(result, path.get("right"), true);
        } else {
          explodeViaTempVar(result, path.get("right"));
        }

        this.mark(after);

        return result;
      }

      case "ConditionalExpression": {
        const elseLoc = this.loc();
        after = this.loc();
        const test = this.explodeExpression(path.get("test"));

        this.jumpIfNot(test, elseLoc);

        if (!ignoreResult) {
          result = this.makeTempVar();
        }

        if (ignoreResult) {
          explodeViaTempVar(result, path.get("consequent"), true);
        } else {
          explodeViaTempVar(result, path.get("consequent"));
        }
        this.jump(after);

        this.mark(elseLoc);
        if (ignoreResult) {
          explodeViaTempVar(result, path.get("alternate"), true);
        } else {
          explodeViaTempVar(result, path.get("alternate"));
        }

        this.mark(after);

        return result;
      }

      case "UnaryExpression":
        return finish(
          b.unaryExpression(
            expr.operator,
            // Can't (and don't need to) break up the syntax of the argument.
            // Think about delete a[b].
            this.explodeExpression(path.get("argument")),
            !!expr.prefix
          )
        );

      case "BinaryExpression":
        return finish(
          b.binaryExpression(
            expr.operator,
            explodeViaTempVar(null, path.get("left")),
            explodeViaTempVar(null, path.get("right"))
          )
        );

      case "AssignmentExpression": {
        if (expr.operator === "=") {
          // If this is a simple assignment, the left hand side does not need
          // to be read before the right hand side is evaluated, so we can
          // avoid the more complicated logic below.
          return finish(
            b.assignmentExpression(
              expr.operator,
              this.explodeExpression(
                path.get("left")
              ) as n.AssignmentExpression["left"],
              this.explodeExpression(
                path.get("right")
              ) as n.AssignmentExpression["right"]
            )
          );
        }

        const lhs = this.explodeExpression(path.get("left"));
        const temp = this.emitAssign(this.makeTempVar(), lhs);

        // For example,
        //
        //   x += yield y
        //
        // becomes
        //
        //   context.t0 = x
        //   x = context.t0 += yield y
        //
        // so that the left-hand side expression is read before the yield.
        // Fixes https://github.com/facebook/regenerator/issues/345.

        return finish(
          b.assignmentExpression(
            "=",
            cloneDeep(lhs) as n.AssignmentExpression["left"],
            b.assignmentExpression(
              expr.operator,
              cloneDeep(temp),
              this.explodeExpression(path.get("right"))
            )
          )
        );
      }

      case "UpdateExpression":
        return finish(
          b.updateExpression(
            expr.operator,
            this.explodeExpression(path.get("argument")),
            expr.prefix
          )
        );

      case "YieldExpression": {
        after = this.loc();
        const arg =
          expr.argument && this.explodeExpression(path.get("argument"));

        if (arg && expr.delegate) {
          const result = this.makeTempVar();

          const ret = b.returnStatement(
            b.callExpression(this.contextProperty("delegateYield"), [
              arg,
              b.literal(result.property.name),
              after,
            ])
          );
          ret.loc = expr.loc;

          this.emit(ret);
          this.mark(after);

          return result;
        }

        this.emitAssign(this.contextProperty("next"), after);

        const ret = b.returnStatement(cloneDeep(arg) || null);
        // Preserve the `yield` location so that source mappings for the statements
        // link back to the yield properly.
        ret.loc = expr.loc;
        this.emit(ret);
        this.mark(after);

        return this.contextProperty("sent");
      }

      default:
        throw new Error(
          "unknown Expression of type " + JSON.stringify(expr.type)
        );
    }
  }
}
