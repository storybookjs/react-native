import global, { describe } from 'global';
import addons, { mockChannel } from '@storybook/addons';
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

const isDisabled = parameter => parameter === false || (parameter && parameter.disable === true);

function testStorySnapshots(options = {}) {
  if (typeof describe !== 'function') {
    throw new Error('testStorySnapshots is intended only to be used inside jest');
  }

  addons.setChannel(mockChannel());

  const { storybook, framework, renderTree, renderShallowTree } = loadFramework(options);
  const {
    asyncJest,
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    integrityOptions,
    snapshotSerializers,
  } = ensureOptionsDefaults(options);
  const testMethodParams = {
    renderTree,
    renderShallowTree,
    stories2snapsConverter,
  };

  const data = storybook
    .raw()
    .filter(({ name }) => (storyNameRegex ? name.match(storyNameRegex) : true))
    .filter(({ kind }) => (storyKindRegex ? kind.match(storyKindRegex) : true))
    .reduce((acc, item) => {
      const { kind, storyFn: render, parameters } = item;
      const existing = acc.find(i => i.kind === kind);
      const { fileName } = item.parameters;

      if (!isDisabled(parameters.storyshots)) {
        if (existing) {
          existing.children.push({ ...item, render, fileName });
        } else {
          acc.push({
            kind,
            children: [{ ...item, render, fileName }],
          });
        }
      }
      return acc;
    }, []);

  if (data.length) {
    callTestMethodGlobals(testMethod);

    snapshotsTests({
      data,
      asyncJest,
      suite,
      framework,
      testMethod,
      testMethodParams,
      snapshotSerializers,
    });

    integrityTest(integrityOptions, stories2snapsConverter);
  } else {
    throw new Error('storyshots found 0 stories');
  }
}

export default testStorySnapshots;
