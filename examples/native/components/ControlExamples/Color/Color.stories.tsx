import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Color } from './Color';

const ColorMeta: ComponentMeta<typeof Color> = {
  title: 'Color control',
  parameters: { notes: '- test' },
  argTypes: {
    color: {
      control: { type: 'color' },
    },
  },
};

export default ColorMeta;

type ColorStory = ComponentStory<typeof Color>;

export const ColorExample: ColorStory = (args) => <Color {...args} />;
ColorExample.args = {
  color: 'purple',
};
