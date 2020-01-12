function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  const { loaderOptions, rule = {} } = options;

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: [/\.stories\.(jsx?$|tsx?$)/],
          ...rule,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('@storybook/source-loader'),
              options: loaderOptions,
            },
          ],
        },
      ],
    },
  };
}

function managerEntries(entry = []) {
  return [...entry, require.resolve('@storybook/addon-storysource/register')];
}

module.exports = { webpack, managerEntries };
