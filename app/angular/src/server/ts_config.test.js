import loadTsConfig from './ts_config';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  resolve: () => 'tsconfig.json',
}));

const setupFiles = files => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('ts_config', () => {
  it('should return the config with the path to the tsconfig.json', () => {
    setupFiles({ 'tsconfig.json': '{}' });

    const config = loadTsConfig('.foo');

    expect(config).toEqual({
      configFile: 'tsconfig.json',
    });
  });

  it('should return empty object when there is no tsconfig.json', () => {
    setupFiles({});

    const config = loadTsConfig('.foo');

    expect(config).toEqual({});
  });
});
