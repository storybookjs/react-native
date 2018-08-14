import { storiesOf } from '@storybook/svelte';
import { withBackgrounds } from '@storybook/addon-backgrounds';

import ButtonView from './views/ButtonView.svelte';

storiesOf('Addon|Backgrounds', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ])
  )
  .add('story 1', () => ({
    Component: ButtonView,
  }));
