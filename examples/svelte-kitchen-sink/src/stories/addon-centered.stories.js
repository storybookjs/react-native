import { storiesOf } from '@storybook/svelte';
import Centered from '@storybook/addon-centered/svelte';

import Button from '../components/Button.svelte';

storiesOf('Addon|Centered', module)
  .addDecorator(Centered)
  .add('rounded', () => ({
    Component: Button,
    data: {
      rounded: true,
      text: "Look, I'm centered!",
    },
  }));
