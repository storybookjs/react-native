import { mount } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';

import './Welcome.tag';

export default {
  title: 'Welcome',
};

export const ToStorybook = () => mount('welcome', { showApp: () => linkTo('Button') });

ToStorybook.story = {
  name: 'to Storybook',
};
