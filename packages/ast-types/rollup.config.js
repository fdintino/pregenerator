import rollupConfigBase from "../../rollup.config";

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
