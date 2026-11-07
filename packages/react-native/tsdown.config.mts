import path from 'node:path';
import { defineConfig } from 'tsdown';

/**
 * Keeps image requires (e.g. the controls color picker's `color-circle.png`) as runtime `require`s
 * so Metro and Re.Pack resolve them as assets. The image is copied to `dist/assets`, and the
 * require is rewritten to point there (all the entries that reach it are in the root of `dist`).
 */
const externalAssets = {
  name: 'storybook-rn-external-assets',
  resolveId(source: string, importer: string | undefined) {
    if (importer && /\.(png|jpe?g|gif|webp)$/.test(source)) {
      return { id: `./assets/${path.basename(source)}`, external: 'relative' };
    }
    return null;
  },
};

export default defineConfig((options) => {
  return {
    entry: [
      'src/index.ts',
      'src/preview.ts',
      'src/withStorybook.ts',
      'src/metro/withStorybook.ts',
      'src/repack/withStorybook.ts',
      'src/stub.tsx',
      'src/node.ts',
    ],
    format: ['cjs'],
    fixedExtension: false,
    deps: {
      onlyBundle: false,
    },
    plugins: [externalAssets],
    copy: [
      {
        from: 'src/controls/components/color-picker/resources/color-circle.png',
        to: 'dist/assets',
      },
    ],
    define: {
      'import.meta': '{}',
    },
    // minify: !options.watch,
    clean: !options.watch,
    dts: !options.watch
      ? {
          entry: [
            'src/index.ts',
            'src/preview.ts',
            'src/withStorybook.ts',
            'src/metro/withStorybook.ts',
            'src/repack/withStorybook.ts',
            'src/node.ts',
          ],
          resolve: true,
        }
      : false,
  };
});
