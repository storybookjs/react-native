const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const pluginDocusaurus = require('@docusaurus/eslint-plugin');

module.exports = defineConfig([
  {
    ignores: [
      '.yarn/**',
      '**/dist/**',
      'packages/react-native/template/**/*',
      'packages/react-native/src/rn-host-detect.js',
      'packages/react-native/scripts/mocks/**/*',
      '**/storybook.requires.ts',
      'examples/expo-example/.expo/**/*',
      'examples/expo-example/.maestro/**/*',
      'docs/build/**/*',
    ],
  },

  ...expoConfig.map((config) => ({
    ...config,
    ignores: [...(config.ignores || []), 'docs/**/*'],
  })),
  {
    files: ['**/*.spec.js', '**/*.spec.jsx', '**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/array-type': 'off',
    },
  },
  {
    files: ['docs/**/*.ts', 'docs/**/*.tsx'],
    plugins: {
      '@docusaurus': pluginDocusaurus,
    },
    rules: pluginDocusaurus.configs.recommended.rules,
  },
]);
