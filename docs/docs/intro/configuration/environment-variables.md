---
sidebar_position: 7
description: Reference for all environment variables supported by Storybook for React Native.
keywords: [react native, storybook, environment variables, configuration, STORYBOOK_ENABLED]
---

# Environment Variables

The bundler-agnostic `withStorybook` wrapper reads configuration from environment variables at build time. This lets you control Storybook behavior without changing code.

## Reference

### `STORYBOOK_ENABLED`

Controls whether Storybook is active. When set to `true`, the wrapper swaps your app's entry point with Storybook's entry point and includes all Storybook code in the bundle. When unset or `false`, the wrapper is a no-op and your app runs normally with no Storybook code.

- **Type:** `'true' | 'false'`
- **Default:** `false`
- **Used by:** `withStorybook` (bundler-agnostic wrapper)

```bash
STORYBOOK_ENABLED=true expo start
```

### `STORYBOOK_WS_HOST`

Sets the WebSocket server hostname. Overrides any `websockets.host` value passed in the config options.

- **Type:** `string`
- **Default:** value from config options, or `undefined`
- **Used by:** `withStorybook` WebSocket configuration

```bash
STORYBOOK_WS_HOST=192.168.1.100 expo start
```

### `STORYBOOK_WS_PORT`

Sets the WebSocket server port. Overrides any `websockets.port` value passed in the config options.

- **Type:** `string` (parsed as integer)
- **Default:** value from config options, or `7007`
- **Used by:** `withStorybook` WebSocket configuration

```bash
STORYBOOK_WS_PORT=8080 expo start
```

### `STORYBOOK_WS_SECURED`

Enables TLS for the WebSocket server (`wss://` instead of `ws://`) and HTTPS for the channel server.

- **Type:** `'true' | 'false'`
- **Default:** `false`
- **Used by:** `withStorybook` WebSocket configuration

```bash
STORYBOOK_WS_SECURED=true expo start
```

:::note
When using secured WebSockets, you also need to provide TLS certificates via the config options (`websockets.key`, `websockets.cert`). These cannot be set via environment variables.
:::

### `STORYBOOK_SERVER`

Controls whether the channel server starts alongside your app. The channel server handles WebSocket connections and (optionally) the MCP endpoint.

- **Type:** `'true' | 'false'`
- **Default:** `true`
- **Used by:** `withStorybook` server configuration

### `STORYBOOK_DISABLE_UI`

Enables lite mode, which mocks out the default Storybook UI dependencies (like `react-native-reanimated`). Use this when you want a lighter bundle, for example with `@storybook/react-native-ui-lite`.

- **Type:** `'true' | 'false'`
- **Default:** `false`
- **Used by:** `withStorybook` UI configuration

## Usage patterns

### Basic Storybook startup

```bash
STORYBOOK_ENABLED=true expo start
```

### With WebSocket auto-detection

If your metro/bundler config has `websockets: 'auto'`, you only need `STORYBOOK_ENABLED`:

```bash
STORYBOOK_ENABLED=true expo start
```

The LAN IP and port are detected automatically.

### Override WebSocket host for physical devices

```bash
STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=192.168.1.100 STORYBOOK_WS_PORT=7007 expo start
```

### Combining in package.json scripts

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true expo start",
    "storybook:device": "STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=auto expo start"
  }
}
```

:::note Windows
Use `cross-env` to set environment variables on Windows:

```json
{
  "scripts": {
    "storybook": "cross-env STORYBOOK_ENABLED=true expo start"
  }
}
```
:::

## Precedence

Environment variables always take precedence over values passed in the `withStorybook` config options. This lets you set defaults in your config and override them per-run from the command line.
