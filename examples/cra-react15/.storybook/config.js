import { configure, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';

function loadStories() {
  require('../src/stories');
}

addParameters({
  options: {
    theme: create({ colorPrimary: 'hotpink', colorSecondary: 'orangered' }),
  },
});

configure(loadStories, module);
