module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "standard-with-typescript",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {},
  endOfLine: "auto",
};
