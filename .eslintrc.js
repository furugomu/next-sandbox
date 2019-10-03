module.exports = {
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: ["eslint:recommended", "prettier", "plugin:react/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  rules: {
    complexity: ["warn", 6],
    eqeqeq: ["error", "smart"],
    "no-console": "warn",
    "no-undef": "off", // TS にまかせる
    "no-unused-vars": "off",

    // react
    "react/prop-types": "off",

    // react hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // typescript
    "@typescript-eslint/no-unused-vars": "error"
  },
  overrides: [
    // .eslintrc.js 等の設定ファイル
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "script"
      },
      env: { node: true }
    }
  ]
};
