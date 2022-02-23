import {
  namedTypes as n,
  getFieldNames,
  NodePath,
} from "@pregenerator/ast-types";

export function getEarliestCommonAncestorFrom(
  refPath: NodePath,
  paths: Array<NodePath>
): NodePath {
  return getDeepestCommonAncestorFrom(
    refPath,
    paths,
    function (deepest, i, ancestries) {
      let earliest;

      const keys = getFieldNames(deepest.node);

      for (const ancestry of ancestries) {
        const path = ancestry[i + 1];

        // first path
        if (!earliest) {
          earliest = path;
          continue;
        }

        // handle containers
        if (
          typeof path.name === "number" &&
          path.parentPath?.name === earliest.parentPath?.name
        ) {
          if (typeof earliest.name === "number" && path.name < earliest.name) {
            earliest = path;
            continue;
          }
        }

        // handle keys
        const earliestKeyIndex = keys.indexOf(
          earliest.parentPath?.name as string
        );
        const currentKeyIndex = keys.indexOf(path.parentPath?.name as string);
        if (earliestKeyIndex > currentKeyIndex) {
          // key appears before so it's earlier
          earliest = path;
        }
      }

      return earliest as NodePath;
    }
  );
}

/**
 * Get the earliest path in the tree where the provided `paths` intersect.
 *
 * TODO: Possible optimisation target.
 */

export function getDeepestCommonAncestorFrom(
  refPath: NodePath,
  paths: Array<NodePath>,
  filter?: (deepest: NodePath, i: number, ancestries: NodePath[][]) => NodePath
): NodePath {
  if (!paths.length) {
    return refPath;
  }

  if (paths.length === 1) {
    return paths[0];
  }

  // minimum depth of the tree so we know the highest node
  let minDepth = Infinity;

  // last common ancestor
  let lastCommon;
  let lastCommonIndex = 0;

  // get the ancestors of the path, breaking when the parent exceeds ourselves
  const ancestries = paths.map((path) => {
    const ancestry: NodePath[] = [];

    do {
      ancestry.unshift(path);
    } while (path.parentPath && (path = path.parentPath) && path !== refPath);

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
    return refPath;
  }
}

export function getStatementParent(
  refPath: NodePath
): NodePath<n.Statement, n.Statement> {
  let path = refPath;

  do {
    if (!path.parentPath || path.checkValue(n.Statement)) {
      break;
    } else {
      path = path.parentPath;
    }
  } while (path);

  if (path && (path.check(n.Program) || path.check(n.File))) {
    throw new Error(
      "File/Program node, we can't possibly find a statement parent to this"
    );
  }

  return path as NodePath<n.Statement, n.Statement>;
}
