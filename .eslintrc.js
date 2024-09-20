module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
