import type { Meta, StoryObj } from '@storybook/react-native';
import { ActionButton } from './Actions';
import { fn, expect } from 'storybook/test';
import { addons } from 'storybook/internal/preview-api';
import Channel from 'storybook/internal/channels';
import { ServerEventData } from '@storybook/react-native/webserver';

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

class NativeEvents {
  channel: Channel;
  sessionId: string;
  constructor() {
    this.sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    this.channel = addons.getChannel();
  }

  delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  tap = async (x: number, y: number) => {
    return new Promise(async (resolve) => {
      await this.delay(500);

      this.channel.emit('nativeEvent', {
        type: 'tap',
        x: 200,
        y: 100,
        duration: 0.2,
        sessionId: this.sessionId,
      });

      this.channel.once('serverEvent', async (event: ServerEventData) => {
        console.log('serverEvent', event);

        if (event?.type === 'tapCompleted') {
          if (event?.success) {
            console.log('tap completed');
            await this.delay(200);
            resolve(true);
          }
        }
      });
    });
  };
}

export const Basic: Story = {
  args: {
    text: 'Press me!',
    onPress: fn((e) => {
      e.persist();
    }),
  },
  play: async ({ args }) => {
    const nativeEvents = new NativeEvents();

    await nativeEvents.tap(200, 100);

    expect(args.onPress).toHaveBeenCalled();
  },
};
