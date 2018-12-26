import { precompile } from 'ember-source/dist/ember-template-compiler';

export function babel(config) {
  const babelConfigPlugins = config.plugins || [];

  const extraPlugins = [
    [require.resolve('babel-plugin-htmlbars-inline-precompile'), { precompile }],
    [require.resolve('babel-plugin-ember-modules-api-polyfill')],
  ];

  return {
    ...config,
    plugins: [].concat(babelConfigPlugins, extraPlugins),
  };
}
