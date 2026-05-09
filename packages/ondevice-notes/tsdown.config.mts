import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts', 'src/register.tsx'],
    format: ['cjs'],
    fixedExtension: false,
    deps: {
      onlyBundle: false,
    },
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.ts', 'src/register.tsx'],
          resolve: true,
        }
      : false,
    // needed to pre-bundle the markdown package
    loader: {
      '.js': 'jsx',
    },
  };
});
