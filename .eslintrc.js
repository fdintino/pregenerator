module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  "rules": {
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  },
  "overrides": [
    {
      // enable these rules specifically for TypeScript files
      "files": ["*.ts", "*.tsx"],
      "extends": [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
      ],
      "rules": {
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/no-explicit-any": "error"
      }
    },
    {
      "files": ["*.js"],
      "parser": "espree",
      "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2018
      },
      "env": {
        "node": true,
        "es6": true
      }
    },
    {
      "files": ["rollup.config.js"],
      "env": {
        "node": true
      }
    },
    {
      "files": ["*.test.ts", "*.test.tsx"],
      "rules": {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ],
};
