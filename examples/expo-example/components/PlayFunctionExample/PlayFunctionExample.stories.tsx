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
Interactions panel lists their \`step\` and \`expect\` calls. Press the rerun
button in the panel to run the play function again.

\`canvasElement\` is the story's root element. On React Native versions with
\`EventTarget\` support on elements (currently Canary), play functions can also
call \`dispatchEvent\` on elements to press buttons and type into inputs.
`,
  },
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Assertions: Story = {
  play: async ({ canvasElement, args, step }) => {
    const root = canvasElement as unknown as { textContent: string };

    await step('Check the initial count', async () => {
      await expect(root.textContent).toContain(`Count: ${args.initialCount}`);
    });

    await step('Check the button label', async () => {
      await expect(root.textContent).toContain('Increment');
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
