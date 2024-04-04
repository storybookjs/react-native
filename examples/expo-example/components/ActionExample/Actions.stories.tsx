import type { Meta, StoryObj } from '@storybook/react';

import { ActionButton } from './Actions';

const meta = {
  title: 'ActionButton',
  component: ActionButton,
  argTypes: {
    onPress: { action: 'pressed' },
  },
  args: {
    text: 'Press me!',
  },
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

export const Basic: Story = {};

export const AnotherAction: Story = {
  argTypes: {
    onPress: { action: 'pressed a different button' },
  },
};
