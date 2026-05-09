import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  return {
    entry: ['src/index.tsx'],
    format: ['cjs'],
    fixedExtension: false,
    deps: {
      onlyBundle: false,
    },
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.tsx'],
          resolve: true,
        }
      : false,
  };
});
