import { defineTest } from 'jscodeshift/dist/testUtils';

const testNames = [
  'basic',
  'decorators',
  'parameters',
  'story-parameters',
  'exclude-stories',
  'story-function',
];

testNames.forEach(testName => {
  defineTest(__dirname, `csf-to-mdx`, null, `csf-to-mdx/${testName}`);
});
