import { defineTest } from 'jscodeshift/dist/testUtils';

const testNames = [
  'basic',
  'decorators',
  'parameters',
  'story-parameters',
  'module',
  'multi',
  'default',
];

testNames.forEach(testName => {
  defineTest(
    __dirname,
    `convert-storiesof-to-module`,
    null,
    `convert-storiesof-to-module/${testName}`
  );
});
