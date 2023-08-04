module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // TODO fix this
    // plugins: [['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }]],
  };
};
