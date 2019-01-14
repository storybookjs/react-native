import React from 'react';
import { storiesOf } from '@storybook/react';
import { withTests } from '@storybook/addon-jest';

import results from './addon-jest.testresults.json';

storiesOf('Addons|Jest', module)
  .addDecorator(withTests({ results }))
  .add('withTests', () => <p>Hello</p>, { jest: 'addon-jest' });
