import * as path from 'path';

describe('enhanceRepackConfig', () => {
  test('swaps entry when swap data is provided', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js', plugins: [] };

    const result = enhanceRepackConfig(rspackConfig, {
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.entry).toBe('/project/.rnstorybook/index.tsx');
  });

  test('keeps the entry when no swap data', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js', plugins: [] };

    const result = enhanceRepackConfig(rspackConfig);

    expect(result.entry).toBe('./src/index.js');
    expect(result.plugins).toEqual([]);
  });

  test('aliases #.storybook/preview to the config dir', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js', plugins: [] };

    const result = enhanceRepackConfig(rspackConfig, { configPath: '/project/.rnstorybook' });

    expect(result.resolve.alias['#.storybook/preview']).toBe(
      path.join('/project/.rnstorybook', 'preview')
    );
  });

  test('preserves other config properties', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const existingPlugin = { apply: jest.fn() };
    const rspackConfig = {
      entry: './src/index.js',
      plugins: [existingPlugin],
      module: { rules: [] },
    };

    const result = enhanceRepackConfig(rspackConfig, {
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.entry).toBe('/project/.rnstorybook/index.tsx');
    expect(result.plugins).toHaveLength(1);
    expect(result.plugins[0]).toBe(existingPlugin);
    expect(result.module).toEqual({ rules: [] });
  });

  test('handles config without entry field', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { plugins: [] };

    const result = enhanceRepackConfig(rspackConfig, {
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.entry).toBe('/project/.rnstorybook/index.tsx');
  });
});
