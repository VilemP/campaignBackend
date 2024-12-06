import nxPlugin from '@nx/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**']
  },
  {
    plugins: {
      '@nx': nxPlugin,
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.base.json']
      }
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ]
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['error', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    extends: ['plugin:@nx/javascript']
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    env: {
      node: true,
      vitest: true
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]; 