import Channel from '@storybook/channels';

export default function createChannel() {
  const transport = {
    setHandler: () => {},
    send: () => {},
  };

  return new Channel({ transport });
}
