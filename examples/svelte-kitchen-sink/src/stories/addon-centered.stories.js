import { storiesOf } from '@storybook/svelte';
import Centered from '@storybook/addon-centered/svelte';

import ButtonView from './views/ButtonView.svelte';

storiesOf('Addon|Centered', module)
  .addDecorator(Centered)
  .add('rounded', () => ({
    Component: ButtonView,
    data: {
      rounded: true,
      text: 'You should see this',
    },
  }));
