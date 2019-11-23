import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Addon/Links',
};

export const GoToWelcome = () => ({
  template: '<my-button :rounded="true" @click="click" >This buttons links to Welcome</my-button>',
  methods: {
    click: linkTo('Welcome'),
  },
});

GoToWelcome.story = {
  name: 'Go to welcome',
};
