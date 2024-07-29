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

  return {
    ...base,
    input: "src/index.ts",
    output: {
      format: format === "mjs" ? "es" : format,
      file: outputFiles[format],
      name,
      sourcemap: true,
    },
  };
});
