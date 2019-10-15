import stripJsonComments from 'strip-json-comments';
import { Path } from '@angular-devkit/core';
import * as fs from 'fs';
import * as path from 'path';
import {
  getAngularCliWebpackConfigOptions,
  getLeadingAngularCliProject,
} from '../angular-cli_config';

describe('angular-cli_config', () => {
  it('should return have empty `buildOptions.sourceMap` and `buildOptions.optimization` by default', () => {
    const config = getAngularCliWebpackConfigOptions(__dirname as Path);
    expect(config).toMatchObject({
      buildOptions: {
        sourceMap: {},
        optimization: {},
      },
    });
  });

  it('should use `storybook` project by default when `storybook` project is defined', () => {
    // Lazy clone example angular json
    const angularJson = fs.readFileSync(path.resolve(__dirname, 'angular.json'), 'utf8');
    const angularJsonWithStorybookProject = JSON.parse(stripJsonComments(angularJson));

    // Add storybook project
    angularJsonWithStorybookProject.projects.storybook = {
      architect: {
        build: {
          options: {
            assets: [],
            styles: ['custom/styles'],
          },
        },
      },
    };

    const projectConfig = getLeadingAngularCliProject(angularJsonWithStorybookProject);

    // Assure configuration matches values from `storybook` project
    expect(projectConfig).toMatchObject({
      architect: {
        build: {
          options: {
            assets: [],
            styles: ['custom/styles'],
          },
        },
      },
    });
  });
});
