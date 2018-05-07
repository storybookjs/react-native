import { storiesOf } from '@storybook/html';

import { withTests } from '@storybook/addon-jest';
import results from './addon-jest.testresults.json';

const withTestsFiles = withTests({
  results,
});

storiesOf('Addons|jest', module)
  .addDecorator(withTestsFiles('addon-jest'))
  .add('withTests', () => 'This story shows test results');
