import Channel from '@kadira/storybook-channel'

export default function createChannel () {
  const transport = {
    setHandler: () => {},
    send: () => {}
  }

  return new Channel({ transport })
}
