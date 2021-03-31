const prettier = require('@osdoc-dev/eslint-config-preset-prettier')
module.exports = {
  ...prettier,
  arrowParens: 'avoid', // 箭头函数，单个参数添加括号
  trailingComma: 'es5',
}
