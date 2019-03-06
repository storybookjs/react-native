import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Panel from './panel';

export const panels = {
  test1: {
    title: 'Test 1',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) =>
      active ? (
        <div id="test1" key={key}>
          TEST 1
        </div>
      ) : null,
  },
  test2: {
    title: 'Test 2',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) =>
      active ? (
        <div id="test2" key={key}>
          TEST 2
        </div>
      ) : null,
  },
};

const onSelect = action('onSelect');
const toggleVisibility = action('toggleVisibility');
const togglePosition = action('togglePosition');

storiesOf('UI|Panel', module)
  .add('default', () => (
    <Panel
      panels={panels}
      actions={{ onSelect, toggleVisibility, togglePosition }}
      selectedPanel="test2"
    />
  ))
  .add('no panels', () => (
    <Panel panels={{}} actions={{ onSelect, toggleVisibility, togglePosition }} />
  ));
