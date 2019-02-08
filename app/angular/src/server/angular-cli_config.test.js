import { getAngularCliWebpackConfigOptions } from './angular-cli_config';
import angularJson from '../../../../examples/angular-cli/angular.json';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  join: () => 'angular.json',
  resolve: () => 'tsconfig.json',
}));

const setupFiles = files => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('angualr-cli_config', () => {
  describe('getAngularCliWebpackConfigOptions()', () => {
    it('should return have empty `buildOptions.sourceMap` and `buildOptions.optimization` by default', () => {
      setupFiles({ 'angular.json': JSON.stringify(angularJson) });

      const config = getAngularCliWebpackConfigOptions('/');

      expect(config).toMatchObject({
        buildOptions: {
          sourceMap: {},
          optimization: {},
        },
      });
    });
  });
});
