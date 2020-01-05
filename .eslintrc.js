module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": 0,
    '@typescript-eslint/no-use-before-define': 'off',
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["error", { "properties": "never" }]
  },
};
