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

  test('returns config unchanged when no swap data', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js', plugins: [] };

    const result = enhanceRepackConfig(rspackConfig);

    expect(result).toBe(rspackConfig);
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
