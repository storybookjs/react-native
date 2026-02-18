# @storybook/react-native

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
