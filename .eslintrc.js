// doing this to override the extends of the normal config
// since prettier/react is no longer required
const conf = require('@react-native-community/eslint-config');

module.exports = {
  ...conf,
  root: true,
  extends: ['prettier'],
  rules: {
    ...conf.rules,
    'react-native/no-inline-styles': 'off',
  },
  overrides: [...conf.overrides, { files: ['*.ts', '*.tsx'], rules: { 'no-undef': 'off' } }],
};
