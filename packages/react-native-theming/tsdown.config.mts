import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    format: ['cjs'],
    fixedExtension: false,
    deps: {
      onlyBundle: false,
    },
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.ts'],
          resolve: true,
        }
      : false,
  };
});
