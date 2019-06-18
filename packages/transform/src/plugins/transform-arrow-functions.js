export default () => ({
  visitor: {
    ArrowFunctionExpression(path) {
      path.arrowFunctionToShadowed();
    }
  },
});
