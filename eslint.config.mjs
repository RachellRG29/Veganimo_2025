// ==========================
// ESLint Config for SonarQube / Code Climate
// Compatible with ESLint v9+ (Flat Config)
// ==========================

import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    files: ["**/*.{js,jsx,mjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node } // soporte navegador y node
    },

    plugins: {
      react: pluginReact
    },

    rules: {
      // ------------------------
      // 🧩 Estilo y formato
      // ------------------------
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],

      // ------------------------
      // ⚙️ Buenas prácticas
      // ------------------------
      eqeqeq: ["error", "always"], // exige === y !==
      curly: ["error", "all"], // obliga llaves en if, for, etc.
      "prefer-const": "warn", // recomienda const
      "no-var": "error", // prohíbe var
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // ignora variables internas _nombre
      "no-console": ["warn", { allow: ["warn", "error"] }], // permite console.warn/error
      "no-alert": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-useless-return": "error",
      "no-empty-function": "warn",
      "no-duplicate-imports": "error",
      "no-magic-numbers": ["warn", { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
      "consistent-return": "warn",

      // ------------------------
      // 🧠 Complejidad y legibilidad
      // ------------------------
      complexity: ["warn", 10], // máximo 10 decisiones por función
      "max-depth": ["warn", 4], // máximo 4 niveles de anidamiento
      "max-lines-per-function": ["warn", { max: 80, skipBlankLines: true, skipComments: true }],
      "max-params": ["warn", 4], // máximo 4 parámetros por función

      // ------------------------
      // ⚛️ Reglas React
      // ------------------------
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/no-unescaped-entities": "off",
      "react/self-closing-comp": "error"
    }
  }
]);
