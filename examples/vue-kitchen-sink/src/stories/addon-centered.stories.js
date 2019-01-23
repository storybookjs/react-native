import { storiesOf } from '@storybook/vue';
import Centered from '@storybook/addon-centered/vue';

import MyButton from './Button.vue';

storiesOf('Addon|Centered', module)
  .addDecorator(Centered)
  .add('rounded', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">A Button with rounded edges</my-button>',
  }));
