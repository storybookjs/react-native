import addons from '@storybook/addons';
import deprecate from 'util-deprecate';

const findTestResults = (testFiles, jestTestResults, jestTestFilesExt) =>
  [].concat(testFiles).map(name => {
    if (jestTestResults && jestTestResults.testResults) {
      return {
        name,
        result: jestTestResults.testResults.find(t =>
          new RegExp(`${name}${jestTestFilesExt}`).test(t.name)
        ),
      };
    }
    return { name };
  });

const emitAddTests = ({ kind, story, testFiles, options }) => {
  addons.getChannel().emit('storybook/tests/add_tests', {
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

    if (testFiles && !testFiles.skip) {
      emitAddTests({ kind, story, testFiles, options });
    }

    return story();
  };
};
