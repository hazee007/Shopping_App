module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es2021: true,
    node: true,
    "react-native/react-native": true,
  },
  extends: ["plugin:react/recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "react-native", "react-hooks"],
  rules: {
    "react/prop-types": "off",
    "react/display-name": "off",
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 2,
    "react-native/no-color-literals": 0,
    "react-native/no-raw-text": 2,

    // Removed rule "disallow the use of console" from recommended eslint rules
    "no-console": 1,

    // Removed rule "disallow the use of debugger" from recommended eslint rules
    "no-debugger": 1,

    // Removed rule "disallow unused variables" from recommended eslint rules
    "no-unused-vars": 2,
    "no-undef": ["error"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
