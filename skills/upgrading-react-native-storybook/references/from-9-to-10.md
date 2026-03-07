# From 9.x to 10.x

Use this only when the project is already on Storybook React Native `9.x`.

## Main Changes

- Upgrade all Storybook packages to `10.x`.
- Move Metro usage to the v10 `withStorybook` API.
- Simplify app entrypoints so Storybook can be imported at the top level.
- Regenerate `.rnstorybook/storybook.requires.ts`.

## Dependencies

Update the Storybook packages together:

- `storybook`
- `@storybook/react`
- `@storybook/react-native`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`
- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-notes`

Keep versions aligned on `10.x`.

Example `package.json` shape after the upgrade:

```json
{
  "devDependencies": {
    "storybook": "^10",
    "@storybook/react": "^10",
    "@storybook/react-native": "^10",
    "@storybook/addon-ondevice-controls": "^10",
    "@storybook/addon-ondevice-actions": "^10",
    "@storybook/addon-ondevice-backgrounds": "^10",
    "@storybook/addon-ondevice-notes": "^10"
  }
}
```

## Metro

In v10:

- `withStorybook` must be imported as a named export from `@storybook/react-native/metro/withStorybook`
- `withStorybookConfig` is no longer used
- `onDisabledRemoveStorybook` is removed
- `enabled: false` automatically strips Storybook from the bundle
- `configPath` is optional when the config folder is the default `./.rnstorybook`

Update old patterns like these:

- `const withStorybook = require(...)`
- `const { withStorybookConfig } = require(...)`
- any config using `onDisabledRemoveStorybook`

to the v10 shape:

```js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

Only include `configPath` when the project uses a non-default Storybook config folder.

If you keep the option for clarity while still using the default folder, it should still point at `.rnstorybook`, but it is redundant:

```js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
```

Full before/after example:

```js
// Before
const withStorybook = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  onDisabledRemoveStorybook: true,
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
```

```js
// After (preferred)
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
});
```

```js
// After (equivalent but redundant when using the default folder)
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
```

If the project already uses the default `.rnstorybook` folder, prefer omitting `configPath` entirely.

## App Entry

Remove defensive conditional `require()` patterns that existed only to avoid bundling Storybook.

In v10, top-level imports are safe again:

```tsx
import StorybookUI from './.rnstorybook';
```

Before/after app entry example:

```tsx
// Before
let AppEntryPoint = App;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  AppEntryPoint = require('./.rnstorybook').default;
}

export default AppEntryPoint;
```

```tsx
// After
import StorybookUI from './.rnstorybook';
import { Text, View } from 'react-native';

const isStorybook = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

const AppComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Hello World</Text>
  </View>
);

export default function App() {
  return isStorybook ? <StorybookUI /> : <AppComponent />;
}
```

For Expo Router, a dedicated route can just re-export the Storybook entry:

```tsx
export { default } from '../.rnstorybook';
```

## Regenerate

Regenerate `.rnstorybook/storybook.requires.ts` with the project's package manager, or restart Metro if the repo already generates it during Metro startup.

Example commands:

```sh
yarn storybook-generate
yarn start --reset-cache
```

## Verify

- Metro config still resolves `./.rnstorybook`
- Storybook launches when enabled
- Storybook code is removed when disabled
- No stale `withStorybookConfig` or `onDisabledRemoveStorybook` usage remains
