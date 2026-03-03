import { ActionButton } from './Actions';
import { fn } from 'storybook/test';
import preview from '../../.rnstorybook/preview';

const meta = preview.meta({
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
});

export default meta;

export const Basic = meta.story({
  args: {
    text: 'Press me!',
    onPress: fn(),
  },
});
