import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { expect } from 'storybook/test';

const Counter = ({ initialCount = 0 }: { initialCount?: number }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>Count: {count}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setCount((value) => value + 1)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Increment</Text>
      </Pressable>
    </View>
  );
};

const meta = {
  component: Counter,
  args: { initialCount: 2 },
  parameters: {
    notes: `
With \`features.ondeviceInteractions\` enabled, play functions run and the
Interactions panel lists their queries, \`step\` and \`expect\` calls. Press the
rerun button in the panel to run the play function again.

Like on the web, the play function gets \`canvas\`, with Testing Library-style
queries scoped to the story, and \`userEvent\`. \`userEvent\` needs a React
Native version with \`EventTarget\` support on elements, currently the Canary
release channel, so this example only queries and asserts.
`,
  },
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Assertions: Story = {
  play: async ({ canvas, args, step }) => {
    await step('Check the initial count', async () => {
      await expect(canvas.getByText(`Count: ${args.initialCount}`)).toBeTruthy();
    });

    await step('Check the button', async () => {
      await expect(canvas.getByRole('button', { name: 'Increment' })).toBeTruthy();
    });
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  count: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#1EA7FD',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
