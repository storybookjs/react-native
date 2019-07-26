import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import BaseButton from '../../components/BaseButton';

const JSXDescription = (
  <div>
    <h2>This is a JSX info section</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare massa rutrum metus
      commodo, a mattis velit dignissim. Fusce vestibulum turpis sed massa egestas pharetra. Sed at
      libero nulla.
    </p>
    <p>
      <a href="https://github.com/storybookjs/react-storybook-addon-info">This is a link</a>
    </p>
    <p>
      <img alt="350x150" src="http://placehold.it/350x150" />
    </p>
  </div>
);

export default {
  title: 'Addons|Info/JSX',
  decorators: [withInfo],
};

export const displaysJsxInDescription = () => (
  <BaseButton onClick={action('clicked')} label="Button" />
);

displaysJsxInDescription.story = {
  name: 'Displays JSX in description',

  parameters: {
    info: { text: JSXDescription },
  },
};
