import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTests } from '@storybook/addon-jest';
import results from './addon-jest.testresults.json';

storiesOf('Addons|jest', module)
  .addDecorator(withTests({ results }))
  .add(
    'withTests',
    () => (
      <div>
        <p>Hello</p>
      </div>
    ),
    { jest: 'addon-jest' }
  );
