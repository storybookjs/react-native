import React from 'react';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/react';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Some really long story kind description',
  decorators: [centered],
};

export const Story1 = () => <Button onClick={action('clicked')}>Hello Button</Button>;
Story1.story = { name: 'with text' };
