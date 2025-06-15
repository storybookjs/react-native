import type { Meta, StoryObj } from '@storybook/react-native';
import { ActionButton } from './Actions';
import { fn, expect } from 'storybook/test';
import { addons } from 'storybook/internal/preview-api';

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

// class NativeEvents {
//   channel: Channel;
//   constructor() {
//     this.channel = addons.getChannel();
//   }
//   tap = async (x: number, y: number) => {
//     console.log('tap', x, y);
//     this.channel.emit('nativeEvent', {
//       type: 'tap',
//       x,
//       y,
//     });
//   };
// }
// const nativeEvents = new NativeEvents();

export const Basic: Story = {
  args: {
    text: 'Press me!',
    onPress: fn((e) => {
      e.persist();
    }),
  },
  play: async ({ args }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const channel = addons.getChannel();

    channel.emit('nativeEvent', {
      type: 'tap',
      x: 200,
      y: 100,
      duration: 0.2,
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    expect(args.onPress).toHaveBeenCalled();
    // await nativeEvents.tap(200, 100);
  },
};
