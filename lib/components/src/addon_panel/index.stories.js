import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddonPanel from './index';

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

const onPanelSelect = action('onPanelSelect');
storiesOf('Components|AddonPanel', module)
  .addDecorator(s => <div style={{ height: 'calc(100vh - 20px)' }}>{s()}</div>)
  .add('default', () => (
    <AddonPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel="test2" />
  ))
  .add('no panels', () => <AddonPanel panels={{}} onPanelSelect={onPanelSelect} />);
