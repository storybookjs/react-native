import { storiesOf } from '@storybook/svelte';

import WelcomeView from './views/WelcomeView.svelte';
import ButtonView from './views/ButtonView.svelte';

storiesOf('Welcome', module).add('Welcome', () => ({
  Component: WelcomeView.default,
}));

storiesOf('Button', module)
  .add('rounded', () => ({
    Component: ButtonView.default,
    props: {
      rounded: true,
      message: 'Rounded text',
    },
  }))
  .add('square', () => ({
    Component: ButtonView.default,
    props: {
      rounded: false,
      message: 'Squared text',
    },
  }));
