# From 6.5.x to 7.6.x

Use this only when the project is on `6.5.x`.

## Main Changes

- Upgrade Storybook packages to `7.6.10` or newer within `7.x`
- Regenerate `storybook.requires.ts`
- Move `.storybook/index.js` to the new `view.getStorybookUI(...)` pattern
- Update Metro for `unstable_allowRequireContext`
- Move types to `@storybook/react`
- Convert all remaining `storiesOf` stories to CSF

## Dependencies

Upgrade these packages together:

- `@storybook/react-native`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`
- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-notes`

This step also expects `@react-native-async-storage/async-storage` for the new storage option if the project does not already have it.

Remove legacy dependencies and imports that only exist to support `storiesOf` and knobs once the stories are converted.

Example dependency versions after the upgrade:

```json
{
  "devDependencies": {
    "@storybook/react-native": "^7.6.10",
    "@storybook/addon-ondevice-actions": "^7.6.10",
    "@storybook/addon-ondevice-backgrounds": "^7.6.10",
    "@storybook/addon-ondevice-controls": "^7.6.10",
    "@storybook/addon-ondevice-notes": "^7.6.10"
  }
}
```

## Generated Requires

Regenerate Storybook imports so the project uses `storybook.requires.ts` instead of `storybook.requires.js`.

Example command:

```sh
yarn storybook-generate
```

After regeneration, `.storybook/storybook.requires.ts` should exist and replace the old `.js` file.

## `.storybook/index.*`

Move the Storybook entry to the v7 API:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

export default StorybookUIRoot;
```

Renaming the file to `.storybook/index.tsx` is fine if the repo already uses TypeScript.

## Metro

Enable dynamic imports with `unstable_allowRequireContext`.

Also:

- add `generate(...)` from `@storybook/react-native/scripts/generate` if the repo wants Metro startup to regenerate Storybook imports
- add `mjs` to `resolver.sourceExts`
- remove old `sbmodern` resolver changes if they still exist

For Expo, generate a Metro config if the repo does not have one yet.

Expo example:

```js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

const config = getDefaultConfig(__dirname);

config.transformer.unstable_allowRequireContext = true;
config.resolver.sourceExts.push('mjs');

module.exports = config;
```

React Native CLI example:

```js
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    unstable_allowRequireContext: true,
  },
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

## Types

Story types move from `@storybook/react-native` to `@storybook/react` in this step.

Typical updates:

- `Meta` and `StoryObj` imports should come from `@storybook/react`
- `.storybook/main.ts` can use `StorybookConfig` from `@storybook/react-native`
- `.storybook/preview.tsx` can use `Preview` from `@storybook/react`

Story file example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Press me!',
  },
};
```

`.storybook/main.ts` example:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};

export default main;
```

`.storybook/preview.tsx` example:

```tsx
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [],
  parameters: {},
};

export default preview;
```

## Stories

If the repo still uses `storiesOf`, convert all of those stories to CSF as part of this migration step. Do not keep a compatibility mode.

Use the Storybook codemod as a starting point when it helps:

```sh
npx storybook@next migrate storiesof-to-csf --glob="src/**/*.stories.tsx"
```

Before doing the manual cleanup, read [storiesof-to-csf-examples.md](storiesof-to-csf-examples.md). That companion reference contains the full before/after examples for each part of the checklist below:

- converting `storiesOf(...).add(...)` chains to CSF exports
- moving shared decorators and parameters into `meta`
- replacing knobs-era code with `args` and `argTypes`
- converting stateful interactive stories to CSF `render`
- removing legacy imports such as `@storybook/react-native/V6`, `@storybook/addon-knobs`, and `@storybook/addon-ondevice-knobs`

Then finish the conversion manually:

- replace `storiesOf(...).add(...)` chains with a default export plus named story exports
- move shared decorators and parameters to the default export or `preview`
- replace knobs-era patterns with args and argTypes where appropriate
- remove imports from deprecated runtime paths such as `@storybook/react-native/V6`
- remove `@storybook/addon-ondevice-knobs` usage once no converted story depends on it

## Doctools

Remove any manual doctools bootstrap that was previously added in `preview.js` or related setup. Auto args wiring is now handled for you.

Example removal:

```diff
-import { extractArgTypes } from '@storybook/react/dist/modern/client/docs/extractArgTypes';
-import { addArgTypesEnhancer, addParameters } from '@storybook/react-native';
-import { enhanceArgTypes } from '@storybook/core/docs-tools';
-
-addArgTypesEnhancer(enhanceArgTypes);
-addParameters({
-  docs: {
-    extractArgTypes,
-  },
-});
```

## Verify

- `storybook.requires.ts` is generated
- `.storybook/index.*` uses `view.getStorybookUI`
- Metro has `unstable_allowRequireContext`
- Story files import types from `@storybook/react`, not `@storybook/react-native`
- No remaining `storiesOf(`, `@storybook/react-native/V6`, `@storybook/addon-knobs`, or `@storybook/addon-ondevice-knobs` imports remain in the upgraded codebase
