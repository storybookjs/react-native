import { defineTest } from 'jscodeshift/dist/testUtils';

jest.mock('@storybook/node-logger');

const testNames = [
  'basic',
  'decorators',
  'parameters',
  'story-parameters',
  'module',
  'multi',
  'default',
  'exports',
  'collision',
  'const',
  'story-decorators',
];

testNames.forEach(testName => {
  defineTest(__dirname, `storiesof-to-csf`, null, `storiesof-to-csf/${testName}`);
});
