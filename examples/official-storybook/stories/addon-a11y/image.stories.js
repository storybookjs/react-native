/* eslint-disable */
import React from 'react';

const text = 'Testing the a11y addon';
const image = 'http://placehold.it/350x150';

export default {
  title: 'Addons|A11y/Image',
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const withoutAlt = () => <img src={image} />;
withoutAlt.story = {
  name: 'Without alt',
};

export const withoutAltButUnchecked = () => <img src={image} />;
withoutAltButUnchecked.story = {
  name: 'Without alt but unchecked',
  parameters: {
    a11y: {
      config: {
        disableOtherRules: true,
        rules: [],
      },
      options: {},
    },
  },
};

export const withAlt = () => <img src={image} alt={text} />;
withAlt.story = {
  name: 'With alt',
};

export const Presentation = () => <img role="presentation" src={image} />;
