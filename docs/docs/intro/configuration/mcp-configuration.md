---
sidebar_position: 7
---

# MCP Configuration

React Native Storybook can expose an experimental MCP (Model Context Protocol) endpoint for AI tooling from v10.3 onwards. The endpoint runs on the same channel server as WebSockets at:

- `http://<host>:<port>/mcp`

## Enable with Metro

```js
// metro.config.js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(config, {
  websockets: 'auto',
  experimental_mcp: true,
});
```

You can also set `websockets` manually with `{ host, port }`. `'auto'` is available from v10.2.

## Enable with Re.Pack / Rspack

```js
import { StorybookPlugin } from '@storybook/react-native/repack/withStorybook';

new StorybookPlugin({
  enabled: storybookEnabled,
  websockets: 'auto',
  experimental_mcp: true,
});
```

You can also set `websockets` manually with `{ host, port }`. `'auto'` is available from v10.2.

## Behavior

- `experimental_mcp: true` enables MCP HTTP endpoints.
- `websockets` is optional for MCP docs/query tools.
- Story selection tools are only available when `websockets` is enabled.

If you enable MCP without `websockets`, Storybook still serves documentation tools, but cannot push story selection events to connected devices.

## MCP Client Example

```json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:7007/mcp"
    }
  }
}
```

## Troubleshooting

1. `404` on `/mcp`
   - Ensure `experimental_mcp: true` is set in Metro/Re.Pack config.
   - Restart bundler after config changes.
2. Story selection tool unavailable
   - Enable `websockets` in Metro/Re.Pack config.
3. Connection issues from physical devices
   - Prefer `websockets: 'auto'` or use your machine LAN IP and ensure network/firewall access.
