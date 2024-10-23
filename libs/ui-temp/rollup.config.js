import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
	input: "./src/index.ts",
	output: [
		{
			file: "dist/index.js",
			format: "cjs",
			sourcemap: true,
		},
		{
			file: "dist/index.es.js",
			format: "es",
			sourcemap: true,
		},
	],
	plugins: [resolve(), commonjs(), typescript(), terser()],
	external: ["react", "react-dom", "styled-components"],
};
