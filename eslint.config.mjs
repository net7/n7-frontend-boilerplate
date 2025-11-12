import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ['node_modules/', 'dist/', 'build_scripts/', '.vscode/'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'max-lines': [
        'warn',
        { max: 400, skipBlankLines: true, skipComments: true },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'linebreak-style': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': ['error', { packageDir: './' }],
      'no-param-reassign': ['error', { props: false }],
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-useless-constructor': 'off',
      'comma-dangle': 'off',
    },
  }
);
