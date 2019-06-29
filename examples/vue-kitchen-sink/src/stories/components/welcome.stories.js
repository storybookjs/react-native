import { linkTo } from '@storybook/addon-links';

import Welcome from '../Welcome.vue';

export default {
  title: 'Welcome',
  parameters: {
    component: Welcome,
  },
};

export const welcome = () => ({
  render: h => h(Welcome, { props: { goToButton: linkTo('Button') } }),
});
welcome.story = { welcome };
