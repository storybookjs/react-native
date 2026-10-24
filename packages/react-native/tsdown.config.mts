import { defineConfig } from 'tsdown';

const entry = {
  index: 'src/index.ts',
  preview: 'src/preview.ts',
  test: 'src/test/index.ts',
  withStorybook: 'src/withStorybook.ts',
  'metro/withStorybook': 'src/metro/withStorybook.ts',
  'repack/withStorybook': 'src/repack/withStorybook.ts',
  stub: 'src/stub.tsx',
  node: 'src/node.ts',
};

// Type declarations for every entry except the stub.
const { stub: _stub, ...typedEntry } = entry;

export default defineConfig((options) => {
  return {
    entry,
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
          entry: Object.values(typedEntry),
          resolve: true,
        }
      : false,
  };
});
