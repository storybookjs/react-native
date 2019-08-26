import m from 'mithril';
import { linkTo } from '@storybook/addon-links';
import Welcome from './Welcome';

export default {
  title: 'Welcome',
};

export const toStorybook = () => ({
  view: () => m(Welcome, { showApp: linkTo('Button') }),
});

toStorybook.story = {
  name: 'to Storybook',
};
