import VueLoaderPlugin from 'vue-loader/lib/plugin';
import { mergeBabel } from '@storybook/core/server';

function extendWebpack(config) {
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

function extendBabel(config) {
  const patch = {
    presets: [require.resolve('babel-preset-vue')],
  };

  return mergeBabel(patch, config);
}

export default {
  extendWebpack,
  extendBabel,
};
