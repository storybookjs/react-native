import { storiesOf } from '@storybook/vue';
import Centered from '@storybook/addon-centered';

import Button from './Button.vue';

storiesOf('Addon|Centered', module)
  .addDecorator(Centered)
  .add('rounded', () => ({
    Component: Button,
    data: {
      rounded: true,
    },
  }));
