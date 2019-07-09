export default function transformShorthandProperties({types: t}) {
  return {
    visitor: {
      ObjectProperty({ node }) {
        if (node.shorthand) {
          node.shorthand = false;
        }
      },
    },
  };
}
