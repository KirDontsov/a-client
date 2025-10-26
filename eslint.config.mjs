import vuePlugin from 'eslint-plugin-vue';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

// 'warn' is on index 1
// currently removed it to avoid having unused error
const [error, , off] = [2, 1, 0];

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    plugins: {
      vue: vuePlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      'vue/no-template-shadow': off,
      'vue/script-setup-uses-vars': error,
      'new-cap': error,
      'object-property-newline': off,
      'max-len': [
        error,
        {
          code: 120,
          ignoreComments: true,
          ignoreUrls: true,
          // ignore svg path pattern
          ignorePattern: 'd="([\\s\\S]*?)"',
        },
      ],
      'no-restricted-imports': [
        error,
        {
          paths: [
            {
              name: '~',
              message: "Use '@' alias instead of '~'.",
            },
          ],
          patterns: ['~/**'],
        },
      ],
      'vue/html-self-closing': [
        error,
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
    ignores: ['assets/i18n/*.json'],
  },
  {
    rules: {
      'prettier/prettier': [
        'warn',
        {
          printWidth: 120,
          singleAttributePerLine: false,
          singleQuote: true,
          bracesSpacing: true,
          trailingComma: 'all',
          bracketSpacing: true,
          semi: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
];
