import addons from '@storybook/addons';

const findTestResults = (testFiles, jestTestResults, jestTestFilesExt) =>
  testFiles.map(name => {
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

  return (...testFiles) => (storyFn, { kind, story }) => {
    emitAddTests({ kind, story, testFiles, options });

    return storyFn();
  };
};
