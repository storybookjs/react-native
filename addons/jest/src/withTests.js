import addons from '@storybook/addons';

const basename = path => path.split('/').slice(-1)[0];

const findTestResults = (testFiles, jestTestResults, jestTestFilesExt) =>
  testFiles.map(name => {
    const fileName = name + jestTestFilesExt;
    if (jestTestResults && jestTestResults.testResults) {
      return {
        fileName,
        name,
        result: jestTestResults.testResults.find(t => basename(t.name) === fileName),
      };
    }
    return { fileName, name };
  });

const emitAddTests = ({ kind, story, testFiles, results, options }) => {
  addons.getChannel().emit('storybook/tests/add_tests', {
    kind,
    storyName: story,
    tests: findTestResults(testFiles, results, options.filesExt),
  });
};

const withTests = (results, options) => (...testFiles) => (storyFn, { kind, story }) => {
  emitAddTests({ kind, story, testFiles, results, options });
  return storyFn();
};

export default withTests;
