import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import alias from 'rollup-plugin-alias';
import {terser} from 'rollup-plugin-terser';

import pjson from './package.json';


const {plugins, presets: [[,envConfig]]} = pjson.babel;

export default ['umd', 'cjs', 'es'].map(format => ({
  treeshake: {
    moduleSideEffects: 'no-external',
  },
  plugins: [
    alias({
      ...((format !== 'umd') ? {} : {
        '@pregenerator/global-vars': require.resolve('@pregenerator/global-vars/browser.js'),
        'buffer': require.resolve('@pregenerator/build-helpers/buffer-shim'),
      }),
    }),
    babel({
      plugins,
      babelrc: false,
      presets: [['@babel/env', {
        ...envConfig,
        modules: false,
        targets: (format === 'umd')
          ? {browsers: pjson.browserslist}
          : envConfig.targets,
      }]],
      runtimeHelpers: true,
      exclude: /node_modules/,
    }),
    ...(
      (format !== 'umd') ? [] : [
        nodeGlobals({buffer: false}),
        nodeBuiltins(),
      ]),
    commonjs({include: /node_modules/}),
    nodeResolve(),
    json(),
    ...((format !== 'umd') ? [] : [
      terser({
        sourcemap: true,
        toplevel: true,
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        },
        mangle: {
          toplevel: true,
        },
        nameCache: {},
      }),
    ])
  ]
}));
