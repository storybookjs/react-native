import { storiesOf } from '@storybook/svelte';

import ButtonView from './views/ButtonView.svelte';

storiesOf('Addon|Backgrounds', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add('story 1', () => ({
    Component: ButtonView,
  }));
