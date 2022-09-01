module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'vue/no-unused-components': 0,
    'no-unused-vars': 1,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-mixed-spaces-and-tabs': 0,
    'vue/no-unused-components': 1,
    'vue/no-parsing-error': 0,
    "no-irregular-whitespace": 0,
    "no-useless-escape": 0,
    'vue/valid-v-bind': 0,
    'no-useless-escape': 0,
    'no-useless-catch': 0,
    'no-empty': 0,
    "no-unreachable":0
  }
}
