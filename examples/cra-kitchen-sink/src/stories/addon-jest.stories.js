import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTests } from '@storybook/addon-jest';
import results from './addon-jest.testresults.json';

const withTestsFiles = withTests({
  results,
});

storiesOf('Addon jest', module)
  .addDecorator(withTestsFiles('addon-jest'))
  .add('withTests', () => (
    <div>
      <p>Hello</p>
    </div>
  ));
