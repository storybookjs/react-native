module.exports = {
  env: {
    development: {
      presets: ['babel-preset-expo'],
      plugins: ['@babel/plugin-transform-react-jsx-source'],
    },
    production: {
      presets: ['babel-preset-expo'],
      plugins: [],
    },
    storybook: {
      presets: [],
      plugins: [],
    },
  },
};
