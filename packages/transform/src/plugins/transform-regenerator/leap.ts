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
import { namedTypes as n } from "@pregenerator/ast-types";
import type { Emitter } from "./emit";

type Loc = n.Literal & { value: number };

class Entry {}

type EntryType =
  | FunctionEntry
  | LoopEntry
  | SwitchEntry
  | TryEntry
  | CatchEntry
  | FinallyEntry
  | LabeledEntry;

export class FunctionEntry extends Entry {
  returnLoc: Loc;

  constructor(returnLoc: Loc) {
    super();
    n.Literal.assert(returnLoc);
    this.returnLoc = returnLoc;
  }
}

export class LoopEntry extends Entry {
  breakLoc: Loc;
  continueLoc: Loc;
  label: n.Identifier | null;

  constructor(breakLoc: Loc, continueLoc: Loc, label?: n.Identifier | null) {
    super();
    n.Literal.assert(breakLoc);
    n.Literal.assert(continueLoc);

    if (label) {
      n.Identifier.assert(label);
    } else {
      label = null;
    }

    this.breakLoc = breakLoc;
    this.continueLoc = continueLoc;
    this.label = label;
  }
}

export class SwitchEntry extends Entry {
  breakLoc: Loc;

  constructor(breakLoc: Loc) {
    super();
    n.Literal.assert(breakLoc);
    this.breakLoc = breakLoc;
  }
}

export class TryEntry extends Entry {
  firstLoc: Loc;
  catchEntry: CatchEntry | null;
  finallyEntry: FinallyEntry | null;

  constructor(
    firstLoc: Loc,
    catchEntry?: CatchEntry | null,
    finallyEntry?: FinallyEntry | null
  ) {
    super();

    n.Literal.assert(firstLoc);

    if (catchEntry) {
      assert.ok(catchEntry instanceof CatchEntry);
    } else {
      catchEntry = null;
    }

    if (finallyEntry) {
      assert.ok(finallyEntry instanceof FinallyEntry);
    } else {
      finallyEntry = null;
    }

    // Have to have one or the other (or both).
    assert.ok(catchEntry || finallyEntry);

    this.firstLoc = firstLoc;
    this.catchEntry = catchEntry;
    this.finallyEntry = finallyEntry;
  }
}

export class CatchEntry extends Entry {
  firstLoc: Loc;
  paramId: n.Identifier;

  constructor(firstLoc: Loc, paramId: n.Identifier) {
    super();

    n.Literal.assert(firstLoc);
    n.Identifier.assert(paramId);

    this.firstLoc = firstLoc;
    this.paramId = paramId;
  }
}

export class FinallyEntry extends Entry {
  firstLoc: Loc;
  afterLoc: Loc;

  constructor(firstLoc: Loc, afterLoc: Loc) {
    super();

    n.Literal.assert(firstLoc);
    n.Literal.assert(afterLoc);
    this.firstLoc = firstLoc;
    this.afterLoc = afterLoc;
  }
}

export class LabeledEntry extends Entry {
  breakLoc: Loc;
  label: n.Identifier;

  constructor(breakLoc: Loc, label: n.Identifier) {
    super();

    n.Literal.assert(breakLoc);
    n.Identifier.assert(label);

    this.breakLoc = breakLoc;
    this.label = label;
  }
}

export class LeapManager {
  emitter: Emitter;
  entryStack: EntryType[];

  constructor(emitter: Emitter) {
    this.emitter = emitter;
    this.entryStack = [new FunctionEntry(emitter.finalLoc)];
  }

  withEntry(entry: EntryType, callback: () => void): void {
    assert.ok(entry instanceof Entry);
    this.entryStack.push(entry);
    try {
      callback.call(this.emitter);
    } finally {
      const popped = this.entryStack.pop();
      assert.strictEqual(popped, entry);
    }
  }

  _findLeapLocation(
    property: "breakLoc" | "continueLoc",
    label: n.Identifier | null
  ): Loc | null {
    for (let i = this.entryStack.length - 1; i >= 0; --i) {
      const entry = this.entryStack[i];
      let loc;
      if (
        property === "breakLoc" &&
        (entry instanceof LoopEntry ||
          entry instanceof SwitchEntry ||
          entry instanceof LabeledEntry)
      ) {
        loc = entry.breakLoc;
      } else if (property === "continueLoc" && entry instanceof LoopEntry) {
        loc = entry.continueLoc;
      }
      if (loc) {
        if (label) {
          if (
            (entry instanceof LabeledEntry || entry instanceof LoopEntry) &&
            entry.label &&
            entry.label.name === label.name
          ) {
            return loc;
          }
        } else if (entry instanceof LabeledEntry) {
          // Ignore LabeledEntry entries unless we are actually breaking to
          // a label.
        } else {
          return loc;
        }
      }
    }

    return null;
  }

  getBreakLoc(label: n.Identifier | null): Loc | null {
    return this._findLeapLocation("breakLoc", label);
  }

  getContinueLoc(label: n.Identifier | null): Loc | null {
    return this._findLeapLocation("continueLoc", label);
  }
}
