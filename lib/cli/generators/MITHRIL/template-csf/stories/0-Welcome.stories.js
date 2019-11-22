import m from 'mithril';
import { linkTo } from '@storybook/addon-links';
import Welcome from './Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => ({
  view: () => m(Welcome, { showApp: linkTo('Button') }),
});

ToStorybook.story = {
  name: 'to Storybook',
};
