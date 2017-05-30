# Storybook Channel

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook Channel is similar to an EventEmitter.
Channels are used with Storybook implementations to send/receive events between the Storybook Manager and the Storybook Renderer.

```js
class Channel {
  addListener(type, listener) {}
  emit(type, ...args) {}
  eventNames() {}
  listenerCount(type) {}
  listeners(type) {}
  on(type, listener) {}
  once(type, listener) {}
  prependListener(type, listener) {}
  prependOnceListener(type, listener) {}
  removeAllListeners(type) {}
  removeListener(type, listener) {}
}
```

The channel takes a Transport object as a parameter which will be used to send/receive messages. The transport object should implement this interface.

```js
class Transport {
  send(event) {}
  setHandler(handler) {}
}
```

Currently, channels are baked into storybook implementations and therefore this module is not designed to be used directly by addon developers. When developing addons, use the `getChannel` method exported by `@storybook/addons` module. For this to work, Storybook implementations should use the `setChannel` method before loading addons.

```js
import addons from '@storybook/addons';

const channel = addons.getChannel();
```

* * *

For more information visit: [storybook.js.org](https://storybook.js.org)
