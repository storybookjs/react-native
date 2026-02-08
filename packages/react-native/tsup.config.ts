import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.ts',
      'src/preview.ts',
      'src/metro/withStorybook.ts',
      'src/repack/withStorybook.ts',
      'src/stub.tsx',
      'src/node.ts',
    ],
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: [
            'src/index.ts',
            'src/preview.ts',
            'src/metro/withStorybook.ts',
            'src/repack/withStorybook.ts',
            'src/node.ts',
          ],
          resolve: true,
        }
      : false,
  };
});
