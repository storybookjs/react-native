// eslint-disable-next-line import/no-extraneous-dependencies
import { Configuration } from 'webpack';

export function webpack(config: Configuration) {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: [
            new RegExp(`src(.*)\\.js$`),
            new RegExp(`packages(\\/|\\\\)*(\\/|\\\\)src(\\/|\\\\)(.*)\\.js$`),
            new RegExp(`node_modules(\\/|\\\\)lit-html(.*)\\.js$`),
            new RegExp(`node_modules(\\/|\\\\)lit-element(.*)\\.js$`),
            new RegExp(`node_modules(\\/|\\\\)@open-wc(.*)\\.js$`),
            new RegExp(`node_modules(\\/|\\\\)@polymer(.*)\\.js$`),
            new RegExp(`node_modules(\\/|\\\\)@vaadin(.*)\\.js$`),
          ],
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                // webpack does not support import.meta.url yet, so we rewrite them in babel
                ['bundled-import-meta', { importStyle: 'baseURI' }],
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'entry',
                    corejs: 3,
                  },
                ],
              ],
              babelrc: false,
            },
          },
        },
      ],
    },
  };
}
