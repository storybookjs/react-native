// const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo']],
    plugins: [
      [
        'babel-plugin-react-docgen-typescript',
        {
          include: 'examples/expo-example/.*\\.tsx$',
          exclude: 'node_modules',
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
