import type { StoryObj, Meta } from '@storybook/react-native';
import { Text, StyleSheet } from 'react-native';

const Background = () => (
  <Text style={styles.text}>Change background color via Addons -&gt; Background</Text>
);

const styles = StyleSheet.create({
  text: { color: 'black' },
});

const meta = {
  component: Background,
  parameters: {
    backgrounds: {
      default: 'warm',
      values: [
        { name: 'warm', value: 'hotpink' },
        { name: 'cool', value: 'deepskyblue' },
        { name: 'white', value: 'white' },
        { name: 'black', value: 'black' },
      ],
    },
  },
} satisfies Meta<typeof Background>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
