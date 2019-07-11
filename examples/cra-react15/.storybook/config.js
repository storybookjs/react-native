import { load, addParameters } from '@storybook/react';
import { create } from '@storybook/theming/create';

addParameters({
  options: {
    theme: create({ colorPrimary: 'hotpink', colorSecondary: 'orangered' }),
  },
});

load(require.context('../src/stories', true, /\.stories\.js$/), module);
