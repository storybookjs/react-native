import type { StoryObj, Meta } from '@storybook/react-native';
import { Color } from './Color';

const meta = {
  parameters: { notes: '- test' },
  argTypes: {
    color: {
      control: { type: 'color' },
    },
  },
  component: Color,
} satisfies Meta<typeof Color>;

export default meta;

type ColorStory = StoryObj<typeof meta>;

export const ColorExample: ColorStory = {
  args: {
    color: '#a819b9',
  },
};
