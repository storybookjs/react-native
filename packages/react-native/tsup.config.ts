import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts', 'src/preview/StartV7.tsx'],
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.ts', 'src/preview/StartV7.tsx'],
          resolve: true,
        }
      : false,
  };
});
