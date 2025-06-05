const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const globals = require('globals');
const reactCompiler = require('eslint-plugin-react-compiler');

module.exports = defineConfig([
  {
    ignores: [
      '.yarn/**',
      '**/dist/**',
      'packages/react-native/template/**/*',
      'packages/react-native/src/rn-host-detect.js',
      '**/storybook.requires.ts',
      'examples/expo-example/.expo/**/*',
      'docs/build/**/*',
    ],
  },
  expoConfig,
  reactCompiler.configs.recommended,
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
]);
