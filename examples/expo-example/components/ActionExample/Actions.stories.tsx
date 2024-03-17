import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ActionButton } from './Actions';

const meta = {
  title: 'ActionButton',
  component: ActionButton,
  args: {
    text: 'Press me!',
    onPress: action('pressed'),
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
