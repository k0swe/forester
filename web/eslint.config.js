// @ts-check
const tsParser = require('@typescript-eslint/parser');
const angularEslint = require('angular-eslint');

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@angular-eslint': angularEslint.tsPlugin,
    },
    processor: angularEslint.processInlineTemplates,
    rules: {
      ...angularEslint.configs.tsRecommended.reduce(
        (acc, cfg) => ({ ...acc, ...(cfg.rules || {}) }),
        {},
      ),
      '@angular-eslint/component-selector': [
        'error',
        {
          prefix: 'kel',
          style: 'kebab-case',
          type: 'element',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          prefix: 'kel',
          style: 'camelCase',
          type: 'attribute',
        },
      ],
      // Components were migrated to ChangeDetectionStrategy.Eager (v22 opt-out)
      // to preserve pre-v22 behavior; OnPush migration is a separate effort.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularEslint.templatePlugin,
    },
    languageOptions: {
      parser: angularEslint.templateParser,
    },
    rules: {
      ...angularEslint.configs.templateRecommended.reduce(
        (acc, cfg) => ({ ...acc, ...(cfg.rules || {}) }),
        {},
      ),
    },
  },
];
