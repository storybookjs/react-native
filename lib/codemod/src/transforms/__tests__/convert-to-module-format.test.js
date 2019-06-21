import { defineTest } from 'jscodeshift/dist/testUtils';

const testNames = ['multi'];
// const testNames = ['basic', 'decorators', 'parameters', 'story-parameters', 'module'];

testNames.forEach(testName => {
  defineTest(__dirname, `convert-to-module-format`, null, `convert-to-module-format/${testName}`);
});
