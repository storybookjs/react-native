import * as results from '../.jest-test-results.json';
import { withTests } from '@storybook/addon-jest';

export const wTests = withTests({
  results,
  filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$'
});
