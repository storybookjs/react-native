import { storiesOf } from '@storybook/vue';
import { linkTo } from '@storybook/addon-links';

storiesOf('Addon|Links', module).add('Go to welcome', () => ({
  template:
    '<my-button :rounded="true" :handle-click="click" >This buttons links to Welcome</my-button>',
  methods: {
    click: linkTo('Welcome'),
  },
}));
