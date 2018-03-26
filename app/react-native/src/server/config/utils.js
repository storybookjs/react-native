import webpack from 'webpack';
import path from 'path';

export const OccurenceOrderPlugin =
  // for webpack 2
  webpack.optimize.OccurrenceOrderPlugin ||
  // for webpack 1
  webpack.optimize.OccurenceOrderPlugin;

export const includePaths = [path.resolve('./')];

export const excludePaths = [path.resolve('./node_modules')];

export const nodeModulesPaths = path.resolve('./node_modules');
