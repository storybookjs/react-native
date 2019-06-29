import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Addon|Links',
};

export const goToWelcome = () => ({
  template:
    '<my-button :rounded="true" :handle-click="click" >This buttons links to Welcome</my-button>',
  methods: {
    click: linkTo('Welcome'),
  },
});

goToWelcome.story = {
  name: 'Go to welcome',
};
