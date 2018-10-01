import { storiesOf } from '@storybook/svelte';
import { linkTo } from '@storybook/addon-links';

import ActionLinkView from './views/ActionLinkView.svelte';

storiesOf('Addon|Links', module).add('Go to welcome view', () => ({
  Component: ActionLinkView,
  on: {
    click: linkTo('Welcome'),
  },
}));
