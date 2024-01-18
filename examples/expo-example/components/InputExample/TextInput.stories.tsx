import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './TextInput';

export default {
  title: 'TextInput',
  component: Input,
  parameters: {
    notes: 'Use this example to test the software keyboard related issues.',
  },
} as Meta<typeof Input>;

type TextInputStory = StoryObj<typeof Input>;

export const Basic: TextInputStory = {
  play: (_context) => {
    console.log('play!!');
  },
  args: {
    placeholder: 'Type something',
  },
};
