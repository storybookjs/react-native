import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.tsx',
      'src/gen-maestro.ts',
      'src/screenshot-stories.ts',
      'src/compare-screenshots.ts',
    ],
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: [
            'src/index.tsx',
            'src/gen-maestro.ts',
            'src/screenshot-stories.ts',
            'src/compare-screenshots.ts',
          ],
          resolve: true,
        }
      : false,
    format: ['cjs'],
  };
});
