/** @jsx h */

import { h } from 'preact';

import Centered from '@storybook/addon-centered/preact';
import Button from '../Button';

export default {
  title: 'Addons|Centered',
  decorators: [Centered],

  parameters: {
    component: Centered,
  },
};

export const button = () => <Button>A button</Button>;
button.story = { name: 'Button ' };
