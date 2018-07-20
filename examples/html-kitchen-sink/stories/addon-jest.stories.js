import { storiesOf } from '@storybook/html';

import { withTests } from '@storybook/addon-jest';
import results from './addon-jest.testresults.json';

storiesOf('Addons|jest', module)
  .addDecorator(withTests({ results }))
  .add('withTests', () => 'This story shows test results', { jest: 'addon-jest' });
