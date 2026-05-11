# @storybook/react-native-ui-common

## 10.4.2

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.4.2

## 10.4.2-next.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.4.2-next.0

## 10.4.1

### Patch Changes

- [#886](https://github.com/storybookjs/react-native/pull/886) [`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0) Thanks [@dannyhw](https://github.com/dannyhw)! - apply npm audit fixes

- [#883](https://github.com/storybookjs/react-native/pull/883) [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90) Thanks [@dannyhw](https://github.com/dannyhw)! - liteui animation changes and select control adjustments

- Updated dependencies [[`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0), [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90)]:
  - @storybook/react-native-theming@10.4.1

## 10.4.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.4.0

## 10.3.2

### Patch Changes

- [#875](https://github.com/storybookjs/react-native/pull/875) [`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

- [#880](https://github.com/storybookjs/react-native/pull/880) [`b3e2164`](https://github.com/storybookjs/react-native/commit/b3e2164f33988b7b1cb7046eeb46cce79f2273e1) Thanks [@dannyhw](https://github.com/dannyhw)! - fix dom exception error from es-toolkit

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.2

## 10.3.1

### Patch Changes

- [#870](https://github.com/storybookjs/react-native/pull/870) [`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fix mcp tool name change

- Updated dependencies []:
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

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - update dev deps and lock to fix duplicate deps

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0

## 10.3.0-next.6

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.6

## 10.3.0-next.5

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.5

## 10.3.0-next.4

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.4

## 10.3.0-next.3

### Patch Changes

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - update dev deps and lock to fix duplicate deps

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.3

## 10.3.0-next.2

### Patch Changes

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.2

## 10.3.0-next.1

### Patch Changes

- Updated dependencies []:
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

- Updated dependencies []:
  - @storybook/react-native-theming@10.3.0-next.0

## 10.2.3

### Patch Changes

- [`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588) Thanks [@dannyhw](https://github.com/dannyhw)! - bump storybook deps

- Updated dependencies []:
  - @storybook/react-native-theming@10.2.3

## 10.2.2

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.2.2

## 10.2.2-next.8

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.2.2-next.8

## 10.2.2-next.7

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.2.2-next.7

## 10.2.2-next.6

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-theming@10.2.2-next.6
