import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

export default {
  title: 'Addons|Knobs.withKnobs using options',
  decorators: [
    withKnobs({
      escapeHTML: false,
    }),
  ],
};

export const acceptsOptions = () => <div>{text('Rendered string', '<h1>Hello</h1>')}</div>;
acceptsOptions.story = {
  name: 'accepts options',
};
