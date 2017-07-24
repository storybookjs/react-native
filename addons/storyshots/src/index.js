import path from 'path';
import fs from 'fs';
import global, { describe, it } from 'global';
import readPkgUp from 'read-pkg-up';
import addons from '@storybook/addons';

import runWithRequireContext from './require_context';
import createChannel from './storybook-channel-mock';
import { snapshot } from './test-bodies';

export { snapshotWithOptions, snapshot, shallowSnapshot, renderOnly } from './test-bodies';

let storybook;
let configPath;
global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

const babel = require('babel-core');

const pkg = readPkgUp.sync().pkg;

const hasDependency = name =>
  (pkg.devDependencies && pkg.devDependencies[name]) ||
  (pkg.dependencies && pkg.dependencies[name]) || fs.existsSync(path.join('node_modules', name, 'package.json'));

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  const isStorybook =
    options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
  const isRNStorybook =
    options.framework === 'react-native' ||
    (!options.framework && hasDependency('@storybook/react-native'));

  if (isStorybook) {
    storybook = require.requireActual('@storybook/react');
    // eslint-disable-next-line
    const loadBabelConfig = require('@storybook/react/dist/server/babel_config')
      .default;
    const configDirPath = path.resolve(options.configPath || '.storybook');
    configPath = path.join(configDirPath, 'config.js');

    const babelConfig = loadBabelConfig(configDirPath);
    const content = babel.transformFileSync(configPath, babelConfig).code;
    const contextOpts = {
      filename: configPath,
      dirname: configDirPath,
    };

    runWithRequireContext(content, contextOpts);
  } else if (isRNStorybook) {
    storybook = require.requireActual('@storybook/react-native');
    configPath = path.resolve(options.configPath || 'storybook');
    require.requireActual(configPath);
  } else {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  // NOTE: keep `suit` typo for backwards compatibility
  const suite = options.suite || options.suit || 'Storyshots';
  const stories = storybook.getStorybook();

  // Added not to break existing storyshots configs (can be removed in a future major release)
  // eslint-disable-next-line
  options.storyNameRegex = options.storyNameRegex || options.storyRegex;
  // eslint-disable-next-line
  options.test = options.test || snapshot;

  // eslint-disable-next-line
  for (const group of stories) {
    if (options.storyKindRegex && !group.kind.match(options.storyKindRegex)) {
      // eslint-disable-next-line
      continue;
    }

    describe(suite, () => {
      describe(group.kind, () => {
        // eslint-disable-next-line
        for (const story of group.stories) {
          if (options.storyNameRegex && !story.name.match(options.storyNameRegex)) {
            // eslint-disable-next-line
            continue;
          }

          it(story.name, () => {
            const context = { kind: group.kind, story: story.name };
            options.test({ story, context });
          });
        }
      });
    });
  }
}
