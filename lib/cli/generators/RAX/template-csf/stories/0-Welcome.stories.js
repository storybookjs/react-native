import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';

export default {
  title: 'Welcome',
  component: Welcome,
};

export const ToStorybook = () => <Welcome showApp={linkTo('Button', 'with text')} />;

ToStorybook.story = {
  name: 'to Storybook',
};
