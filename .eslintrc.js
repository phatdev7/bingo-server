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
    "@typescript-eslint/camelcase": ["error", { "properties": "never", "ignoreDestructuring": false }],
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowDestructuring: true, // Allow `const { props, state } = this`; false by default
        allowedNames: ['self'], // Allow `const self = this`; `[]` by default
      },
    ],
    "@typescript-eslint/interface-name-prefix": [
      "error",
      {
          "prefixWithI": "always"
      }
    ]
  },
};
