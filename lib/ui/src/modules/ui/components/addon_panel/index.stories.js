import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddonPanel from './index';

const panels = {
  test1: {
    title: 'Test 1',
    render() {
      return <div id="test1">TEST 1</div>;
    },
  },
  test2: {
    title: 'Test 2',
    render() {
      return <div id="test2">TEST 2</div>;
    },
  },
};

const onPanelSelect = action('onPanelSelect');
storiesOf('ui/AddonPanel', module)
  .addDecorator(s => <div style={{ height: '100px', display: 'flex' }}>{s()}</div>)
  .add('default', () => (
    <AddonPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel="test2" />
  ))
  .add('no panels', () => <AddonPanel panels={{}} onPanelSelect={onPanelSelect} />);
