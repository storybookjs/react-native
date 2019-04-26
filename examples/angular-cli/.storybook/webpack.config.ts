import { resolve } from 'path';

module.exports = async ({ config }: { config: any }) => {
  config.module.rules.push({
    test: [/\.stories\.tsx?$/, /index\.ts$/],
    loaders: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: {
          parser: 'typescript',
        },
      },
    ],
    include: [resolve(__dirname, '../src')],
    enforce: 'pre',
  });
  return config;
};
