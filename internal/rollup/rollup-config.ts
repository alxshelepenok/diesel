import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

const pkg = require("../../package.json");

const LIBRARY_NAME = "diesel";

export default {
  external: ["react", "react-dom"],
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "umd",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
      name: LIBRARY_NAME,
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
      name: LIBRARY_NAME,
      sourcemap: true,
    },
  ],
  plugins: [json(), typescript({ module: "esnext" }), commonjs(), resolve()],
  watch: { include: "src/**" },
};
