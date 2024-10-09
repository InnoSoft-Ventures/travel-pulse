// const { FlatCompat } = require("@eslint/eslintrc");
// const pluginJs = require("@eslint/js");
// const tseslint = require("@typescript-eslint/eslint-plugin");
// const importPlugin = require("eslint-plugin-import");

// const compat = new FlatCompat();

module.exports = [
	{
		root: true,
		files: ["**/*.{js,mjs,cjs,ts}"],
		ignores: ["**/*.config.js", "!**/eslint.config.js"],
		// Use recommended configurations from the plugins
		extends: [
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended", // TypeScript plugin's recommended rules
			"plugin:import/recommended", // Import plugin's recommended rules
			"prettier", // Prettier for formatting
			"plugin:prettier/recommended", // Prettier plugin's recommended settings
		],
		languageOptions: {
			parser: "@typescript-eslint/parser",
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: "module",
			},
			// globals: {
			// 	...require("globals").commonjs,
			// },
		},
		env: {
			es6: true,
			node: true,
		},
		rules: {
			"no-var": "error",
			semi: "error",
			indent: ["error", "tab", { SwitchCase: 1 }],
			"no-multi-spaces": "error",
			"space-in-parens": "error",
			"no-multiple-empty-lines": "error",
			"prefer-const": "error",
			"import/no-unresolved": "error",
		},
	},
	// ...compat.extends("eslint:recommended"),
	// ...compat.extends("plugin:@typescript-eslint/recommended"),
	// ...compat.extends("plugin:import/recommended"),
	// ...compat.extends("prettier"),
];
