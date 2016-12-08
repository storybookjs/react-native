import renderer from 'react-test-renderer';
import path from 'path';
import readPkgUp from 'read-pkg-up';

const { describe, it, expect } = global;

let storybook;
let defaultStoriesPath;

const pkg = readPkgUp.sync().pkg;
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/storybook']);
const isRNStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/react-native-storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/react-native-storybook']);

export default function testStorySnapshots(options = {}) {
  if (isStorybook) {
    // eslint-disable-next-line  global-require, import/no-unresolved
    storybook = require('@kadira/storybook');

    defaultStoriesPath = path.resolve('.storybook/config.js');
  } else if (isRNStorybook) {
    // eslint-disable-next-line  global-require, import/no-unresolved
    storybook = require('@kadira/react-native-storybook');

    defaultStoriesPath = path.resolve('storybook/stories');
  } else {
    throw new Error('\'storyshots\' is intended only to be used with react storybook or react native storybook');
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(options.storiesPath || defaultStoriesPath);
  } catch (e) {
    throw new Error("Could not load stories. Check 'storiesPath' option");
  }

  if (typeof describe !== 'function') {
    throw new Error('\'testStorySnapshots\' is intended only to be used inside jest');
  }

  const suit = options.suit || 'Storybook Snapshots';
  const stories = storybook.getStorybook();

  for (const group of stories) {
    describe(suit, () => {
      describe(group.kind, () => {
        for (const story of group.stories) {
          it(story.name, () => {
            const renderedStory = story.render();
            const tree = renderer.create(renderedStory).toJSON();
            expect(tree).toMatchSnapshot();
          });
        }
      });
    });
  }
}
