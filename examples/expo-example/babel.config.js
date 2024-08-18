// const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }]],
    // plugins: [
    //   [
    //     'babel-plugin-react-docgen',
    //     {
    //       ignore: [
    //         '**/node_modules/**',
    //         '**/__tests__/**',
    //         '**/__mocks__/**',
    //         path.resolve(__dirname, '../../node_modules/*'),
    //       ],
    //     },
    //   ],
    // ],
  };
};
