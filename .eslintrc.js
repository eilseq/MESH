module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "no-empty": ["error", { allowEmptyCatch: true }],
  },
};
