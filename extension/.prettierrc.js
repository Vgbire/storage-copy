module.exports = {
  // 字符串使用单引号
  singleQuote: true,
  // 每行末尾自动添加分号
  semi: false,
  // tab缩进大小,默认为2
  tabWidth: 2,
  // 使用tab缩进，默认false
  useTabs: false,
  // 对象中打印空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'always',
  // 换行长度，默认80
  printWidth: 120,
  // 对象结尾没有逗号
  trailingComma: 'none',

  // 设置为true时,将多行JSX元素的 > 放在最后一行的末尾，而不是单独放在下一行
  bracketSameLine: true,
  singleAttributePerLine: true,

  importOrderSeparation: true,
  importOrderSortSpecifiers: true
}
