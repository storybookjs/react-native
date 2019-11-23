import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { Configuration } from 'webpack';

export function webpack(config: Configuration) {
  return {
    ...config,
    plugins: [...config.plugins, new VueLoaderPlugin()],
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.vue$/,
          loader: require.resolve('vue-loader'),
          options: {},
        },
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, '.vue'],
      alias: {
        ...config.resolve.alias,
        vue$: require.resolve('vue/dist/vue.esm.js'),
      },
    },
  };
}

export function babelDefault(config: any) {
  return {
    ...config,
    presets: [...config.presets, require.resolve('babel-preset-vue')],
  };
}
