import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { Heading } from './Text';

const TextMeta: ComponentMeta<typeof Heading> = {
  title: 'Text control',
  component: Heading,
  args: { text: 'Hello world!' },
};
export default TextMeta;
type TextExampleStory = ComponentStory<typeof Heading>;
export const Basic: TextExampleStory = (args) => <Heading {...args} />;
