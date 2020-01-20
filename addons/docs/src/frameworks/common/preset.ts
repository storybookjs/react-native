/* eslint-disable import/no-extraneous-dependencies */
import createCompiler from '@storybook/addon-docs/mdx-compiler-plugin';
import remarkSlug from 'remark-slug';
import remarkExternalLinks from 'remark-external-links';

function createBabelOptions(babelOptions?: any, configureJSX?: boolean) {
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

export function webpack(webpackConfig: any = {}, options: any = {}) {
  const { module = {} } = webpackConfig;
  // it will reuse babel options that are already in use in storybook
  // also, these babel options are chained with other presets.
  const {
    babelOptions,
    configureJSX = options.framework !== 'react', // if not user-specified
    sourceLoaderOptions = {},
  } = options;

  const mdxLoaderOptions = {
    remarkPlugins: [remarkSlug, remarkExternalLinks],
  };

  // set `sourceLoaderOptions` to `null` to disable for manual configuration
  const sourceLoader = sourceLoaderOptions
    ? [
        {
          test: /\.(stories|story)\.[tj]sx?$/,
          loader: require.resolve('@storybook/source-loader'),
          options: { ...sourceLoaderOptions, inspectLocalDependencies: true },
          enforce: 'pre',
        },
      ]
    : [];

  const result = {
    ...webpackConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          test: /\.js$/,
          include: /node_modules\/acorn-jsx/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [[require.resolve('@babel/preset-env'), { modules: 'commonjs' }]],
              },
            },
          ],
        },
        {
          test: /\.(stories|story).mdx$/,
          use: [
            {
              loader: 'babel-loader',
              options: createBabelOptions(babelOptions, configureJSX),
            },
            {
              loader: '@mdx-js/loader',
              options: {
                compilers: [createCompiler(options)],
                ...mdxLoaderOptions,
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
              options: createBabelOptions(babelOptions, configureJSX),
            },
            {
              loader: '@mdx-js/loader',
              options: mdxLoaderOptions,
            },
          ],
        },
        ...sourceLoader,
      ],
    },
  };
  return result;
}

export function managerEntries(entry: any[] = [], options: any) {
  return [...entry, require.resolve('../../register')];
}

export function config(entry: any[] = [], options: any = {}) {
  const { framework } = options;
  const docsConfig = [require.resolve('./config')];
  try {
    docsConfig.push(require.resolve(`../${framework}/config`));
  } catch (err) {
    // there is no custom config for the user's framework, do nothing
  }
  return [...docsConfig, ...entry];
}
