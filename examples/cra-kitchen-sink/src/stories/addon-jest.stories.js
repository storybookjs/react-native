import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTests } from '@storybook/addon-jest';
import SimpleList from '../components/SimpleList';

import results from '.cache/jest-results.json';

const withTestsFiles = withTests({
  results,
});

storiesOf('Addon jest', module)
  .addDecorator(withTestsFiles('SimpleList'))
  .add('withTests', () => <SimpleList items={['apple', 'orange', 'banana']} />);
