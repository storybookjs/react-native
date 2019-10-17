import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <Welcome showApp={linkTo('Button', 'with text')} />;

toStorybook.story = {
  name: 'to Storybook',
};
