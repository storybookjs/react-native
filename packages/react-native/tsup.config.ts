import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.ts',
      'src/preview.ts',
      'src/metro/withStorybook.ts',
      'src/stub.tsx',
      'src/node/index.ts',
    ],
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: [
            'src/index.ts',
            'src/preview.ts',
            'src/metro/withStorybook.ts',
            'src/node/index.ts',
          ],
          resolve: true,
        }
      : false,
  };
});
