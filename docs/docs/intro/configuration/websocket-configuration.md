---
sidebar_position: 6
---

# WebSocket Configuration

WebSocket support in React Native Storybook enables remote control of your stories from external tools, browsers, or other devices. This is particularly useful for testing, automation, and cross-device development.

## Overview

When WebSocket is enabled, Storybook creates a server that allows bidirectional communication between your app and external clients. This enables:

- Remote story selection
- Live story updates
- Cross-device testing (all synchronously update)
- Integration with automation tools
- Custom tooling integration

## Basic Setup

### Recommended: Bundler-agnostic wrapper

If you're using the bundler-agnostic `withStorybook` (from `@storybook/react-native/withStorybook`), WebSocket configuration is handled automatically. Pass `websockets: 'auto'` in your config or set environment variables:

```ts
// metro.config.js
const { withStorybook } = require('@storybook/react-native/withStorybook');

module.exports = withStorybook(config, {
  websockets: 'auto',
});
```

The wrapper auto-detects your LAN IP, starts the WebSocket server, and injects the connection settings into the generated `storybook.requires` file — no manual matching needed in `getStorybookUI`.

You can also configure WebSockets via environment variables:

```sh
STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=192.168.1.100 STORYBOOK_WS_PORT=7007 expo start
```

See [Environment Variables](./environment-variables.md) for all supported variables.

### Metro-specific setup

If you're using the Metro-specific `withStorybook` (from `@storybook/react-native/metro/withStorybook`), you need to configure WebSockets in two places:

**Metro config:**

```ts
module.exports = withStorybook(config, {
  websockets: {
    port: 7007,
    host: 'localhost',
  },
});
```

Or use auto host detection (`'auto'` support is available from v10.2):

```js
module.exports = withStorybook(config, {
  websockets: 'auto',
});
```

**Storybook UI (`getStorybookUI`):**

```ts
const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
  host: 'localhost',
  port: 7007,
});
```

To enable `https` and `wss`, pass TLS credentials:

```ts
const fs = require('fs');

module.exports = withStorybook(config, {
  websockets: {
    secured: true,
    key: fs.readFileSync('./certs/storybook-key.pem'),
    cert: fs.readFileSync('./certs/storybook-cert.pem'),
  },
});
```

## Platform-Specific Setup

### iOS Physical Device

For iOS devices, use your machine's IP address. With the bundler-agnostic wrapper, use `websockets: 'auto'` or set `STORYBOOK_WS_HOST`:

```sh
STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=192.168.1.100 expo start
```

With the Metro-specific wrapper, set the host in both config and UI:

```ts
const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
  host: '192.168.1.100', // Your machine's IP
  port: 7007,
});
```

### Android Emulator

For Android emulator, use the special IP address `10.0.2.2`. With the bundler-agnostic wrapper, set it via env var:

```sh
STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=10.0.2.2 expo start
```

## Remote Control API

### Connecting from External Client

```ts
// Node.js client example
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:7007');

ws.on('open', () => {
  console.log('Connected to Storybook');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Available Commands

You can find all the events in `storybook/internal/core-events`

#### Select Story

```ts
import { SET_CURRENT_STORY } from 'storybook/internal/core-events';

// Select a story by ID
ws.send(
  JSON.stringify({
    type: SET_CURRENT_STORY,
    args: ['components-button--primary'],
  })
);
```

## Simple Screenshot Example

```ts
const ws = new WebSocket('ws://localhost:7007');

async function takeScreenshot(name: string) {
  execSync(`xcrun simctl io booted screenshot --type png screenshots/${name}.png`);
}

ws.onopen = () => {
  console.log('connected');
  ws.send(
    JSON.stringify({
      type: 'setCurrentStory',
      args: [{ viewMode: 'story', storyId: 'button--basic' }],
    })
  );
  takeScreenshot('button-basic');
};
```

## Debugging WebSocket Issues

### Common Issues

1. **Connection Refused**
   - Check if port is already in use: `lsof -i :7007`
   - Ensure Metro is running with WebSocket enabled
   - Verify firewall settings
   - make sure the host and port match in both the `withStorybook` configuration and the `getStorybookUI` call in your app code

2. **Cannot Connect from Device**
   - Use machine's IP instead of localhost
   - Ensure device is on same network
   - Check device's network permissions

3. **Messages Not Received**
   - Verify message format is correct JSON
   - Check for typos in message types
   - Ensure WebSocket connection is established
