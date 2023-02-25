import { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Input } from './TextInput';

export default {
  title: 'TextInput',
  component: Input,
  parameters: {
    notes: 'Use this example to test the software keyboard related issues.',
  },
} as ComponentMeta<typeof Input>;

type TextInputStory = ComponentStoryObj<typeof Input>;

export const Basic: TextInputStory = {
  play: (_context) => {
    console.log('play!!');
  },
  args: {
    placeholder: 'Type something',
  },
};
