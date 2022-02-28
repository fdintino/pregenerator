import rollupConfigBase from "../../rollup.config";
import { visualizer } from "rollup-plugin-visualizer";

import pjson from "./package.json";

const outputFiles = {
  cjs: pjson.main,
  es: pjson.module,
  umd: pjson.browser[pjson.main],
  mjs: pjson.browser[pjson.module],
};

export default ["cjs", "es", "mjs", "umd"].map((format, i) => {
  const base = rollupConfigBase[i];
  const { name } = pjson;

  const isTest = process.env.NODE_ENV === "test";
  const isBrowser = format === "mjs" || format === "umd";

  let file = outputFiles[format];

  if (isTest) {
    file = file.replace("dist/", "test/");
  }

  const external =
    isBrowser || isTest ? [] : Object.keys(pjson.dependencies || {});

  return {
    ...base,
    external,
    input: "src/index.ts",
    plugins: [
      ...base.plugins,
      ...(isBrowser
        ? [
            visualizer(() => ({
              filename: format === "mjs" ? "stats.es.html" : "stats.html",
              sourcemap: true,
              gzipSize: true,
              projectRoot: process.cwd(),
            })),
          ]
        : []),
    ],
    output: {
      format: format === "mjs" ? "es" : format,
      file,
      name,
      sourcemap: true,
    },
  };
});
