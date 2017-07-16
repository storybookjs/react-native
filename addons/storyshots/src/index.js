import path from 'path';
import global, { describe, it } from 'global';
import readPkgUp from 'read-pkg-up';
import addons from '@storybook/addons';

import createChannel from './storybook-channel-mock';
import { snapshot } from './test-bodies';

export { snapshotWithOptions, snapshot, shallowSnapshot, renderOnly } from './test-bodies';

let getStorybook;
let configOutput;
let configPath;
global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

const pkg = readPkgUp.sync().pkg;

const hasDependency = name =>
  (pkg.devDependencies && pkg.devDependencies[name]) ||
  (pkg.dependencies && pkg.dependencies[name]);

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  const isStorybook = options.framework === 'react' || hasDependency('@storybook/react');
  const isRNStorybook =
    options.framework === 'react-native' || hasDependency('@storybook/react-native');

  if (isStorybook) {
    getStorybook = require.requireActual('@storybook/react').getStorybook;
    // eslint-disable-next-line
    // const loadBabelConfig = require('@storybook/react/dist/server/babel_config').default;
    const configDirPath = path.resolve(options.configPath || '.storybook');
    configPath = path.join(configDirPath, 'config.js');

    // const babelConfig = loadBabelConfig(configDirPath);
    // const content = babel.transformFileSync(configPath, babelConfig).code;
    // const contextOpts = {
    //   filename: configPath,
    //   dirname: configDirPath,
    // };

    // runWithRequireContext(content, contextOpts);
    configOutput = require.requireActual(configPath);
  } else if (isRNStorybook) {
    getStorybook = require.requireActual('@storybook/react-native').getStorybook;
    configPath = path.resolve(options.configPath || 'storybook');
    configOutput = require.requireActual(configPath);
  } else {
    throw new Error('storyshots is intended only to be used with storybook');
  }

  if (typeof describe !== 'function') {
    throw new Error('storyshots is intended only to be used inside jest');
  }

  if (typeof configOutput.default === 'function') {
    getStorybook = configOutput.default;
  }

  // NOTE: keep `suit` typo for backwards compatibility
  const suite = options.suite || options.suit || 'Storyshots';
  const stories = getStorybook();

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
