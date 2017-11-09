import React from 'react';
import PropTypes from 'prop-types';
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

const withTests = (results, options) => (...testFiles) => {

  const emitAddTests = ({ kind, story }) => {
    addons.getChannel().emit('storybook/tests/add_tests', {
      kind,
      storyName: story,
      tests: findTestResults(testFiles, results, options.filesExt),
    });
  };

  return (storyFn, { kind, story }) => {
    emitAddTests({ kind, story });
    return storyFn();
  };
}

export default withTests;

