module.exports = {
  'extends': [
    'airbnb-base/legacy',
  ],
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 2018,
  },
  'env': {
    'node': true,
    'es6': true,
  },
  "rules": {
    'quotes': 'off',
    'consistent-return': 'off',
    'no-lonely-if': 'off',
    'no-return-assign': 'off',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'off',
    'no-continue': 'off',
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    'no-use-before-define': 'off',
    // Relax some rules
    'no-cond-assign': ['error', 'except-parens'],
    'no-unused-vars': ['error', {
      'args': 'none',
    }],
    // Disable some overly-strict airbnb style rules
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'function-paren-newline': 'off',
    'no-plusplus': 'off',
    'object-curly-spacing': 'off',
    'no-multi-assign': 'off',
    'no-else-return': 'off',
    // While technically useless from the point of view of the regex parser,
    // escaping characters inside character classes is more consistent. I
    // would say that they make the regular expression more readable, if the
    // idea of readable regular expressions wasn't absurd on its face.
    'no-useless-escape': 'off',
    // I'm inclined to reverse this rule to be ['error', 'always'], but not just yet
    // IE 8 is a thing of the past and trailing commas are useful.
    'comma-dangle': 'off',
  },
};
