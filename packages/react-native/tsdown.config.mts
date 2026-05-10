import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.ts',
      'src/preview.ts',
      'src/withStorybook.ts',
      'src/metro/withStorybook.ts',
      'src/repack/withStorybook.ts',
      'src/stub.tsx',
      'src/node.ts',
    ],
    format: ['cjs'],
    fixedExtension: false,
    deps: {
      onlyBundle: false,
    },
    define: {
      'import.meta': '{}',
    },
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: [
            'src/index.ts',
            'src/preview.ts',
            'src/withStorybook.ts',
            'src/metro/withStorybook.ts',
            'src/repack/withStorybook.ts',
            'src/node.ts',
          ],
          resolve: true,
        }
      : false,
  };
});
