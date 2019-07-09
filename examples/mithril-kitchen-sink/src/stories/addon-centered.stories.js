/** @jsx m */

import m from 'mithril';
import Centered from '@storybook/addon-centered/mithril';
import Button from '../Button';

export default {
  title: 'Addons|Centered',
  decorators: [Centered],
  parameters: {
    component: Centered,
  },
};

export const button = () => ({
  view: () => <Button>A button</Button>,
});
