import m from 'mithril';
import { linkTo } from '@storybook/addon-links';
import Welcome from '../Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const Story1 = () => ({
  view: () => m(Welcome, { showApp: linkTo('Button') }),
});
Story1.story = { name: 'to Storybook' };
