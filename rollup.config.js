import path from "path";
import { DEFAULT_EXTENSIONS } from "@babel/core";

import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import alias from "@rollup/plugin-alias";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import terserFix from "./scripts/rollup-plugin-terser-unsafe-fix";
import nodePolyfills from "rollup-plugin-node-polyfills";
import changeSrcImports from "./scripts/rollup-plugin-src-imports";

import pjson from "./package.json";

const isTest = process.env.NODE_ENV === "test";
const {
  plugins,
  presets: [[, envConfig]],
} = pjson.babel;

export default ["umd", "cjs", "es"].map((format) => ({
  treeshake: {
    moduleSideEffects: "no-external",
  },
  plugins: [
    alias({
      ...(format !== "umd"
        ? {}
        : {
            "@pregenerator/global-vars": require.resolve(
              "@pregenerator/global-vars/browser.js"
            ),
            buffer: require.resolve("@pregenerator/build-helpers/buffer-shim"),
          }),
      ...(!isTest && format !== "umd"
        ? {}
        : {
            "@pregenerator/helpers": path.resolve(
              require.resolve("@pregenerator/helpers/src"),
              "../../src"
            ),
            "@pregenerator/transform": path.resolve(
              require.resolve("@pregenerator/transform"),
              "../../src"
            ),
          }),
    }),
    json(),
    commonjs({ include: /node_modules/ }),
    nodeResolve({
      preferBuiltins: format !== "umd",
    }),
    typescript(),
    nodePolyfills(),
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
                : format === "es"
                ? ["supports es6-module"]
                : envConfig.targets,
          },
        ],
      ],
      babelHelpers: "runtime",
      exclude:
        /node_modules\/(?!astring)(?!shallow-clone)(?!to-fast-properties)(?![^/]*?\/node_modules\/kind-of)(?!kind-of)/,
    }),
    ...(format !== "umd"
      ? []
      : [
          terserFix(),
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
        ]),
  ],
}));
