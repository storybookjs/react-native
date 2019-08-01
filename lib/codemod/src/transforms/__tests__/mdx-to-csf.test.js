import { defineTest } from 'jscodeshift/dist/testUtils';

const testNames = [
  'basic',
  'decorators',
  'parameters',
  'story-parameters',
  'exclude-stories',
  'story-refs',
  'plaintext',
  'story-function',
];

testNames.forEach(testName => {
  defineTest(__dirname, `mdx-to-csf`, null, `mdx-to-csf/${testName}`);
});
