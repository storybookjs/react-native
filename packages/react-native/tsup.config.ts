import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts', 'src/V6.ts', 'src/preview.ts'],
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.ts', 'src/V6.ts', 'src/preview.ts'],
          resolve: true,
        }
      : false,
  };
});
