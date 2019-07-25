import { mount } from '@storybook/riot';
import { linkTo } from '@storybook/addon-links';

import './Welcome.tag';

export default {
  title: 'Welcome',
};

export const toStorybook = () => mount('welcome', { showApp: () => linkTo('Button') });

toStorybook.story = {
  name: 'to Storybook',
};
