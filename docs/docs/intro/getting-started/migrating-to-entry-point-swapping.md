---
sidebar_position: 4
description: Migrate your existing Storybook React Native project from deep app integration to the new entry-point swapping setup.
keywords: [react native, storybook, migration, entry point swapping, withStorybook, upgrade]
---

# Migrating to Entry-Point Swapping

Starting with v10.4, entry-point swapping is the default setup for new Storybook React Native projects. If your project uses the in-app integration approach — importing Storybook inside `App.tsx` and conditionally rendering it — that setup continues to work and is fully supported. However, entry-point swapping is simpler: the bundler swaps your app's entry point for Storybook's entry point automatically, so you don't need to touch your app code at all.

This guide walks you through the migration.

## What changes

| Aspect                 | Old setup                                                | New setup                                                |
| ---------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| **Bundler wrapper**    | `require('@storybook/react-native/metro/withStorybook')` | `require('@storybook/react-native/withStorybook')`       |
| **Enabling Storybook** | `enabled` option in metro config                         | `STORYBOOK_ENABLED=true` environment variable            |
| **App.tsx**            | Conditional import/render of StorybookUI                 | No changes needed — entry point is swapped automatically |
| **On-device addons**   | Listed in `addons` array in `main.ts`                    | Listed in `deviceAddons` array in `main.ts`              |
| **WebSocket config**   | Manually matched in metro config + `getStorybookUI`      | Auto-injected via `withStorybook` or env vars            |

## Step 1: Update your bundler config

Replace the metro-specific import with the bundler-agnostic wrapper:

**Before:**

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: './.rnstorybook',
  websockets: { port: 7007, host: 'localhost' },
});
```

**After:**

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/withStorybook');

const config = getDefaultConfig(__dirname);

module.exports = withStorybook(config);
```

The new `withStorybook` reads configuration from environment variables, so you don't need to pass options. It also auto-detects whether you're using Metro or Re.Pack.

## Step 2: Remove Storybook rendering from App.tsx

You can now remove any conditional Storybook rendering from your app entry point.

**Before:**

```tsx
// App.tsx
import StorybookUI from './.rnstorybook';
import { MyApp } from './MyApp';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function App() {
  return isStorybook ? <StorybookUI /> : <MyApp />;
}
```

**After:**

```tsx
// App.tsx
import { MyApp } from './MyApp';

export default function App() {
  return <MyApp />;
}
```

When `STORYBOOK_ENABLED=true` is set, the wrapper automatically swaps your app's entry point to `.rnstorybook/index`, so Storybook renders instead of your app. When it's not set, your app runs normally with zero Storybook code in the bundle.

## Step 3: Move on-device addons to `deviceAddons`

In your `.rnstorybook/main.ts`, move any on-device addons from `addons` to the new `deviceAddons` property:

**Before:**

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

**After:**

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

:::tip Automigration available
If you're using the Storybook CLI, the `rn-ondevice-addons-to-device-addons` automigration handles this step automatically. Any addon with "ondevice" in its name is moved to `deviceAddons`.

```bash
npx storybook automigrate
```

:::

**Why?** On-device addons contain React Native code that can't be evaluated on the server. When they're listed in `addons`, Storybook Core tries to load them as presets during operations like `extract`, which fails. The `deviceAddons` property ensures they're only loaded at runtime on the device.

## Step 4: Update your scripts

Update your `package.json` scripts to use the `STORYBOOK_ENABLED` environment variable:

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true expo start",
    "storybook:ios": "STORYBOOK_ENABLED=true expo start --ios",
    "storybook:android": "STORYBOOK_ENABLED=true expo start --android"
  }
}
```

For React Native CLI projects:

```json
{
  "scripts": {
    "storybook": "STORYBOOK_ENABLED=true react-native start",
    "storybook:ios": "STORYBOOK_ENABLED=true react-native run-ios",
    "storybook:android": "STORYBOOK_ENABLED=true react-native run-android"
  }
}
```

:::note Windows users
On Windows, use `cross-env` to set environment variables:

```json
{
  "scripts": {
    "storybook": "cross-env STORYBOOK_ENABLED=true expo start"
  }
}
```

:::

## Step 5: Simplify WebSocket configuration

If you were manually configuring WebSocket host/port in both your metro config and `getStorybookUI`, you can now remove the duplication. The new `withStorybook` injects WebSocket settings into the generated `storybook.requires` file automatically.

**Option A: Use env vars**

```bash
STORYBOOK_ENABLED=true STORYBOOK_WS_HOST=auto STORYBOOK_WS_PORT=7007 expo start
```

**Option B: Configure in metro config**

```js
module.exports = withStorybook(config, {
  websockets: 'auto',
});
```

Either way, you can remove `enableWebsockets`, `host`, and `port` from your `getStorybookUI` call in `.rnstorybook/index.tsx` — they're injected automatically.

## Step 6: Restart Metro

After making these changes, restart Metro with a cache clear:

```bash
npx react-native start --reset-cache
# or for Expo:
npx expo start --clear
```

## Verify

Run your storybook script and confirm:

- Storybook renders when `STORYBOOK_ENABLED=true` is set
- Your normal app renders when the variable is not set
- Stories load correctly
- On-device addon panels (controls, actions, etc.) work as before

## Expo Router projects

If you're using Expo Router with a dedicated `/storybook` route, the entry-point swapping approach works alongside it. You have two choices:

1. **Keep the route approach** — your `/storybook` route still works as before. Just update the bundler import and move addons to `deviceAddons`.
2. **Switch to entry-point swapping** — remove the route and use env-var-driven swapping instead. This gives you a dedicated Storybook build with no app code in the bundle.
