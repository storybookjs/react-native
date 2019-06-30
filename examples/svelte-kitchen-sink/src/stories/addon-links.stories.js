import { linkTo } from '@storybook/addon-links';

import ActionLinkView from './views/ActionLinkView.svelte';

export default {
  title: 'Addon|Links',
};

export const goToWelcomeView = () => ({
  Component: ActionLinkView,
  on: {
    click: linkTo('Welcome'),
  },
});

goToWelcomeView.story = {
  name: 'Go to welcome view',
};
