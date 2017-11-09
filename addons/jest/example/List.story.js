/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';

import withTests from './withTests';
import List from './List';

storiesOf('List', module)
  .addDecorator(withTests('List'))
  .add('3 items', () => (
    <List items={['foo', 'bar']} />
  ));
