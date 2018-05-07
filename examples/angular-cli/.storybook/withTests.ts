import * as results from '../addon-jest.testresults.json';
import { withTests } from '@storybook/addon-jest';

export const wTests = withTests({
  results,
  filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
});
