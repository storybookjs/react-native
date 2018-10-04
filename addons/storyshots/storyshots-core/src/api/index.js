import global, { describe } from 'global';
import addons, { mockChannel } from '@storybook/addons';
import { addSerializer } from 'jest-specific-snapshot';
import ensureOptionsDefaults from './ensureOptionsDefaults';
import snapshotsTests from './snapshotsTestsTemplate';
import integrityTest from './integrityTestTemplate';
import loadFramework from '../frameworks/frameworkLoader';

global.STORYBOOK_REACT_CLASSES = global.STORYBOOK_REACT_CLASSES || {};

const methods = ['beforeAll', 'beforeEach', 'afterEach', 'afterAll'];

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

  if (options.snapshotSerializers) {
    options.snapshotSerializers.forEach(serializer => {
      addSerializer(serializer);
      expect.addSnapshotSerializer(serializer);
    });
  }

  const { storybook, framework, renderTree, renderShallowTree } = loadFramework(options);
  const storiesGroups = storybook.getStorybook();

  if (storiesGroups.length === 0) {
    throw new Error('storyshots found 0 stories');
  }

  const {
    asyncJest,
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
    asyncJest,
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
