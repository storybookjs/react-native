import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: {
      index: 'src/index.ts',
      preview: 'src/preview.ts',
      'metro/withStorybook': 'src/metro/withStorybook.ts',
      'metro/withStorybookConfig': 'src/metro/withStorybookConfig.ts',
      backgrounds: 'src/core-addons/backgrounds/index.tsx',
    },
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: {
            index: 'src/index.ts',
            preview: 'src/preview.ts',
            'metro/withStorybook': 'src/metro/withStorybook.ts',
            'metro/withStorybookConfig': 'src/metro/withStorybookConfig.ts',
            backgrounds: 'src/core-addons/backgrounds/index.tsx',
          },
          resolve: true,
        }
      : false,
  };
});
