module.exports = {
  extends: '@osdoc-dev/eslint-config-preset-ts',
  env: {
    node: true,
    {{#enableJest}}
    jest:true
    {{/enableJest}}
  },
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'brace-style': 0,
    'comma-dangle': 0,
    'arrow-parens': 0,
    'unicorn/prevent-abbreviations': 0,
    'space-before-function-paren': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    '@typescript-eslint/indent': 0,
    indent: 0,
    'no-await-in-loop': 0,
    'unicorn/no-array-for-each': 0,
  },
}
