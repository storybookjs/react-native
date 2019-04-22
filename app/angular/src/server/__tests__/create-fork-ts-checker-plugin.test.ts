import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import getTsLoaderOptions from '../ts_config';
import createForkTsCheckerInstance from '../create-fork-ts-checker-plugin';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('./fs'));
jest.mock('path', () => ({
  resolve: () => 'tsconfig.json',
}));

const setupFiles = files => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('create-fork-ts-checker-plugin.test', () => {
  it('should create a ForkTsCheckerWebpackPlugin instance', () => {
    setupFiles({ 'tsconfig.json': '{}' });

    // todo add proper typing
    const tsLoaderOptions: any = getTsLoaderOptions('.foo');

    // todo resolve any
    const instance: any = createForkTsCheckerInstance(tsLoaderOptions);

    expect(instance).toBeInstanceOf(ForkTsCheckerWebpackPlugin);
    expect(instance.tsconfig).toEqual(tsLoaderOptions.configFile);
  });

  it('should create a ForkTsCheckerWebpackPlugin instance without passing options', () => {
    // add proper typing
    const instance = createForkTsCheckerInstance({} as any);
    expect(instance).toBeInstanceOf(ForkTsCheckerWebpackPlugin);
  });
});
