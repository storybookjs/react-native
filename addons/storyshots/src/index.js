import renderer from 'react-test-renderer';
import path from 'path';
import readPkgUp from 'read-pkg-up';
import addons from '@storybook/addons';
import runWithRequireContext from './require_context';
import createChannel from './storybook-channel-mock';

const { describe, it, expect } = global;

let storybook;
let configPath;

const babel = require('babel-core');

const pkg = readPkgUp.sync().pkg;
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies['@storybook/react']) ||
  (pkg.dependencies && pkg.dependencies['@storybook/react']);
const isRNStorybook =
  (pkg.devDependencies && pkg.devDependencies['@storybook/react-native']) ||
  (pkg.dependencies && pkg.dependencies['@storybook/react-native']);

export default function testStorySnapshots(options = {}) {
  addons.setChannel(createChannel());

  if (isStorybook) {
    storybook = require.requireActual('@storybook/react');

    // eslint-disable-next-line global-require
    const { default: loadBabelConfig } = require('@storybook/react/dist/server/babel_config');
    const configDirPath = path.resolve(options.configPath || '.storybook');
    const babelConfig = loadBabelConfig(configDirPath);

    configPath = path.join(configDirPath, 'config.js');

    const { code: content } = babel.transformFileSync(configPath, babelConfig);
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

  const suit = options.suit || 'Storyshots';
  const stories = storybook.getStorybook();

  /* eslint-disable no-continue, no-restricted-syntax */
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
            const renderedStory = story.render(context);
            const tree = renderer.create(renderedStory).toJSON();
            expect(tree).toMatchSnapshot();
          });
        }
      });
    });
  }
}
