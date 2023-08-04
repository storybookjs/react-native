import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
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
