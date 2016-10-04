import webpack from 'webpack';
import path from 'path';

export const OccurenceOrderPlugin =
  // for webpack 2
  webpack.optimize.OccurrenceOrderPlugin ||
  // for webpack 1
  webpack.optimize.OccurenceOrderPlugin;

export const includePaths = [
  path.resolve('./'),
];

export const excludePaths = [
  path.resolve('./node_modules'),
];

export const nodeModulesPaths = path.resolve('./node_modules');

export const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(p => path.resolve('./', p));

// Load environment variables starts with STORYBOOK_ to the client side.
export function loadEnv(options = {}) {
  const defaultNodeEnv = options.production ? 'production' : 'development';
  const env = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || defaultNodeEnv),
  };

  Object.keys(process.env)
    .filter(name => /^STORYBOOK_/.test(name))
    .forEach((name) => {
      env[`process.env.${name}`] = JSON.stringify(process.env[name]);
    });

  return env;
}
