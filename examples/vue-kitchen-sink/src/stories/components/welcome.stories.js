import { linkTo } from '@storybook/addon-links';

import Welcome from '../Welcome.vue';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const welcome = () => {
  return {
    render: h => h(Welcome, { props: { goToButton: linkTo('Button') } }),
  };
};
