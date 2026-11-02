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
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    // On iOS 17+, `cursor: 'pointer'` gives a view a UIKit pointer hover effect. On iPadOS with a
    // mouse or trackpad that inserts views Fabric doesn't know about, and unmounting a sibling then
    // crashes debug builds (facebook/react-native#55489). On web, TouchableOpacity and Pressable
    // already show a pointer cursor.
    files: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Property[key.name='cursor'][value.value='pointer']",
          message:
            "Don't set `cursor: 'pointer'`: on iPadOS it crashes debug builds when sibling views unmount (facebook/react-native#55489), and touchables already show a pointer cursor on web.",
        },
      ],
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
