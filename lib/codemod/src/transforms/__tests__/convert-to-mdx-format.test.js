import { defineTest } from 'jscodeshift/dist/testUtils';

const testNames = ['basic'];
// const testNames = ['basic', 'decorators', 'parameters', 'story-parameters', 'module', 'multi'];

testNames.forEach(testName => {
  defineTest(__dirname, `convert-to-mdx-format`, null, `convert-to-mdx-format/${testName}`);
});
