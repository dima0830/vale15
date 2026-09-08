import eslintPluginVue from "eslint-plugin-vue";
import nuxtEslint from "@nuxt/eslint-config";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      vue: eslintPluginVue,
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      ...nuxtEslint(),
    ],
    rules: {
      "no-unused-vars": "warn",
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/html-self-closing": "off",
    },
  },
];
