import { snapshotWithOptions } from '../test-bodies';
import Stories2SnapsConverter from '../Stories2SnapsConverter';

const ignore = ['**/node_modules/**'];
const defaultStories2SnapsConverter = new Stories2SnapsConverter();

function getIntegrityOptions({ integrityOptions }) {
  if (integrityOptions === false) {
    return false;
  }

  if (typeof integrityOptions !== 'object') {
    return false;
  }

  return {
    ...integrityOptions,
    ignore: [...ignore, ...(integrityOptions.ignore || [])],
    absolute: true,
  };
}

function ensureOptionsDefaults(options) {
  const {
    suite = 'Storyshots',
    asyncJest,
    storyNameRegex,
    storyKindRegex,
    renderer,
    serializer,
    snapshotSerializers,
    stories2snapsConverter = defaultStories2SnapsConverter,
    test: testMethod = snapshotWithOptions({ renderer, serializer }),
  } = options;

  const integrityOptions = getIntegrityOptions(options);

  return {
    asyncJest,
    suite,
    storyNameRegex,
    storyKindRegex,
    stories2snapsConverter,
    testMethod,
    snapshotSerializers,
    integrityOptions,
  };
}

export default ensureOptionsDefaults;
