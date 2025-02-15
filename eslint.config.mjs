import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', 'build', '.vscode'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict, ...tseslint.configs.stylistic],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    plugins: {
      '@stylistic/ts': stylistic,
      '@stylistic/js': stylistic,
    },
    rules: {
      'require-await': 'error',
      'no-console': 'warn',
      'no-debugger': 'warn',

      // we want to allow any type in the codebase, since we always are not aware of types.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',

      '@stylistic/js/array-bracket-spacing': ['error', 'never'],
      '@stylistic/js/array-element-newline': ['error', 'consistent'],
      '@stylistic/js/arrow-parens': ['error', 'as-needed', { 'requireForBlockBody': true }],
      '@stylistic/js/arrow-spacing': ['error', { 'before': true, 'after': true }],
      '@stylistic/js/computed-property-spacing': ["error", "never"],
      '@stylistic/js/eol-last': ["error", "always"],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/function-paren-newline': ['error', 'consistent'],
      '@stylistic/js/linebreak-style': ["error", "unix"],


      '@stylistic/ts/block-spacing': ['error', 'always'],
      '@stylistic/ts/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
      '@stylistic/ts/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/ts/comma-spacing': ['error', { 'before': false, 'after': true }],
      '@stylistic/ts/function-call-spacing': ['error', 'never'],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/key-spacing': ["error", { "beforeColon": false, 'afterColon': true }],
      '@stylistic/ts/keyword-spacing': ["error", { "before": true, 'after': true }],
      '@stylistic/ts/member-delimiter-style': ['error', { 'multiline': { 'delimiter': 'comma' }, 'singleline': { 'delimiter': 'comma' } }],
      '@stylistic/ts/object-curly-newline': ['error', { 'consistent': true }],
      'quotes': 'off',
      '@stylistic/ts/quotes': ['error', 'single', { 'avoidEscape': true }],
      '@stylistic/ts/semi': ['error', 'never'],
    },
  },
)

