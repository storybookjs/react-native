module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    requireConfigFile: false,
  },
  rules: {
    'react-native/no-inline-styles': 'off',
    'react/react-in-jsx-scope': 'off',
    curly: ['error', 'multi-line'],
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useStyle',
      },
    ],
  },
};
