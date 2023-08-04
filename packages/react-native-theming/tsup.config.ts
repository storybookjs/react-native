import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    // minify: !options.watch,
    clean: true,
    dts: {
      entry: 'src/index.ts',
      resolve: true,
      // compilerOptions: {

      // }
    },
  };
});
