import type { StoryObj, Meta } from '@storybook/react-native';
import { Heading } from './Text';

const meta = {
  component: Heading,
  args: { text: 'Hello world!' },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
