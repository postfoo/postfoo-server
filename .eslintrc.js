// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    '@stylistic/ts'
  ],
  rules: {
    '@stylistic/member-delimiter-style': ['error', { "multiline": { "delimiter": "comma" }, "singleline": { "delimiter": "comma" } }],
    '@stylistic/ts/semi': ['error', 'always'],
    '@stylistic/ts/indent': ['error', 2],
    '@stylistic/ts/object-curly-newline': ['error', { "consistent": true }],
    '@stylistic/js/arrow-parens': ['error', 'as-needed', { "requireForBlockBody": true }],
    'require-await': 'error',
  },
};
