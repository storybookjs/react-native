---
slug: websockets-and-tooling
title: 'WebSockets, Auto-Connect, and New Developer Tools'
authors: [dannyhw]
tags: [guides]
---

React Native Storybook v10.2 introduced automatic WebSocket configuration that removes the hassle of finding and hardcoding IP addresses. Combined with new external tools, this turns your Storybook setup into something you can control from your editor, an in-app dev panel, or your own custom scripts.

<!-- truncate -->

## The Problem with Manual WebSocket Setup

WebSockets in React Native Storybook enable remote control of stories, cross-device syncing, and integration with external tools. But setting them up used to be tedious. You had to figure out your machine's LAN IP, hardcode it in both your Metro config and your `getStorybookUI` call, and update it whenever your network changed.

On top of that, Android emulators use a special IP (`10.0.2.2`) to reach the host machine, so you'd end up with platform-specific logic just to connect.

## Auto WebSocket Configuration

With `websockets: 'auto'`, all of this is handled for you. In your Metro config:

```js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(config, {
  websockets: 'auto',
});
```

Or in a Re.Pack/Rspack config:

```js
new StorybookPlugin({
  enabled: storybookEnabled,
  websockets: 'auto',
});
```

When you pass `'auto'`, Storybook:

1. Detects your machine's LAN IP address automatically
2. Starts the WebSocket server bound to all network interfaces
3. Writes the detected IP and port into the generated `storybook.requires` file
4. The app reads this at startup and connects without any manual configuration

No more hardcoding IPs. No more platform-specific host logic. It just works on simulators, emulators, and physical devices on the same network.

You still need to enable websockets in your `getStorybookUI` call:

```tsx
const StorybookUIRoot = view.getStorybookUI({
  enableWebsockets: true,
});
```

The host and port are picked up automatically from the generated config.

You can still use the manual `{ host, port }` object if you need a specific address, but for most setups `'auto'` is all you need.

## What WebSockets Enable

Once connected, a WebSocket server runs on port 7007 and broadcasts all messages to every connected client. This opens up several workflows:

- **Cross-device syncing** - select a story on one device and all connected devices update simultaneously
- **Remote story selection** - control which story is displayed from any WebSocket client
- **Automated screenshots** - script story navigation and capture screenshots programmatically
- **Custom tooling** - build your own integrations using the WebSocket API

### Quick Example: Scripted Screenshots

```javascript
const WebSocket = require('ws');
const { execSync } = require('child_process');

const ws = new WebSocket('ws://localhost:7007');

ws.on('open', () => {
  // Navigate to a story
  ws.send(
    JSON.stringify({
      type: 'setCurrentStory',
      args: [{ viewMode: 'story', storyId: 'button--primary' }],
    })
  );

  // Wait for render and take a screenshot
  setTimeout(() => {
    execSync('xcrun simctl io booted screenshot screenshots/button-primary.png');
  }, 1000);
});
```

## Developer Tools

We've been building tools that take advantage of the WebSocket connection to give you better ways to browse and control stories outside of the on-device UI.

### VS Code Extension

The [React Native Storybook VS Code extension](https://marketplace.visualstudio.com/items?itemName=dannyhw.vscode-react-native-storybook) adds a sidebar panel to your editor with a full story tree. You can:

- Browse all your stories in a hierarchical tree view
- Click a story to select it on the running device
- Search and filter stories by name
- Jump to a story's source file directly from the tree

It connects over WebSocket to your running Storybook instance and stays in sync. Install it from the VS Code marketplace or Open VSX:

```
dannyhw.vscode-react-native-storybook
```

### Rozenite Dev Panel

[@dannyhw/rozenite-storybook](https://www.npmjs.com/package/@dannyhw/rozenite-storybook) is an in-app dev tools panel (powered by [Rozenite](https://rozenite.dev/)) that gives you a story browser right inside your simulator. It connects over the same WebSocket and lets you:

- Browse and search the story tree
- Select stories with a tap
- See connection status at a glance

This is useful when you want quick access to the story list without switching to the on-device Storybook UI.

Both tools are available in the [react-native-storybook-tools](https://github.com/dannyhw/react-native-storybook-tools) repo, which also includes an example project showing how to set everything up together.

## Getting Started

1. Update to `@storybook/react-native` v10.2 or later
2. Set `websockets: 'auto'` in your Metro or Re.Pack config
3. Enable websockets in `getStorybookUI`
4. Optionally install the VS Code extension or Rozenite panel

For full configuration details, see the [WebSocket configuration docs](/docs/intro/configuration/websocket-configuration).
