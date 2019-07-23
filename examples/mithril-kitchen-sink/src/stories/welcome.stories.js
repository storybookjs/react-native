import m from 'mithril';
import { linkTo } from '@storybook/addon-links';
import Welcome from '../Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const story1 = () => ({
  view: () => m(Welcome, { showApp: linkTo('Button') }),
});
story1.story = { name: 'to Storybook' };
