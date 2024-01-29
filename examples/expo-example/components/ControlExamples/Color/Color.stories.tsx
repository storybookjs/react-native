import type { StoryObj, Meta } from '@storybook/react';
import { Color } from './Color';

const ColorMeta: Meta<typeof Color> = {
  title: 'ControlExamples/Color control',
  parameters: { notes: '- test' },
  argTypes: {
    color: {
      control: { type: 'color' },
    },
  },
  component: Color,
};

export default ColorMeta;

type ColorStory = StoryObj<typeof Color>;

export const ColorExample: ColorStory = {
  args: {
    color: '#a819b9',
  },
};
