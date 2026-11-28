# @storybook/react-native-ui-lite

## 11.0.0-next.3

### Patch Changes

- [#981](https://github.com/storybookjs/react-native/pull/981) [`5999fa5`](https://github.com/storybookjs/react-native/commit/5999fa5158671bfcc38efee0561f3739f366c5a1) Thanks [@dannyhw](https://github.com/dannyhw)! - Stop every story switch from re-rendering the whole sidebar tree. The provider for the selected node now keeps its context value stable between renders, so a switch re-renders only the nodes it changes rather than every node in the tree.

- Updated dependencies []:
  - @storybook/react-native-ui-common@11.0.0-next.3
  - @storybook/react-native-theming@11.0.0-next.3

## 11.0.0-next.2

### Patch Changes

- [#971](https://github.com/storybookjs/react-native/pull/971) [`87b1d83`](https://github.com/storybookjs/react-native/commit/87b1d83fccee5082122e69a72f6076164e6f28d0) Thanks [@dannyhw](https://github.com/dannyhw)! - Update dependencies: `tmcp` 1.20, `@tmcp/adapter-valibot` 0.1.7, `valibot` 1.5, `ws` 8.22 and `glob` 14.0.5 in `@storybook/react-native`, `es-toolkit` 1.53 in `@storybook/react-native-ui-common`, and `@legendapp/list` 3.7.2 in `@storybook/react-native-ui-lite`.

- [#975](https://github.com/storybookjs/react-native/pull/975) [`503529a`](https://github.com/storybookjs/react-native/commit/503529a26f63c43a01d5d9a5ef2a3817f6c04ef7) Thanks [@officialasishkumar](https://github.com/officialasishkumar)! - Label the full on-device UI's controls for screen readers and UI automation tools such as Appium, as the lite UI already does. The sidebar and fullscreen toggles, the story list button, the search field and its clear button, search results, the "clear recently opened" button and a linked brand logo now have accessible names, the story tree's rows are exposed as buttons, and the selected story is marked as selected. The "expand all" button in both UIs is now labelled "Expand all" or "Collapse all" by what pressing it does, instead of the opposite. On iOS, where the story list button's label replaces its visible text, the button also exposes the open story as its accessibility value in both UIs, and the lite UI's search field is now labelled "Find components" like the full UI's.

- [#956](https://github.com/storybookjs/react-native/pull/956) [`cbeb0c2`](https://github.com/storybookjs/react-native/commit/cbeb0c2c9227116775e89bbe14183761e674e75a) Thanks [@officialasishkumar](https://github.com/officialasishkumar)! - The sidebar no longer crashes iPad debug builds when a group is collapsed with a mouse or trackpad. Sidebar rows and search results no longer set `cursor: 'pointer'`, which on iOS 17+ adds a UIKit pointer hover effect that React Native's Fabric renderer trips over when it unmounts the rows below (facebook/react-native#55489). On web the rows still show a pointer cursor, because `TouchableOpacity` already sets one.

- [#958](https://github.com/storybookjs/react-native/pull/958) [`490a3f0`](https://github.com/storybookjs/react-native/commit/490a3f07cf1f27dca3c4d517749b2fff1a7abf1e) Thanks [@dannyhw](https://github.com/dannyhw)! - Require `@legendapp/list` 3.3.5 or later, which fixes a "Cannot update a component while rendering a different component" error when selecting a story from the search results.

- [#958](https://github.com/storybookjs/react-native/pull/958) [`490a3f0`](https://github.com/storybookjs/react-native/commit/490a3f07cf1f27dca3c4d517749b2fff1a7abf1e) Thanks [@dannyhw](https://github.com/dannyhw)! - Fix type errors against React Native 0.88's types, where `View` and `TextInput` refs are `ReactNativeElement`-based instances, `KeyboardEventListener` is no longer exported and style objects are read-only. The sidebar tree nodes now export their prop types (`BranchNodeProps`, `LeafNodeProps`) and ref type (`StoryNodeRef`).

- Updated dependencies [[`87b1d83`](https://github.com/storybookjs/react-native/commit/87b1d83fccee5082122e69a72f6076164e6f28d0)]:
  - @storybook/react-native-ui-common@11.0.0-next.2
  - @storybook/react-native-theming@11.0.0-next.2

## 11.0.0-next.1

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@11.0.0-next.1
  - @storybook/react-native-theming@11.0.0-next.1

## 11.0.0-next.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@11.0.0-next.0
  - @storybook/react-native-theming@11.0.0-next.0

## 10.6.2

### Patch Changes

- [#930](https://github.com/storybookjs/react-native/pull/930) [`2456fa6`](https://github.com/storybookjs/react-native/commit/2456fa6809e8c94b3d5a61426b9c42d49db60a48) Thanks [@dannyhw](https://github.com/dannyhw)! - Restore the `react-native-reanimated` and `react-native-safe-area-context` peer dependency ranges that were accidentally pinned to the monorepo's exact versions (`4.5.1` and `5.8.0`). `@storybook/react-native` now requires `react-native-reanimated@>=3`, matching `@storybook/react-native-ui`.

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.6.2
  - @storybook/react-native-theming@10.6.2

## 10.6.1

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.6.1
  - @storybook/react-native-theming@10.6.1

## 10.6.0

### Minor Changes

- [#922](https://github.com/storybookjs/react-native/pull/922) [`93574f3`](https://github.com/storybookjs/react-native/commit/93574f3bb745a423170b7b6e5a1be7cb7f6137a0) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

### Patch Changes

- Updated dependencies [[`93574f3`](https://github.com/storybookjs/react-native/commit/93574f3bb745a423170b7b6e5a1be7cb7f6137a0)]:
  - @storybook/react-native-ui-common@10.6.0
  - @storybook/react-native-theming@10.6.0

## 10.5.4

### Patch Changes

- [#915](https://github.com/storybookjs/react-native/pull/915) [`612b47a`](https://github.com/storybookjs/react-native/commit/612b47a1014e4c07e65cecb2b9a78cb685b6fa39) Thanks [@ndelangen](https://github.com/ndelangen)! - Require storybook ^10.5.4 so RN picks up core telemetry framework inference

- Updated dependencies [[`612b47a`](https://github.com/storybookjs/react-native/commit/612b47a1014e4c07e65cecb2b9a78cb685b6fa39)]:
  - @storybook/react-native-ui-common@10.5.4
  - @storybook/react-native-theming@10.5.4

## 10.5.3

### Patch Changes

- [#913](https://github.com/storybookjs/react-native/pull/913) [`38ce5e6`](https://github.com/storybookjs/react-native/commit/38ce5e6d02fb09cfd365335b7c102241b8cf34d6) Thanks [@ndelangen](https://github.com/ndelangen)! - Require storybook ^10.5.4 so RN picks up core telemetry framework inference

- Updated dependencies [[`38ce5e6`](https://github.com/storybookjs/react-native/commit/38ce5e6d02fb09cfd365335b7c102241b8cf34d6)]:
  - @storybook/react-native-ui-common@10.5.3
  - @storybook/react-native-theming@10.5.3

## 10.5.2

### Patch Changes

- [#911](https://github.com/storybookjs/react-native/pull/911) [`c0da377`](https://github.com/storybookjs/react-native/commit/c0da37774a1318c152daa8f4b159d79e64c2f565) Thanks [@dannyhw](https://github.com/dannyhw)! - address npm audit issues

- [#910](https://github.com/storybookjs/react-native/pull/910) [`2e0f148`](https://github.com/storybookjs/react-native/commit/2e0f148ecfa3a346965129f156dcdb1575d3f1fd) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook deps

- Updated dependencies [[`c0da377`](https://github.com/storybookjs/react-native/commit/c0da37774a1318c152daa8f4b159d79e64c2f565), [`2e0f148`](https://github.com/storybookjs/react-native/commit/2e0f148ecfa3a346965129f156dcdb1575d3f1fd)]:
  - @storybook/react-native-theming@10.5.2
  - @storybook/react-native-ui-common@10.5.2

## 10.5.1

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.5.1
  - @storybook/react-native-theming@10.5.1

## 10.5.0

### Minor Changes

- [`40f25fa`](https://github.com/storybookjs/react-native/commit/40f25fad669a5034b119e07669e7287c9f51c9bc) Thanks [@dannyhw](https://github.com/dannyhw)! - update deps for compatibility with 10.5 and for audit fixes

### Patch Changes

- Updated dependencies [[`40f25fa`](https://github.com/storybookjs/react-native/commit/40f25fad669a5034b119e07669e7287c9f51c9bc)]:
  - @storybook/react-native-theming@10.5.0
  - @storybook/react-native-ui-common@10.5.0

## 10.4.7

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.4.7
  - @storybook/react-native-theming@10.4.7

## 10.4.6

### Patch Changes

- [#900](https://github.com/storybookjs/react-native/pull/900) [`494c1b7`](https://github.com/storybookjs/react-native/commit/494c1b715194a71df18ac7d3f8fe08501b436cba) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: missing legend list dep

- [#900](https://github.com/storybookjs/react-native/pull/900) [`494c1b7`](https://github.com/storybookjs/react-native/commit/494c1b715194a71df18ac7d3f8fe08501b436cba) Thanks [@dannyhw](https://github.com/dannyhw)! - bump dependencies

- Updated dependencies [[`494c1b7`](https://github.com/storybookjs/react-native/commit/494c1b715194a71df18ac7d3f8fe08501b436cba)]:
  - @storybook/react-native-ui-common@10.4.6
  - @storybook/react-native-theming@10.4.6

## 10.4.5

### Patch Changes

- [#896](https://github.com/storybookjs/react-native/pull/896) [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b) Thanks [@dannyhw](https://github.com/dannyhw)! - fix being broken by incompatible legend list versions by bundling it in

- [#889](https://github.com/storybookjs/react-native/pull/889) [`092e9f0`](https://github.com/storybookjs/react-native/commit/092e9f09096d5000543ddda5a9acd34ebbadfa07) Thanks [@Mathbl](https://github.com/Mathbl)! - feat: honor `parameters[paramKey].disable` on addon panels — matches web Storybook. When every panel is disabled for the current story, the addons UI is hidden.

- [#896](https://github.com/storybookjs/react-native/pull/896) [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b) Thanks [@dannyhw](https://github.com/dannyhw)! - bump package versions

- Updated dependencies [[`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b), [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b)]:
  - @storybook/react-native-ui-common@10.4.5
  - @storybook/react-native-theming@10.4.5

## 10.4.4

### Patch Changes

- [#891](https://github.com/storybookjs/react-native/pull/891) [`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fixes for color control

- Updated dependencies [[`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521)]:
  - @storybook/react-native-ui-common@10.4.4
  - @storybook/react-native-theming@10.4.4

## 10.4.3

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.4.3
  - @storybook/react-native-theming@10.4.3

## 10.4.2

### Patch Changes

- [#887](https://github.com/storybookjs/react-native/pull/887) [`5530e44`](https://github.com/storybookjs/react-native/commit/5530e4493f6f9051b3475cfedc3c7f849c4ead39) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: content below keyboard not reachable, sheet too tall

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.4.2
  - @storybook/react-native-theming@10.4.2

## 10.4.2-next.0

### Patch Changes

- [#887](https://github.com/storybookjs/react-native/pull/887) [`5530e44`](https://github.com/storybookjs/react-native/commit/5530e4493f6f9051b3475cfedc3c7f849c4ead39) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: content below keyboard not reachable, sheet too tall

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.4.2-next.0
  - @storybook/react-native-theming@10.4.2-next.0

## 10.4.1

### Patch Changes

- [#886](https://github.com/storybookjs/react-native/pull/886) [`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0) Thanks [@dannyhw](https://github.com/dannyhw)! - apply npm audit fixes

- [#883](https://github.com/storybookjs/react-native/pull/883) [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90) Thanks [@dannyhw](https://github.com/dannyhw)! - liteui animation changes and select control adjustments

- Updated dependencies [[`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0), [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90)]:
  - @storybook/react-native-theming@10.4.1
  - @storybook/react-native-ui-common@10.4.1

## 10.4.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.4.0
  - @storybook/react-native-theming@10.4.0

## 10.3.2

### Patch Changes

- [#875](https://github.com/storybookjs/react-native/pull/875) [`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

- Updated dependencies [[`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52), [`b3e2164`](https://github.com/storybookjs/react-native/commit/b3e2164f33988b7b1cb7046eeb46cce79f2273e1)]:
  - @storybook/react-native-ui-common@10.3.2
  - @storybook/react-native-theming@10.3.2

## 10.3.1

### Patch Changes

- [#870](https://github.com/storybookjs/react-native/pull/870) [`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fix mcp tool name change

- Updated dependencies [[`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2)]:
  - @storybook/react-native-ui-common@10.3.1
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

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#859](https://github.com/storybookjs/react-native/pull/859) [`a13f421`](https://github.com/storybookjs/react-native/commit/a13f4212d4233ca4ff9b27eb037bdf20cc0fa13d) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: use legend list react for web

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - update dev deps and lock to fix duplicate deps

- Updated dependencies [[`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0), [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91), [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui-common@10.3.0
  - @storybook/react-native-theming@10.3.0

## 10.3.0-next.6

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.3.0-next.6
  - @storybook/react-native-theming@10.3.0-next.6

## 10.3.0-next.5

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.3.0-next.5
  - @storybook/react-native-theming@10.3.0-next.5

## 10.3.0-next.4

### Patch Changes

- [#859](https://github.com/storybookjs/react-native/pull/859) [`a13f421`](https://github.com/storybookjs/react-native/commit/a13f4212d4233ca4ff9b27eb037bdf20cc0fa13d) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: use legend list react for web

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.3.0-next.4
  - @storybook/react-native-theming@10.3.0-next.4

## 10.3.0-next.3

### Patch Changes

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - update dev deps and lock to fix duplicate deps

- Updated dependencies [[`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui-common@10.3.0-next.3
  - @storybook/react-native-theming@10.3.0-next.3

## 10.3.0-next.2

### Patch Changes

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- Updated dependencies [[`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91)]:
  - @storybook/react-native-ui-common@10.3.0-next.2
  - @storybook/react-native-theming@10.3.0-next.2

## 10.3.0-next.1

### Patch Changes

- Updated dependencies []:
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
  - @storybook/react-native-theming@10.3.0-next.0

## 10.2.3

### Patch Changes

- [`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588) Thanks [@dannyhw](https://github.com/dannyhw)! - bump storybook deps

- Updated dependencies [[`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588)]:
  - @storybook/react-native-ui-common@10.2.3
  - @storybook/react-native-theming@10.2.3

## 10.2.2

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.2.2
  - @storybook/react-native-theming@10.2.2

## 10.2.2-next.8

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.2.2-next.8
  - @storybook/react-native-theming@10.2.2-next.8

## 10.2.2-next.7

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.2.2-next.7
  - @storybook/react-native-theming@10.2.2-next.7

## 10.2.2-next.6

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui-common@10.2.2-next.6
  - @storybook/react-native-theming@10.2.2-next.6
