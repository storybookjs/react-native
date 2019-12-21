import getTsLoaderOptions from '../ts_config';

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs', () => require('../../../../../__mocks__/fs'));
jest.mock('path', () => ({
  resolve: () => 'tsconfig.json',
}));
jest.mock('@storybook/node-logger');

const setupFiles = (files: any) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('ts_config', () => {
  it('should return the config with the path to the tsconfig.json', () => {
    setupFiles({ 'tsconfig.json': '{}' });

    const config = getTsLoaderOptions('.foo');

    expect(config).toEqual({
      transpileOnly: true,
      configFile: 'tsconfig.json',
    });
  });

  it('should return object with transpileOnly: true when there is no tsconfig.json', () => {
    setupFiles({});

    const config = getTsLoaderOptions('.foo');

    expect(config).toEqual({
      transpileOnly: true,
    });
  });
});
