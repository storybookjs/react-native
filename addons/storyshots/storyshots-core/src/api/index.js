import global, { describe } from 'global';
import addons, { mockChannel } from '@storybook/addons';
import snapshotsTests from './snapshotsTestsTemplate';
import integrityTest from './integrityTestTemplate';
import getIntegrityOptions from './getIntegrityOptions';
import loadFramework from '../frameworks/frameworkLoader';
import Stories2SnapsConverter from '../Stories2SnapsConverter';
import { snapshotWithOptions } from '../test-bodies';

global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

const defaultStories2SnapsConverter = new Stories2SnapsConverter();
const methods = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];

function ensureOptionsDefaults(options) {
  const {
    suite = 'Storyshots',
    storyNameRegex,
    storyKindRegex,
    renderer,
    serializer,
    stories2snapsConverter = defaultStories2SnapsConverter,
    test: testMethod = snapshotWithOptions({ renderer, serializer }),
  } = options;

  const integrityOptions = getIntegrityOptions(options);

  return {
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    integrityOptions,
  };
}

function callTestMethodGlobals(testMethod) {
  methods.forEach(method => {
    if (typeof testMethod[method] === 'function') {
      global[method](testMethod[method]);
    }
  });
}

function testStorySnapshots(options = {}) {
  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  addons.setChannel(mockChannel());

  const { storybook, framework, renderTree, renderShallowTree } = loadFramework(options);
  const storiesGroups = storybook.getStorybook();

  if (storiesGroups.length === 0) {
    throw new Error('storyshots found 0 stories');
  }

  const {
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    integrityOptions,
  } = ensureOptionsDefaults(options);

  const testMethodParams = {
    renderTree,
    renderShallowTree,
    stories2snapsConverter,
  };

  callTestMethodGlobals(testMethod);

  snapshotsTests({
    groups: storiesGroups,
    suite,
    framework,
    storyKindRegex,
    storyNameRegex,
    testMethod,
    testMethodParams,
  });

  integrityTest(integrityOptions, stories2snapsConverter);
}

export default testStorySnapshots;
