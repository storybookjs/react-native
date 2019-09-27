import stripJsonComments from 'strip-json-comments';
import { Path } from '@angular-devkit/core';
import { getAngularCliWebpackConfigOptions } from '../angular-cli_config';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../../__mocks__/fs'));
jest.mock('path', () => ({
  join: (...args) =>
    args[args.length - 1] === 'angular.json'
      ? 'angular.json'
      : jest.requireActual('path').join(...args),
  resolve: (...args) => 'tsconfig.json',
}));

const angularJson = jest
  .requireActual('fs')
  .readFileSync(jest.requireActual('path').resolve(__dirname, 'angular.json'), 'utf8');

const setupFiles = (files: any) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('angular-cli_config', () => {
  describe('getAngularCliWebpackConfigOptions()', () => {
    it('should return have empty `buildOptions.sourceMap` and `buildOptions.optimization` by default', () => {
      setupFiles({ 'angular.json': angularJson });

      const config = getAngularCliWebpackConfigOptions('/' as Path);

      expect(config).toMatchObject({
        buildOptions: {
          sourceMap: {},
          optimization: {},
        },
      });
    });

    it('should use `storybook` project by default when project is defined', () => {
      // Lazy clone example angular json
      const overrideAngularJson = JSON.parse(stripJsonComments(angularJson));
      // Add storybook project
      overrideAngularJson.projects.storybook = {
        architect: {
          build: {
            options: {
              assets: [],
              styles: ['custom/styles'],
            },
          },
        },
      };

      setupFiles({ 'angular.json': JSON.stringify(overrideAngularJson) });

      const config = getAngularCliWebpackConfigOptions('/' as Path);

      // Assure configuration matches values from `storybook` project
      expect(config).toMatchObject({
        buildOptions: {
          assets: [],
          styles: ['custom/styles'],
        },
      });
    });
  });
});
