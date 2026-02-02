---
name: setup-react-native-storybook
description: Set up Storybook for React Native in Expo or React Native CLI projects. Use when adding Storybook to a project, configuring metro.config.js with withStorybook, creating .rnstorybook configuration files, setting up Storybook routes in Expo Router, or configuring getStorybookUI. Covers Expo, Expo Router, and plain React Native CLI setups.
---

# React Native Storybook Setup

Add `@storybook/react-native` v10 to a React Native project.

**Important:** Detect the project's package manager (look for `yarn.lock`, `pnpm-lock.yaml`, or `bun.lockb`) and use it for all install/run commands instead of `npm`. The examples below use `npm` but substitute accordingly (e.g. `yarn add` instead of `npm install`, `yarn storybook` instead of `npm run storybook`).

For the init command, use the `create` subcommand of the project's package manager (`npm create storybook@latest`, `pnpm create storybook@latest`, `bun create storybook@latest`). Never use `npx`/`bunx` etc for this.

Three setup flows based on project type:

1. **Expo (no router)** - see [references/expo-setup.md](references/expo-setup.md)
2. **Expo with Expo Router** - see [references/expo-router-setup.md](references/expo-router-setup.md)
3. **React Native CLI (no Expo)** - see [references/react-native-cli-setup.md](references/react-native-cli-setup.md)

## Flow Selection

- Project has `app/` directory with `_layout.tsx` and uses `expo-router` -> **Expo Router**
- Project uses Expo but not file-based routing -> **Expo**
- Project uses `@react-native-community/cli` with no Expo -> **React Native CLI**

## Common Steps (all flows)

### 1. Run CLI Init

```bash
npm create storybook@latest
```

Choose **recommended** then **native** when prompted. This installs dependencies and creates `.rnstorybook/` with `main.ts`, `preview.tsx`, and `index.tsx`.

### 2. Configure Metro

Wrap the metro config with `withStorybook`. The specific metro config differs per flow - see the relevant reference file.

### 3. Create Entrypoint

How Storybook is rendered differs per flow - see the relevant reference file.

### 4. Run

```bash
npm run start
npm run ios     # or npm run android
```

## withStorybook Options

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
