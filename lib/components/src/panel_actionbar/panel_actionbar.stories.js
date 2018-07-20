import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ActionBar, ActionButton } from './panel_actionbar';

const action1 = action('action1');
storiesOf('Components|PanelActionBar', module)
  .add('single item', () => (
    <ActionBar>
      <ActionButton onClick={action1}>CLEAR</ActionButton>
    </ActionBar>
  ))
  .add('3 items', () => (
    <ActionBar>
      <ActionButton onClick={action1}>Nr1</ActionButton>
      <ActionButton onClick={action1}>Nr2</ActionButton>
      <ActionButton onClick={action1}>Nr3</ActionButton>
    </ActionBar>
  ));
