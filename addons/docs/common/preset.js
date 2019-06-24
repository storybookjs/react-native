const createCompiler = require('../mdx-compiler-plugin');

function createBabelOptions({ babelOptions, configureJSX }) {
  if (!configureJSX) {
    return babelOptions;
  }

  return {
    ...babelOptions,
    // for frameworks that are not working with react, we need to configure
    // the jsx to transpile mdx, for now there will be a flag for that
    // for more complex solutions we can find alone that we need to add '@babel/plugin-transform-react-jsx'
    plugins: [...babelOptions.plugins, '@babel/plugin-transform-react-jsx'],
  };
}

function webpack(webpackConfig = {}, options = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const { babelOptions, configureJSX } = options;

  return {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        // {
        //   test: [/\.stories\.(jsx?$|ts?$)/],
        //   enforce: 'pre',
        //   use: [
        //     {
        //       loader: require.resolve('@storybook/addon-storysource/loader'),
        //       options: {
        //         injectParameters: true,
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.stories.mdx$/,
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
          exclude: /\.stories.mdx$/,
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
      ],
    },
  };
}

function addons(entry = []) {
  return [
    ...entry,
    // require.resolve('@storybook/addon-storysource/register'),
    require.resolve('../register'),
  ];
}

module.exports = { webpack, addons };
