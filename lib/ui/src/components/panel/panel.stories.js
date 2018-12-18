import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import Panel from './panel';

const panels = {
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
  .addDecorator(s => <div style={{ height: 'calc(100vh - 20px)' }}>{s()}</div>)
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
