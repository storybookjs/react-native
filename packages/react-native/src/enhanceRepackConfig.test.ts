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

  test('adds resolve alias for liteMode', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js', resolve: {} };

    const result = enhanceRepackConfig(rspackConfig, {
      liteMode: true,
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.resolve.alias['@storybook/react-native-ui$']).toBe(false);
  });

  test('preserves existing resolve aliases in liteMode', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = {
      entry: './src/index.js',
      resolve: { alias: { 'my-lib': '/custom/path' } },
    };

    const result = enhanceRepackConfig(rspackConfig, {
      liteMode: true,
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.resolve.alias['my-lib']).toBe('/custom/path');
    expect(result.resolve.alias['@storybook/react-native-ui$']).toBe(false);
  });

  test('does not add resolve alias when liteMode is false', () => {
    const { enhanceRepackConfig } = require('./enhanceRepackConfig');
    const rspackConfig = { entry: './src/index.js' };

    const result = enhanceRepackConfig(rspackConfig, {
      liteMode: false,
      swap: {
        appEntryPoint: '/project/src/index.js',
        storybookEntryPoint: '/project/.rnstorybook/index.tsx',
      },
    });

    expect(result.resolve).toBeUndefined();
  });
});
