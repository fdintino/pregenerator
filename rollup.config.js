import path from "path";
import { DEFAULT_EXTENSIONS } from "@babel/core";

import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import typescript from "rollup-plugin-typescript2";
import ts from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import nodeBuiltins from "rollup-plugin-node-polyfills";

import pjson from "./package.json";

const isTest = process.env.NODE_ENV === "test";
const {
  plugins,
  presets: [[, envConfig]],
} = pjson.babel;

export default ["cjs", "es", "mjs", "umd"].map((format) => ({
  treeshake: {
    moduleSideEffects: (id, external) =>
      !external || id === "@pregenerator/helpers",
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  plugins: [
    alias({
      ...(format !== "umd" && format !== "mjs"
        ? {}
        : {
            "@pregenerator/global-vars": require.resolve(
              "@pregenerator/global-vars/browser.js"
            ),
            buffer: require.resolve("@pregenerator/build-helpers/buffer-shim"),
          }),
    }),
    json(),
    commonjs({ include: /node_modules/ }),
    nodeResolve({
      preferBuiltins: format !== "umd" && format !== "mjs",
    }),
    format === "cjs" || format === "es"
      ? ts({
          tsconfig: (resolvedConfig) => ({
            ...resolvedConfig,
            module: "esnext",
            target: "es2020",
          }),
          browserslist: false,
        })
      : typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: "esnext",
              target: "es2020",
              declaration: false,
              declarationMap: false,
              composite: false,
            },
          },
          check: !isTest && format !== "umd",
        }),
    ...(format === "umd" || format === "mjs" ? [nodeBuiltins()] : []),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, ".ts"],
      plugins: [
        ...(!isTest
          ? []
          : [
              [
                "istanbul",
                {
                  cwd: path.resolve("../.."),
                },
              ],
            ]),
        ...plugins,
      ],
      babelrc: false,
      sourceMaps: true,
      inputSourceMap: true,
      presets: [
        [
          "@babel/env",
          {
            ...envConfig,
            modules: false,
            targets:
              format === "umd"
                ? { browsers: pjson.browserslist }
                : format === "mjs"
                ? ["supports es6-module"]
                : envConfig.targets,
          },
        ],
      ],
      babelHelpers: "runtime",
      exclude:
        /node_modules\/(?!astring)(?!shallow-clone)(?!to-fast-properties)(?![^/]*?\/node_modules\/kind-of)(?!kind-of)/,
    }),
    ...((format !== "umd" && format !== "mjs") || isTest
      ? []
      : [
          terser({
            // sourcemap: true,
            toplevel: true,
            compress: {
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              warnings: false,
            },
            mangle: {
              toplevel: true,
              reserved: [
                "GeneratorFunction",
                "GeneratorFunctionPrototype",
                "Promise",
                "Symbol",
                "NodePath",
                "has",
              ],
            },
            nameCache: {},
          }),
          // https://github.com/rollup/rollup/blob/69ff4181e701a0fe0026d0ba147f31bc86beffa8/build-plugins/emit-module-package-file.ts
          ...(format === "es" || format === "cjs"
            ? [
                {
                  generateBundle() {
                    this.emitFile({
                      fileName: "package.json",
                      source: `{ "type": "${
                        format === "es" ? "module" : "commonjs"
                      }"\n`,
                      type: "asset",
                    });
                  },
                  name: "emit-package-file",
                },
              ]
            : []),
        ]),
  ],
}));
