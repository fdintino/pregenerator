import path from "path";
import rollupConfigBase from "../../rollup.config";

import pjson from "./package.json";

const pjsonOutputFiles = {
  umd: "browser",
  cjs: "main",
  es: "module",
};

export default ["umd", "cjs", "es"].map((format, i) => {
  const base = rollupConfigBase[i];
  const isBrowser = format === "umd";
  const { name } = pjson;
  const file = pjson[pjsonOutputFiles[format]];

  // const external = isBrowser ? [] : Object.keys(pjson.dependencies || {});

  return {
    ...base,
    // external,
    input: "src/index.ts",
    output: {
      format,
      file,
      name,
      sourcemap: true,
    },
  };
});
