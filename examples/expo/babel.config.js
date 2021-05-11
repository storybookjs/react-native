// eslint-disable-next-line func-names

// require("storybook/react-native/babel-preval")

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['babel-plugin-macros'],
  };
};
