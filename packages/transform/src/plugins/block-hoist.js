import stableSort from 'stable';

function getHoistPriority(node) {
  let priority = node && node._blockHoist;
  if (priority == null) priority = 1;

  // Higher priorities should move toward the top.
  return -1 * priority;
}

export default () => ({
  visitor: {
    Block: {
      exit({ node }) {
        let hasChange = false;
        for (let i = 0; i < node.body.length; i++) {
          let bodyNode = node.body[i];
          if (bodyNode && bodyNode._blockHoist != null) {
            hasChange = true;
            break;
          }
        }
        if (!hasChange) return;

        node.body = stableSort(node.body,
          (a, b) => getHoistPriority(a) - getHoistPriority(b));
      }
    },
  },
});
