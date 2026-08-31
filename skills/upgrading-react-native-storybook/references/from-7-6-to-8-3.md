# From 7.6.x to 8.3.x

Use this only when the project is already on Storybook React Native `7.6.x`.

## Main Changes

- Upgrade all Storybook packages to `8.3.5` or newer within `8.x`
- Add the new UI runtime dependencies
- Regenerate `.storybook/storybook.requires.ts`
- Wrap Metro with `@storybook/react-native/metro/withStorybook`

Do not rename `.storybook/` yet. That happens in the `8 -> 9` step.

## Dependencies

Update Storybook packages together:

- `@storybook/react-native`
- `@storybook/react`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`
- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-notes`

Add the new native UI dependencies required by this release:

- `react-native-reanimated`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`
- `react-native-svg`

For Expo projects, install those native packages with `expo install` so versions match the Expo SDK.

Example `package.json` shape after the upgrade:

```json
{
  "devDependencies": {
    "@storybook/react-native": "^8.3.5",
    "@storybook/react": "^8.3.5",
    "@storybook/addon-ondevice-controls": "^8.3.5",
    "@storybook/addon-ondevice-actions": "^8.3.5",
    "@storybook/addon-ondevice-backgrounds": "^8.3.5",
    "@storybook/addon-ondevice-notes": "^8.3.5"
  }
}
```

Example install commands:

```sh
npx expo install react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
npm install --save-dev @storybook/react-native@^8.3.5 @storybook/react@^8.3.5 @storybook/addon-ondevice-controls@^8.3.5 @storybook/addon-ondevice-actions@^8.3.5 @storybook/addon-ondevice-backgrounds@^8.3.5 @storybook/addon-ondevice-notes@^8.3.5
```

## Generated Requires

Regenerate `.storybook/storybook.requires.ts`.

The generated file should now include an `updateView` export.

Example command:

```sh
yarn storybook-generate
```

## Metro

Wrap the Metro config with `withStorybook`:

```js
const path = require('path');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.storybook'),
});
```

Keep the existing `.storybook` config path during this step.

If the repo already has a Metro config, the change is usually from exporting `config` directly to wrapping it:

```diff
-module.exports = config;
+const withStorybook = require('@storybook/react-native/metro/withStorybook');
+
+module.exports = withStorybook(config, {
+  enabled: true,
+  configPath: path.resolve(__dirname, './.storybook'),
+});
```

## Verify

- The new native dependencies are installed and compatible with the repo's Expo or React Native version
- `storybook.requires.ts` was regenerated successfully
- Metro boots with the `withStorybook` wrapper
