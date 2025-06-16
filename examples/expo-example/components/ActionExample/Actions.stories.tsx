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

export const Basic: Story = {
  args: {
    text: 'Press me!',
    onPress: fn((e) => {
      e.persist();
    }),
  },
  play: async ({ args }) => {
    const screen = new NativeScreen();

    const button = await screen.getByText('Press me!');
    await button.tap(0.5);

    expect(args.onPress).toHaveBeenCalled();
  },
};
