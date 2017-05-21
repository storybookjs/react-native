import path from 'path';
import readPkgUp from 'read-pkg-up';
import addons from '@storybook/addons';
import runWithRequireContext from './require_context';
import createChannel from './storybook-channel-mock';
import { snapshot } from './test-bodies';
const { describe, it, expect } = global;

export { snapshot, renderOnly } from './test-bodies';

let storybook;
let configPath;

const babel = require('babel-core');

const pkg = readPkgUp.sync().pkg;

const hasDependency = function(name) {
  return (
    (pkg.devDependencies && pkg.devDependencies[name]) ||
    (pkg.dependencies && pkg.dependencies[name])
  );
};

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  const isStorybook = options.framework === 'react' || hasDependency('@storybook/react');
  const isRNStorybook =
    options.framework === 'react-native' || hasDependency('@storybook/react-native');

  if (isStorybook) {
    storybook = require.requireActual('@storybook/react');
    const loadBabelConfig = require('@storybook/react/dist/server/babel_config').default;
    const configDirPath = path.resolve(options.configPath || '.storybook');
    configPath = path.join(configDirPath, 'config.js');

    const content = babel.transformFileSync(configPath, babelConfig).code;
    const contextOpts = {
      filename: configPath,
      dirname: configDirPath,
    };
    const babelConfig = loadBabelConfig(configDirPath);

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

  const suit = options.suit || 'Storyshots';
  const stories = storybook.getStorybook();

  // Added not to break existing storyshots configs (can be removed in a future major release)
  options.storyNameRegex = options.storyNameRegex || options.storyRegex;

  options.test = options.test || snapshot;

  for (const group of stories) {
    if (options.storyKindRegex && !group.kind.match(options.storyKindRegex)) {
      continue;
    }

    describe(suit, () => {
      describe(group.kind, () => {
        for (const story of group.stories) {
          if (options.storyNameRegex && !story.name.match(options.storyNameRegex)) {
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
