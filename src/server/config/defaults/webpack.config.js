import autoprefixer from 'autoprefixer';
import { includePaths } from '../paths';

// Add a default custom config which is similar to what React Create App does.
module.exports = (storybookBaseConfig, configType) => {
  const newConfig = storybookBaseConfig;
  newConfig.module.loaders = [
    ...newConfig.module.loaders,
    {
      test: /\.css?$/,
      include: includePaths,
      loader: 'style!css!postcss',
    },
    {
      test: /\.json$/,
      include: includePaths,
      loader: 'json',
    },
    {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: includePaths,
      loader: 'file',
      query: {
        name: 'static/media/[name].[ext]',
      },
    },
    {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: includePaths,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'static/media/[name].[ext]',
      },
    },
  ];

  newConfig.postcss = () => {
    return [autoprefixer];
  };

  // Return the altered config
  return newConfig;
};
