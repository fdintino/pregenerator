import _convertFunctionParams from './params';
import _convertFunctionRest from './rest';

export default function transformParametersPlugin({types: t}) {
  const convertFunctionParams = _convertFunctionParams({types: t});
  const convertFunctionRest = _convertFunctionRest({types: t});

  return {
    name: 'transform-parameters',

    visitor: {
      Function(path) {
        if (
          path.isArrowFunctionExpression() &&
          path
            .get('params')
            .some(param => param.isRestElement() || param.isAssignmentPattern())
        ) {
          // default/rest visitors require access to `arguments`, so it cannot be an arrow
          path.arrowFunctionToExpression();
        }

        const convertedRest = convertFunctionRest(path);
        const convertedParams = convertFunctionParams(path);

        if (convertedRest || convertedParams) {
          // Manually reprocess this scope to ensure that the moved params are updated.
          path.scope.crawl();
        }
      },
    },
  };
};
