import { storiesOf } from '@storybook/svelte';

import WelcomeView from './views/WelcomeView.svelte';
import ButtonView from './views/ButtonView.svelte';

storiesOf('Welcome', module).add('Welcome', () => ({
  Component: WelcomeView,
}));

storiesOf('Button', module)
  .add('rounded', () => ({
    Component: ButtonView,
    data: {
      rounded: true,
      message: 'Rounded text',
    },
  }))
  .add('square', () => ({
    Component: ButtonView,
    data: {
      rounded: false,
      message: 'Squared text',
    },
  }));
