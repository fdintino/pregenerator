// This file contains that retrieve or validate anything related to the current paths ancestry.

import * as t from "../../types";

/**
 * Call the provided `callback` with the `NodePath`s of all the parents.
 * When the `callback` returns a truthy value, we return that node path.
 */

export function findParent(callback) {
  let path = this;
  while ((path = path.parentPath)) {
    if (callback(path)) return path;
  }
  return null;
}

/**
 * Description
 */

export function find(callback) {
  let path = this;
  do {
    if (callback(path)) return path;
  } while ((path = path.parentPath));
  return null;
}

/**
 * Get the parent function of the current path.
 */

export function getFunctionParent() {
  return this.findParent((path) => path.isFunction() || path.isProgram());
}

/**
 * Get the deepest common ancestor and then from it, get the earliest relationship path
 * to that ancestor.
 *
 * Earliest is defined as being "before" all the other nodes in terms of list container
 * position and visiting key.
 */

export function getEarliestCommonAncestorFrom(paths) {
  return this.getDeepestCommonAncestorFrom(paths, function filter(deepest, i, ancestries) {
    let earliest;
    const keys = t.VISITOR_KEYS[deepest.type];

    for (const ancestry of ancestries) {
      const path = ancestry[i + 1];

      // first path
      if (!earliest) {
        earliest = path;
        continue;
      }

      // handle containers
      if (path.listKey && earliest.listKey === path.listKey) {
        // we're in the same container so check if we're earlier
        if (path.key < earliest.key) {
          earliest = path;
          continue;
        }
      }

      // handle keys
      const earliestKeyIndex = keys.indexOf(earliest.parentKey);
      const currentKeyIndex = keys.indexOf(path.parentKey);
      if (earliestKeyIndex > currentKeyIndex) {
        // key appears before so it's earlier
        earliest = path;
      }
    }

    return earliest;
  });
}

/**
 * Get the earliest path in the tree where the provided `paths` intersect.
 *
 * TODO: Possible optimisation target.
 */

export function getDeepestCommonAncestorFrom(paths, filter) {
  if (!paths.length) {
    return this;
  }

  if (paths.length === 1) {
    return paths[0];
  }

  // minimum depth of the tree so we know the highest node
  let minDepth = Infinity;

  // last common ancestor
  let lastCommonIndex, lastCommon;

  // get the ancestors of the path, breaking when the parent exceeds ourselves
  const ancestries = paths.map(path => {
    const ancestry = [];

    do {
      ancestry.unshift(path);
    } while ((path = path.parentPath) && path !== this);

    // save min depth to avoid going too far in
    if (ancestry.length < minDepth) {
      minDepth = ancestry.length;
    }

    return ancestry;
  });

  // get the first ancestry so we have a seed to assess all other ancestries with
  const first = ancestries[0];

  // check ancestor equality
  depthLoop: for (let i = 0; i < minDepth; i++) {
    const shouldMatch = first[i];

    for (const ancestry of ancestries) {
      if (ancestry[i] !== shouldMatch) {
        // we've hit a snag
        break depthLoop;
      }
    }

    // next iteration may break so store these so they can be returned
    lastCommonIndex = i;
    lastCommon = shouldMatch;
  }

  if (lastCommon) {
    if (filter) {
      return filter(lastCommon, lastCommonIndex, ancestries);
    } else {
      return lastCommon;
    }
  } else {
    throw new Error("Couldn't find intersection");
  }
}
