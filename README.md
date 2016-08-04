# Websocket Channel

Websocket channel for Kadira Storybooks. This channel can be used when the Storybook Renderer should communicate with the Storybook Manager over the network. A channel can be created using the `createChannel` function.

```js
import createChannel from '@kadira/storybook-channel-websocket'
const channel = createChannel({ url: 'ws://localhost:9001' })
```
