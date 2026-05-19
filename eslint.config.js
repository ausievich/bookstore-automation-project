const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['automation/**/*.ts', 'mock-server/**/*.ts', 'playwright.config.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'playwright/expect-expect': [
        'warn',
        { assertFunctionPatterns: ['^expect'] },
      ],
    },
  },
  {
    ignores: ['node_modules/', 'dist/', 'allure-report/', 'playwright-report/'],
  },
);
