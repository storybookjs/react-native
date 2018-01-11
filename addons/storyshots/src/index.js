/* eslint-disable no-loop-func */
import fs from 'fs';
import glob from 'glob';
import global, { describe, it, beforeEach, afterEach } from 'global';
import addons from '@storybook/addons';
import loadFramework from './frameworkLoader';
import createChannel from './storybook-channel-mock';
import { getPossibleStoriesFiles, getSnapshotFileName } from './utils';
import { imageSnapshot } from './test-body-image-snapshot';

import {
  multiSnapshotWithOptions,
  snapshotWithOptions,
  snapshot,
  shallowSnapshot,
  renderOnly,
} from './test-bodies';

global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

export {
  getSnapshotFileName,
  snapshot,
  multiSnapshotWithOptions,
  snapshotWithOptions,
  shallowSnapshot,
  renderOnly,
  imageSnapshot,
};

export default function testStorySnapshots(options = {}) {
  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  addons.setChannel(createChannel());

  const { storybook, framework, renderTree, renderShallowTree } = loadFramework(options);
  const stories = storybook.getStorybook();

  if (stories.length === 0) {
    throw new Error('storyshots found 0 stories');
  }

  // NOTE: keep `suit` typo for backwards compatibility
  const suite = options.suite || options.suit || 'Storyshots';
  // NOTE: Added not to break existing storyshots configs (can be removed in a future major release)
  const storyNameRegex = options.storyNameRegex || options.storyRegex;

  const snapshotOptions = {
    renderer: options.renderer,
    serializer: options.serializer,
  };

  const testMethod = options.test || snapshotWithOptions({ options: snapshotOptions });

  // eslint-disable-next-line
  for (const group of stories) {
    const { fileName, kind } = group;

    if (options.storyKindRegex && !kind.match(options.storyKindRegex)) {
      // eslint-disable-next-line
      continue;
    }

    describe(suite, () => {
      beforeEach(() => {
        if (typeof testMethod.beforeEach === 'function') {
          return testMethod.beforeEach();
        }
        return Promise.resolve();
      });

      afterEach(() => {
        if (typeof testMethod.afterEach === 'function') {
          return testMethod.afterEach();
        }
        return Promise.resolve();
      });

      describe(kind, () => {
        // eslint-disable-next-line
        for (const story of group.stories) {
          if (storyNameRegex && !story.name.match(storyNameRegex)) {
            // eslint-disable-next-line
            continue;
          }

          it(story.name, () => {
            const context = { fileName, kind, story: story.name, framework };
            return testMethod({
              story,
              context,
              renderTree,
              renderShallowTree,
            });
          });
        }
      });
    });
  }
}

describe('Storyshots Integrity', () => {
  test('Abandoned Storyshots', () => {
    const storyshots = glob.sync('**/*.storyshot');

    const abandonedStoryshots = storyshots.filter(fileName => {
      const possibleStoriesFiles = getPossibleStoriesFiles(fileName);
      return !possibleStoriesFiles.some(fs.existsSync);
    });
    expect(abandonedStoryshots).toHaveLength(0);
  });
});
