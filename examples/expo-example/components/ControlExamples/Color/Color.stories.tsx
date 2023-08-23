import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Color } from './Color';

const ColorMeta: ComponentMeta<typeof Color> = {
  title: 'ControlExamples/Color control',
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
  color: '#a819b9',
};
