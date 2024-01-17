import type { StoryObj, Meta } from '@storybook/react-native';
import { Heading } from './Text';

const TextMeta: Meta<typeof Heading> = {
  title: 'ControlExamples/Text control',
  component: Heading,
  args: { text: 'Hello world!' },
};
export default TextMeta;
type TextExampleStory = StoryObj<typeof Heading>;
export const Basic: TextExampleStory = {};
