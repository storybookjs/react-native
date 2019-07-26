const createCompiler = require('../mdx-compiler-plugin');

function createBabelOptions({ babelOptions, configureJSX }) {
  if (!configureJSX) {
    return babelOptions;
  }

  const babelPlugins = (babelOptions && babelOptions.plugins) || [];
  return {
    ...babelOptions,
    // for frameworks that are not working with react, we need to configure
    // the jsx to transpile mdx, for now there will be a flag for that
    // for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
    plugins: [...babelPlugins, '@babel/plugin-transform-react-jsx'],
  };
}

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const { babelOptions, configureJSX, sourceLoaderOptions = {} } = options;

  // set `sourceLoaderOptions` to `null` to disable for manual configuration
  const sourceLoader = sourceLoaderOptions
    ? [
        {
          test: /\.(stories|story)\.[tj]sx?$/,
          loader: require.resolve('@storybook/source-loader'),
          options: sourceLoaderOptions,
          enforce: 'pre',
        },
      ]
    : [];

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /\.(stories|story).mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBabelOptions({ babelOptions, configureJSX }),
            },
            {
              loader: '@mdx-js/loader',
              options: {
                compilers: [createCompiler(options)],
              },
            },
          ],
        },
        {
          test: /\.mdx$/,
          exclude: /\.(stories|story).mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBabelOptions({ babelOptions, configureJSX }),
            },
            {
              loader: '@mdx-js/loader',
            },
          ],
        },
        ...sourceLoader,
      ],
    },
  };
}

function addons(entry = []) {
  return [...entry, require.resolve('../register')];
}

module.exports = { webpack, addons };
