import addons from '@storybook/addons';
import deprecate from 'util-deprecate';
import { normalize } from 'upath';

import { ADD_TESTS } from './shared';

const findTestResults = (testFiles, jestTestResults, jestTestFilesOptions) =>
  Object.values(testFiles).map(name => {
    const fileName = `${name}${jestTestFilesOptions.filesExt}`;
    if (jestTestResults && jestTestResults.testResults) {
      return {
        fileName,
        name,
        result: jestTestResults.testResults.find(t => normalize(t.name).includes(fileName)),
      };
    }
    return { fileName, name };
  });

const emitAddTests = ({ kind, story, testFiles, options }) => {
  addons.getChannel().emit(ADD_TESTS, {
    kind,
    storyName: story,
    tests: findTestResults(testFiles, options.results, options.filesExt),
  });
};

export const withTests = userOptions => {
  const defaultOptions = {
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.js)?$',
  };
  const options = Object.assign({}, defaultOptions, userOptions);

  return (...args) => {
    if (typeof args[0] === 'string') {
      return deprecate((story, { kind }) => {
        emitAddTests({ kind, story, testFiles: args, options });

        return story();
      }, 'Passing component filenames to the `@storybook/addon-jest` via `withTests` is deprecated. Instead, use the `jest` story parameter');
    }

    const [
      story,
      {
        kind,
        parameters: { jest: testFiles },
      },
    ] = args;

    if (testFiles && !testFiles.disable) {
      emitAddTests({ kind, story, testFiles: [].concat(testFiles), options });
    }

    return story();
  };
};
