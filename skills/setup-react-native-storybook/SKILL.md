---
name: setup-react-native-storybook
description: Set up Storybook for React Native in Expo, React Native CLI, or Re.Pack projects. Use when adding Storybook to a project, configuring metro.config.js with withStorybook, creating .rnstorybook configuration files, setting up Storybook routes in Expo Router, configuring getStorybookUI, or adding the StorybookPlugin to a Re.Pack rspack/webpack config. Covers Expo, Expo Router, plain React Native CLI, and Re.Pack setups.
---

# React Native Storybook Setup

Add `@storybook/react-native` v10 to a React Native project.

**Important:** Detect the project's package manager (look for `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`) and use it for all install/run commands instead of `npm`. The examples below use `npm` but substitute accordingly (e.g. `yarn add` instead of `npm install`, `yarn storybook` instead of `npm run storybook`). For Expo projects, use `npx expo install` (or `bunx expo install`, etc.) to install dependencies so Expo can resolve compatible versions.

For the init command, use `<pm> create storybook` with the flags shown below. Only npm needs `--` before the flags. Never use `npx`/`bunx` etc for this.

Four setup flows based on project type:

1. **Expo (no router)** - see [references/expo-setup.md](references/expo-setup.md)
2. **Expo with Expo Router** - see [references/expo-router-setup.md](references/expo-router-setup.md)
3. **React Native CLI (no Expo)** - see [references/react-native-cli-setup.md](references/react-native-cli-setup.md)
4. **Re.Pack (rspack/webpack)** - see [references/repack-setup.md](references/repack-setup.md)

## Flow Selection

- Project has `rspack.config` or `webpack.config` and uses `@callstack/repack` -> **Re.Pack**
- Project has `app/` directory with `_layout.tsx` and uses `expo-router` -> **Expo Router**
- Project uses Expo but not file-based routing -> **Expo**
- Project uses `@react-native-community/cli` with no Expo -> **React Native CLI**

## Common Steps (all flows)

### 1. Run CLI Init

```bash
npm create storybook -- --type react_native --yes
# or: pnpm create storybook --type react_native --yes
# or: bun create storybook --type react_native --yes
```

This installs dependencies and creates `.rnstorybook/` with `main.ts`, `preview.tsx`, and `index.tsx`.

### 2. Enable WebSockets in .rnstorybook/index.tsx

Update the generated `.rnstorybook/index.tsx` to enable WebSocket support. This is required for remote control and syncing with the Storybook web companion:

```tsx
// .rnstorybook/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  enableWebsockets: true,
});

export default StorybookUIRoot;
```

If the project doesn't have `@react-native-async-storage/async-storage`, install it:

```bash
npm install @react-native-async-storage/async-storage
```

### 3. Update Story Globs in main.ts

The CLI generates a default `stories` glob in `.rnstorybook/main.ts`. Keep the existing glob and add an additional entry pointing to where UI components actually live in the project. Look for directories like `components/`, `src/components/`, `src/`, `ui/`, etc.:

```ts
// .rnstorybook/main.ts
const main: StorybookConfig = {
  stories: [
    './stories/**/*.stories.?(ts|tsx|js|jsx)', // example stories from init
    '../src/components/**/*.stories.?(ts|tsx|js|jsx)', // add based on project structure
  ],
  // ...
};
```

### 4. Configure Bundler

For Metro projects, wrap the metro config with `withStorybook`. For Re.Pack projects, add the `StorybookPlugin` to your rspack/webpack config. See the relevant reference file for details.

### 5. Create Entrypoint

How Storybook is rendered differs per flow - see the relevant reference file.

### 6. Run

```bash
npm run start
npm run ios     # or npm run android
```

## withStorybook Options (Metro)

```js
module.exports = withStorybook(config, {
  enabled: true, // Remove Storybook from bundle when false
  configPath: './.rnstorybook', // Storybook config directory
  useJs: false, // Generate .js instead of .ts
  docTools: true, // Auto arg extraction
  liteMode: false, // Mock default UI deps (use with react-native-ui-lite)
  websockets: { port: 7007, host: 'localhost' }, // Remote control
});
```

## StorybookPlugin Options (Re.Pack)

```js
new StorybookPlugin({
  enabled: true, // Strip Storybook from bundle when false
  configPath: './.rnstorybook', // Storybook config directory
  useJs: false, // Generate .js instead of .ts
  docTools: true, // Auto arg extraction
  liteMode: false, // Mock default UI deps (use with react-native-ui-lite)
  websockets: 'auto', // 'auto' detects LAN IP, or { port: 7007, host: 'localhost' }
});
```
