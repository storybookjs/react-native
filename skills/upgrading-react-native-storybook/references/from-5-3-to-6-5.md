# From 5.3.x to 6.5.x

Use this only when the project is still on Storybook React Native `5.3.x`.

## Main Changes

- Add the new core dependencies used by the 6.5 architecture
- Move to a generated `storybook.requires.js` flow
- Introduce `.storybook/main.js` and `.storybook/preview.js`
- Update Metro to prefer `sbmodern`

This is the biggest structural migration step. Keep it isolated from later upgrades.

## Dependencies

Add the new base dependencies:

- `@storybook/react-native`
- `@storybook/core/common`
- `@react-native-async-storage/async-storage`
- `react-native-safe-area-context`
- `react-dom`

Add addon dependencies as needed:

- controls: `@storybook/addon-ondevice-controls`, `@storybook/addons`, `@storybook/addon-controls`, `@react-native-community/datetimepicker`, `@react-native-community/slider`
- actions: `@storybook/addon-ondevice-actions`, `@storybook/addon-actions`

Example `package.json` shape after the upgrade:

```json
{
  "devDependencies": {
    "@storybook/react-native": "^6.5.16",
    "@storybook/core/common": "^6.5.16",
    "@react-native-async-storage/async-storage": "^1.23.1",
    "react-native-safe-area-context": "^4.10.5",
    "react-dom": "^18.2.0",
    "@storybook/addon-ondevice-controls": "^6.5.16",
    "@storybook/addons": "^6.5.16",
    "@storybook/addon-controls": "^6.5.16",
    "@storybook/addon-ondevice-actions": "^6.5.16",
    "@storybook/addon-actions": "^6.5.16"
  }
}
```

Install commands vary by package manager. Example commands:

```sh
npm install --save-dev @storybook/react-native @storybook/core/common @react-native-async-storage/async-storage react-native-safe-area-context react-dom
npm install --save-dev @storybook/addon-ondevice-controls @storybook/addons @storybook/addon-controls @react-native-community/datetimepicker @react-native-community/slider
npm install --save-dev @storybook/addon-ondevice-actions @storybook/addon-actions
```

## Config Folder

Rename the Storybook folder to `.storybook` if it is not already named that.

## `.storybook/index.js`

Reduce the entry file to the generated-import pattern:

```js
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;
```

Remove old manual `configure(...)`, direct story imports, and direct addon imports.

## `main.js` and `preview.js`

Create `.storybook/main.js` with the repo's story globs and on-device addons, then move global decorators and parameters into `.storybook/preview.js`.

This step is where the Storybook config becomes file-driven instead of hard-coded in `index.js`.

Example `.storybook/main.js`:

```js
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
  ],
};
```

Example `.storybook/preview.js`:

```jsx
import { View } from 'react-native';

export const decorators = [
  (StoryFn) => (
    <View style={{ flex: 1, padding: 8 }}>
      <StoryFn />
    </View>
  ),
];

export const parameters = {
  layout: 'fullscreen',
};
```

## Scripts

Add package scripts for the generated import flow:

- `storybook-generate`: `sb-rn-get-stories`
- `storybook-watch`: `sb-rn-watcher`

Use the repo's existing package manager.

Example `package.json` scripts:

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories",
    "storybook-watch": "sb-rn-watcher"
  }
}
```

## Metro

Update Metro to prefer the `sbmodern` entrypoint:

- Expo: prepend `sbmodern` to `resolver.resolverMainFields`
- React Native CLI: set `resolverMainFields` to start with `sbmodern`

Expo example:

```js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields.unshift('sbmodern');

module.exports = defaultConfig;
```

React Native CLI example:

```js
module.exports = {
  resolver: {
    resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
  },
};
```

## Stories

`storiesOf` can still exist after this step, but the required conversion to CSF should happen in the later `6.5.x -> 7.6.x` migration.

## Verify

- `storybook.requires.js` generates successfully
- `index.js` only bootstraps Storybook instead of importing stories directly
- `main.js` and `preview.js` exist and match the repo's story locations
- Metro resolves Storybook packages through `sbmodern`
