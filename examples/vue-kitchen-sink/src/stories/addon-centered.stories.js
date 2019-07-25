import Centered from '@storybook/addon-centered/vue';

import MyButton from './Button.vue';

export default {
  title: 'Addon|Centered',
  component: MyButton,
  decorators: [Centered],
};

export const rounded = () => ({
  components: { MyButton },
  template: '<my-button :rounded="true">A Button with rounded edges</my-button>',
});
