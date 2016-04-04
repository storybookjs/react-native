import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

const logger = console;

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    admin: [
      'stack-source-map/register',
      path.resolve(__dirname, '../client/init_admin'),
    ],
    preview: [
      'stack-source-map/register',
      'webpack-hot-middleware/client',
      path.resolve(__dirname, '../client/init_preview'),
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: { presets: ['react', 'es2015', 'stage-2'] },
        exclude: [path.resolve('./node_modules'), path.resolve(__dirname, 'node_modules')],
        include: [path.resolve('./'), __dirname],
      },
    ],
  },
};

const configDir = path.resolve('./.storybook');

// load babelrc file.
const babelrcPath = path.resolve('./.babelrc');
if (fs.existsSync(babelrcPath)) {
  logger.info('=> Using custom .babelrc configurations.');
  const babelrcContent = fs.readFileSync(babelrcPath);
  try {
    const babelrc = JSON.parse(babelrcContent);
    config.module.loaders[0].query = babelrc;
  } catch (ex) {
    logger.error(`=> Error parsing .babelrc file: ${ex.message}`);
    throw ex;
  }
}

// add config path to the entry
const storybookConfigPath = path.resolve(configDir, 'config.js');
if (!fs.existsSync(storybookConfigPath)) {
  logger.error('=> Create a storybook config file in ".storybook/config.js".\n');
  process.exit(0);
}
config.entry.preview.push(storybookConfigPath);

// load custom webpack configurations
const customConfigPath = path.resolve(configDir, 'webpack.config.js');
if (fs.existsSync(customConfigPath)) {
  const customConfig = require(customConfigPath);
  if (customConfig.module.loaders) {
    logger.info('=> Loading custom webpack loaders.');
    config.module.loaders =
      config.module.loaders.concat(customConfig.module.loaders);
  }

  if (customConfig.plugins) {
    logger.info(' => Loading custom webpack plugins.');
    config.plugins = config.plugins.concat(customConfig.plugins);
  }
}

export default config;
