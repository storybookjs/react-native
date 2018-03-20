/** @jsx m */

import m from 'mithril';

import { storiesOf } from '@storybook/mithril';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/mithril/demo';

storiesOf('Addons|Actions', module)
  .add('Action only', () => ({
    view: () => <Button onclick={action('logo1')}>Click me to log the action</Button>,
  }))
  .add('Action and method', () => ({
    view: () => (
      <Button
        onclick={e => {
          e.preventDefault();
          action('log2')(e.target);
        }}
      >
        Click me to log the action
      </Button>
    ),
  }));
