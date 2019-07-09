import { TransformOptions } from '@babel/core';

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    presets: [
      ...config.presets,
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-flow'),
    ],
    plugins: [
      ...(config.plugins || []),
      require.resolve('@babel/plugin-transform-react-constant-elements'),
      require.resolve('babel-plugin-add-react-displayname'),
    ],
  };
}
