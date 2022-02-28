import { getFieldNames, getFieldValue, builtInTypes } from "./types";

const {
  array: isArray,
  object: isObject,
  Date: isDate,
  RegExp: isRegExp,
} = builtInTypes;

const assertIsArray: typeof isArray["assert"] = isArray.assert.bind(isArray);
const assertIsObject: typeof isObject["assert"] =
  isObject.assert.bind(isObject);

const hasOwn = Object.prototype.hasOwnProperty;

export function astNodesAreEquivalent<T>(
  a: T,
  b: unknown,
  problemPath?: any[] | null
): b is T {
  if (isArray.check(problemPath)) {
    problemPath.length = 0;
  } else {
    problemPath = null;
  }

  return areEquivalent(a, b, problemPath);
}

astNodesAreEquivalent.assert = function (a: any, b: any) {
  const problemPath: any[] = [];
  if (!astNodesAreEquivalent(a, b, problemPath)) {
    if (problemPath.length === 0) {
      if (a !== b) {
        throw new Error("Nodes must be equal");
      }
    } else {
      throw new Error(
        "Nodes differ in the following path: " +
          problemPath.map(subscriptForProperty).join("")
      );
    }
  }
};

function subscriptForProperty(property: any) {
  if (/[_$a-z][_$a-z0-9]*/i.test(property)) {
    return "." + property;
  }
  return "[" + JSON.stringify(property) + "]";
}

function areEquivalent(a: any, b: any, problemPath: any) {
  if (a === b) {
    return true;
  }

  if (isArray.check(a)) {
    return arraysAreEquivalent(a, b, problemPath);
  }

  if (isObject.check(a)) {
    return objectsAreEquivalent(a, b, problemPath);
  }

  if (isDate.check(a)) {
    return isDate.check(b) && +a === +b;
  }

  if (isRegExp.check(a)) {
    return (
      isRegExp.check(b) &&
      a.source === b.source &&
      a.global === b.global &&
      a.multiline === b.multiline &&
      a.ignoreCase === b.ignoreCase
    );
  }

  return a == b;
}

function arraysAreEquivalent(a: any, b: any, problemPath: any) {
  assertIsArray(a);
  const aLength = a.length;

  if (!isArray.check(b) || b.length !== aLength) {
    if (problemPath) {
      problemPath.push("length");
    }
    return false;
  }

  for (let i = 0; i < aLength; ++i) {
    if (problemPath) {
      problemPath.push(i);
    }

    if (i in a !== i in b) {
      return false;
    }

    if (!areEquivalent(a[i], b[i], problemPath)) {
      return false;
    }

    if (problemPath) {
      const problemPathTail = problemPath.pop();
      if (problemPathTail !== i) {
        throw new Error("" + problemPathTail);
      }
    }
  }

  return true;
}

function objectsAreEquivalent(a: any, b: any, problemPath: any) {
  assertIsObject(a);
  if (!isObject.check(b)) {
    return false;
  }

  // Fast path for a common property of AST nodes.
  if (a.type !== b.type) {
    if (problemPath) {
      problemPath.push("type");
    }
    return false;
  }

  const aNames = getFieldNames(a);
  const aNameCount = aNames.length;

  const bNames = getFieldNames(b);
  const bNameCount = bNames.length;

  if (aNameCount === bNameCount) {
    for (let i = 0; i < aNameCount; ++i) {
      const name = aNames[i];
      const aChild = getFieldValue(a, name);
      const bChild = getFieldValue(b, name);

      if (problemPath) {
        problemPath.push(name);
      }

      if (!areEquivalent(aChild, bChild, problemPath)) {
        return false;
      }

      if (problemPath) {
        const problemPathTail = problemPath.pop();
        if (problemPathTail !== name) {
          throw new Error("" + problemPathTail);
        }
      }
    }

    return true;
  }

  if (!problemPath) {
    return false;
  }

  // Since aNameCount !== bNameCount, we need to find some name that's
  // missing in aNames but present in bNames, or vice-versa.

  const seenNames = Object.create(null);

  for (let i = 0; i < aNameCount; ++i) {
    seenNames[aNames[i]] = true;
  }

  for (let i = 0; i < bNameCount; ++i) {
    const name = bNames[i];

    if (!hasOwn.call(seenNames, name)) {
      problemPath.push(name);
      return false;
    }

    delete seenNames[name];
  }

  for (const name in seenNames) {
    problemPath.push(name);
    break;
  }

  return false;
}
