import rollupConfigBase from "../../rollup.config";

import pjson from "./package.json";

const outputFiles = {
  cjs: pjson.main,
  es: pjson.module,
  umd: pjson.exports.script,
  mjs: pjson.exports.import,
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
    output: {
      format: format === "mjs" ? "es" : format,
      file,
      name,
      sourcemap: true,
    },
  };
});
