import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.tsx'],
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: ['src/index.tsx'],
          resolve: true,
        }
      : false,
  };
});
