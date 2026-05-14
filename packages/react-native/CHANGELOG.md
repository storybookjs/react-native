# @storybook/react-native

## 10.4.4

### Patch Changes

- [#891](https://github.com/storybookjs/react-native/pull/891) [`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fixes for color control

- Updated dependencies [[`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521)]:
  - @storybook/react-native-ui-common@10.4.4
  - @storybook/react-native-ui@10.4.4
  - @storybook/react-native-theming@10.4.4

## 10.4.3

### Patch Changes

- [#890](https://github.com/storybookjs/react-native/pull/890) [`511bca0`](https://github.com/storybookjs/react-native/commit/511bca0fdd6aaa2018f4f265cef6d91836a3d5cb) Thanks [@ndelangen](https://github.com/ndelangen)! - auto-detect websocket enabling

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.3
  - @storybook/react-native-ui-common@10.4.3
  - @storybook/react-native-theming@10.4.3

## 10.4.2

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.2
  - @storybook/react-native-ui-common@10.4.2
  - @storybook/react-native-theming@10.4.2

## 10.4.2-next.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.2-next.0
  - @storybook/react-native-ui-common@10.4.2-next.0
  - @storybook/react-native-theming@10.4.2-next.0

## 10.4.1

### Patch Changes

- [#886](https://github.com/storybookjs/react-native/pull/886) [`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0) Thanks [@dannyhw](https://github.com/dannyhw)! - apply npm audit fixes

- [#883](https://github.com/storybookjs/react-native/pull/883) [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90) Thanks [@dannyhw](https://github.com/dannyhw)! - liteui animation changes and select control adjustments

- Updated dependencies [[`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0), [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90)]:
  - @storybook/react-native-theming@10.4.1
  - @storybook/react-native-ui@10.4.1
  - @storybook/react-native-ui-common@10.4.1

## 10.4.0

### Minor Changes

- [#871](https://github.com/storybookjs/react-native/pull/871) [`08f59a6`](https://github.com/storybookjs/react-native/commit/08f59a620b8a8d3d20fe8d57c2317bc529c0f22b) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add `deviceAddons` property to `StorybookConfig` for separating on-device addons from core addons. On-device addons listed in `deviceAddons` are only consumed at runtime by the code generator, not evaluated as presets by Storybook Core. This prevents `extract` failures caused by loading React Native code in a Node.js context. Backwards compatible: addons in the `addons` field continue to work.

- [#871](https://github.com/storybookjs/react-native/pull/871) [`08f59a6`](https://github.com/storybookjs/react-native/commit/08f59a620b8a8d3d20fe8d57c2317bc529c0f22b) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add unified bundler-agnostic withStorybook wrapper at @storybook/react-native/withStorybook

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.0
  - @storybook/react-native-ui-common@10.4.0
  - @storybook/react-native-theming@10.4.0

## 10.3.2

### Patch Changes

- [#876](https://github.com/storybookjs/react-native/pull/876) [`95d4211`](https://github.com/storybookjs/react-native/commit/95d4211abc85244c64af63ec8e1381a036a5025c) Thanks [@Nezz](https://github.com/Nezz)! - fix os/tty removed in server of expo router

- [#875](https://github.com/storybookjs/react-native/pull/875) [`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

- Updated dependencies [[`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52), [`b3e2164`](https://github.com/storybookjs/react-native/commit/b3e2164f33988b7b1cb7046eeb46cce79f2273e1)]:
  - @storybook/react-native-ui-common@10.3.2
  - @storybook/react-native-ui@10.3.2
  - @storybook/react-native-theming@10.3.2

## 10.3.1

### Patch Changes

- [#870](https://github.com/storybookjs/react-native/pull/870) [`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fix mcp tool name change

- Updated dependencies [[`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2)]:
  - @storybook/react-native-ui-common@10.3.1
  - @storybook/react-native-ui@10.3.1
  - @storybook/react-native-theming@10.3.1

## 10.3.0

### Minor Changes

- [#848](https://github.com/storybookjs/react-native/pull/848) [`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add backgrounds addon behind `features.ondeviceBackgrounds` flag

  When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.

  ### Usage

  **1. Enable the feature in `.storybook/main.ts`:**

  ```ts
  import type { StorybookConfig } from '@storybook/react-native';

  const main: StorybookConfig = {
    stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
    features: {
      ondeviceBackgrounds: true,
    },
  };

  export default main;
  ```

  **2. Configure background options in `.storybook/preview.tsx`:**

  ```tsx
  import type { Preview } from '@storybook/react-native';

  const preview: Preview = {
    parameters: {
      backgrounds: {
        options: {
          light: { name: 'Light', value: '#ffffff' },
          dark: {
            name: 'Dark',
            value: '[#333333](https://github.com/storybookjs/react-native/issues/333333)',
          },
          app: { name: 'App', value: '#eeeeee' },
        },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'light' },
    },
  };

  export default preview;
  ```

  **3. Optionally override at the story level:**

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react-native';

  const meta: Meta<typeof MyComponent> = {
    component: MyComponent,
    globals: {
      // Lock background for all stories in this file
      backgrounds: { value: 'dark' },
    },
  };

  export default meta;
  ```

### Patch Changes

- [#863](https://github.com/storybookjs/react-native/pull/863) [`47e0d9d`](https://github.com/storybookjs/react-native/commit/47e0d9d2eaddba52619b9581a8993bcd0ea4cd3f) Thanks [@dannyhw](https://github.com/dannyhw)! - fix types for metro require

- [#832](https://github.com/storybookjs/react-native/pull/832) [`d2f2d99`](https://github.com/storybookjs/react-native/commit/d2f2d9994f98c29c07bf1fe0108134c3bec094f9) Thanks [@YevheniiKotyrlo](https://github.com/YevheniiKotyrlo)! - fix: replace @ts-ignore with Metro-specific type definitions

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- [#849](https://github.com/storybookjs/react-native/pull/849) [`c0b14e8`](https://github.com/storybookjs/react-native/commit/c0b14e842f17a3e8d56501e08f59a771431946de) Thanks [@dannyhw](https://github.com/dannyhw)! - adds an mcp option to withStorybook that enables an mcp endpoint in the channel server

- [#860](https://github.com/storybookjs/react-native/pull/860) [`794f4f0`](https://github.com/storybookjs/react-native/commit/794f4f03c6c5e77752ae1838901e620b8f0f21a3) Thanks [@dannyhw](https://github.com/dannyhw)! - Added a new channel server endpoint: `POST /select-story-sync/:storyId`

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: snapshot RN synthetic events and prevent channel echo

- [#861](https://github.com/storybookjs/react-native/pull/861) [`74c26e2`](https://github.com/storybookjs/react-native/commit/74c26e23c470e044c50c86a6259afbf5a8d8aad9) Thanks [@dannyhw](https://github.com/dannyhw)! - add secure option for wss/https on the channel server

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - fix invalid reanimated globals breaking actions on web

- Updated dependencies [[`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0), [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91), [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3), [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui-common@10.3.0
  - @storybook/react-native-ui@10.3.0
  - @storybook/react-native-theming@10.3.0

## 10.3.0-next.6

### Patch Changes

- [#863](https://github.com/storybookjs/react-native/pull/863) [`47e0d9d`](https://github.com/storybookjs/react-native/commit/47e0d9d2eaddba52619b9581a8993bcd0ea4cd3f) Thanks [@dannyhw](https://github.com/dannyhw)! - fix types for metro require

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.6
  - @storybook/react-native-ui-common@10.3.0-next.6
  - @storybook/react-native-theming@10.3.0-next.6

## 10.3.0-next.5

### Patch Changes

- [#860](https://github.com/storybookjs/react-native/pull/860) [`794f4f0`](https://github.com/storybookjs/react-native/commit/794f4f03c6c5e77752ae1838901e620b8f0f21a3) Thanks [@dannyhw](https://github.com/dannyhw)! - Added a new channel server endpoint: `POST /select-story-sync/:storyId`

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.5
  - @storybook/react-native-ui-common@10.3.0-next.5
  - @storybook/react-native-theming@10.3.0-next.5

## 10.3.0-next.4

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.4
  - @storybook/react-native-ui-common@10.3.0-next.4
  - @storybook/react-native-theming@10.3.0-next.4

## 10.3.0-next.3

### Patch Changes

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: snapshot RN synthetic events and prevent channel echo

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - fix invalid reanimated globals breaking actions on web

- Updated dependencies [[`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3), [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui@10.3.0-next.3
  - @storybook/react-native-ui-common@10.3.0-next.3
  - @storybook/react-native-theming@10.3.0-next.3

## 10.3.0-next.2

### Patch Changes

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- Updated dependencies [[`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91)]:
  - @storybook/react-native-ui-common@10.3.0-next.2
  - @storybook/react-native-ui@10.3.0-next.2
  - @storybook/react-native-theming@10.3.0-next.2

## 10.3.0-next.1

### Patch Changes

- [#832](https://github.com/storybookjs/react-native/pull/832) [`d2f2d99`](https://github.com/storybookjs/react-native/commit/d2f2d9994f98c29c07bf1fe0108134c3bec094f9) Thanks [@YevheniiKotyrlo](https://github.com/YevheniiKotyrlo)! - fix: replace @ts-ignore with Metro-specific type definitions

- [#849](https://github.com/storybookjs/react-native/pull/849) [`c0b14e8`](https://github.com/storybookjs/react-native/commit/c0b14e842f17a3e8d56501e08f59a771431946de) Thanks [@dannyhw](https://github.com/dannyhw)! - adds an mcp option to withStorybook that enables an mcp endpoint in the channel server

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.1
  - @storybook/react-native-ui-common@10.3.0-next.1
  - @storybook/react-native-theming@10.3.0-next.1

## 10.3.0-next.0

### Minor Changes

- [#848](https://github.com/storybookjs/react-native/pull/848) [`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add backgrounds addon behind `features.ondeviceBackgrounds` flag

  When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.

  ### Usage

  **1. Enable the feature in `.storybook/main.ts`:**

  ```ts
  import type { StorybookConfig } from '@storybook/react-native';

  const main: StorybookConfig = {
    stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
    features: {
      ondeviceBackgrounds: true,
    },
  };

  export default main;
  ```

  **2. Configure background options in `.storybook/preview.tsx`:**

  ```tsx
  import type { Preview } from '@storybook/react-native';

  const preview: Preview = {
    parameters: {
      backgrounds: {
        options: {
          light: { name: 'Light', value: '#ffffff' },
          dark: { name: 'Dark', value: '#333333' },
          app: { name: 'App', value: '#eeeeee' },
        },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'light' },
    },
  };

  export default preview;
  ```

  **3. Optionally override at the story level:**

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react-native';

  const meta: Meta<typeof MyComponent> = {
    component: MyComponent,
    globals: {
      // Lock background for all stories in this file
      backgrounds: { value: 'dark' },
    },
  };

  export default meta;
  ```

### Patch Changes

- Updated dependencies [[`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0)]:
  - @storybook/react-native-ui-common@10.3.0-next.0
  - @storybook/react-native-ui@10.3.0-next.0
  - @storybook/react-native-theming@10.3.0-next.0

## 10.2.3

### Patch Changes

- [`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588) Thanks [@dannyhw](https://github.com/dannyhw)! - bump storybook deps

- [#847](https://github.com/storybookjs/react-native/pull/847) [`4f50496`](https://github.com/storybookjs/react-native/commit/4f50496b5f38fa8eaad0731f08ecd3647ce727a3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: prevent crash when websocket port is in use

- Updated dependencies [[`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588)]:
  - @storybook/react-native-ui-common@10.2.3
  - @storybook/react-native-ui@10.2.3
  - @storybook/react-native-theming@10.2.3

## 10.2.2

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`eeab1bc`](https://github.com/storybookjs/react-native/commit/eeab1bc31ee5f791677280ae35120c2660184e90) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: linked addon packages should still resolve for generate script

- [`f7cba17`](https://github.com/storybookjs/react-native/commit/f7cba17598c8dd4aa045a27bc58127d32abe832e) Thanks [@dannyhw](https://github.com/dannyhw)! - release workflow test :)

- [#846](https://github.com/storybookjs/react-native/pull/846) [`eeab1bc`](https://github.com/storybookjs/react-native/commit/eeab1bc31ee5f791677280ae35120c2660184e90) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add Repack/rspack plugin for React Native Storybook
  feat: virtualize sidebar tree with LegendList for performance
  fix: root node style and text sizing adjustments
- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2
  - @storybook/react-native-ui-common@10.2.2
  - @storybook/react-native-theming@10.2.2

## 10.2.2-next.8

### Patch Changes

- [`f7cba17`](https://github.com/storybookjs/react-native/commit/f7cba17598c8dd4aa045a27bc58127d32abe832e) Thanks [@dannyhw](https://github.com/dannyhw)! - release workflow test :)

- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.8
  - @storybook/react-native-ui-common@10.2.2-next.8
  - @storybook/react-native-theming@10.2.2-next.8

## 10.2.2-next.7

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`f9c82f3`](https://github.com/storybookjs/react-native/commit/f9c82f3c8313cb9faf9b86ab4cc2afb9489cb8bb) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: linked addon packages should still resolve for generate script

- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.7
  - @storybook/react-native-ui-common@10.2.2-next.7
  - @storybook/react-native-theming@10.2.2-next.7

## 10.2.2-next.6

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`4d6cb1e`](https://github.com/storybookjs/react-native/commit/4d6cb1e64ab7f06ce9c08836e8683d595b26f7cc) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add Repack/rspack plugin for React Native Storybook
  feat: virtualize sidebar tree with LegendList for performance
  fix: root node style and text sizing adjustments
- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.6
  - @storybook/react-native-ui-common@10.2.2-next.6
  - @storybook/react-native-theming@10.2.2-next.6
