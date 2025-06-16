import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeScreen } from '@storybook/react-native/NativeEvents';
import { expect, fn } from 'storybook/test';
import { ActionButton } from './Actions';

const meta = {
  component: ActionButton,
  parameters: {
    notes: `
# Button

This is a button component.
You use it like this:

\`\`\`tsx    
<Button 
      text="Press me!" 
      onPress={() => console.log('pressed')} 
/>
\`\`\`
`,
  },
} satisfies Meta<typeof ActionButton>;

export default meta;

type Story = StoryObj<typeof meta>;
const delay = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const Basic: Story = {
  args: {
    text: 'Press me!',
    onPress: fn((e) => {
      e.persist();
    }),
  },
  play: async ({ args }) => {
    const screen = new NativeScreen();

    await delay(500);
    const button = await screen.getByText('Press me!');
    await delay(500);
    await button.tap(0.5);
    await delay(500);

    expect(args.onPress).toHaveBeenCalled();
  },
};
