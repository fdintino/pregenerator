import rollupConfigBase from "../../rollup.config";

import pjson from "./package.json";

const pjsonOutputFiles = {
  umd: "browser",
  cjs: "main",
  es: "module",
};

export default ["cjs", "es", "umd"].map((format, i) => {
  const base = rollupConfigBase[i];
  const { name } = pjson;
  const file = pjson[pjsonOutputFiles[format]];

  return {
    ...base,
    input: "src/index.ts",
    output: {
      format,
      file,
      name,
      sourcemap: true,
    },
  };
});
