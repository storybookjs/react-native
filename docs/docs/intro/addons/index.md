# Addons

Since react native storybook has a react native UI the web based addon panels need to be reimplemented for react native. Addons that don't include a ui should also be compatible with react native, for example msw and deep controls.

The addons made available by us are the following. There are more addons available via the community and you can also write your own addons.

| Addon       | Package                                                 |
| ----------- | ------------------------------------------------------- |
| actions     | @storybook/addon-ondevice-actions                       |
| backgrounds | Built into `@storybook/react-native`, no package needed |
| controls    | @storybook/addon-ondevice-controls                      |
| notes       | @storybook/addon-ondevice-notes                         |

## Configuration

To use on-device addons, add them to the `deviceAddons` property in your `.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
  ],
};

export default main;
```

:::info[Why `deviceAddons`?]
On-device addons contain React Native code that can only run on the device. Storybook Core evaluates every `addons` entry as a preset during server-side operations (like `extract` or `build`), which fails because Node.js can't load React Native modules. List these packages in `deviceAddons` so they are loaded only at runtime on the device. `.rnstorybook` generation does not read `addons`.

:::

## Hiding addon panels per story

On-device addon panels can be hidden for a story with the same `parameters[addonKey].disable` convention used by Storybook web. When every registered panel is disabled for the selected story, the addons button and panel are hidden.

```ts
export const WithoutControls = {
  parameters: {
    controls: { disable: true },
  },
};

export const WithoutAnyAddonPanels = {
  parameters: {
    actions: { disable: true },
    backgrounds: { disable: true },
    controls: { disable: true },
    notes: { disable: true },
  },
};
```

## Actions

The Actions addon lets you log events and actions inside your stories. It's useful for verifying component interactions and event handling.

```sh
npm install --save-dev @storybook/addon-ondevice-actions
```

Use the `action` argType to log events:

```ts
export default {
  component: Button,
  argTypes: {
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof Button>;
```

## Backgrounds

Backgrounds are built into `@storybook/react-native` and enabled by default, so there's nothing to install. Define the background options in `.rnstorybook/preview.tsx` and pick one from the Backgrounds panel on the device:

```ts
const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'Light', value: 'white' },
        dark: { name: 'Dark', value: '#333' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
};

export default preview;
```

See the [Backgrounds guide](../configuration/backgrounds.md) for story-level overrides, theming and how to turn the panel off.

:::note[`@storybook/addon-ondevice-backgrounds` is deprecated]
The standalone package is now a no-op kept for compatibility. Remove it from `deviceAddons`, remove the `withBackgrounds` decorator and uninstall it. The legacy `values` and `default` parameters still work, but we recommend moving to `options` and `initialGlobals`. See [Migrating from `@storybook/addon-ondevice-backgrounds`](../configuration/backgrounds.md#migrating-from-storybookaddon-ondevice-backgrounds).
:::

## Controls

Controls provides a graphical UI to dynamically edit component props without code. It supports 13 different control types optimized for mobile interfaces.

```sh
npm install --save-dev @storybook/addon-ondevice-controls @react-native-community/datetimepicker @react-native-community/slider
```

Basic usage:

```ts
export default {
  component: MyComponent,
  argTypes: {
    text: { control: 'text' },
    enabled: { control: 'boolean' },
    color: { control: 'color' },
    size: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof MyComponent>;
```

For detailed information about all supported control types, configuration options, and platform-specific features, see the [Controls Addon documentation](./controls.md).

## Notes

The Notes addon enables you to write additional documentation (text or markdown) for your stories.

```sh
npm install --save-dev @storybook/addon-ondevice-notes
```

Optionally install [react-native-enriched-markdown](https://github.com/software-mansion/enriched-markdown) for native rendering with GitHub Flavored Markdown tables, task lists, highlight, superscript, subscript and syntax-highlighted code blocks. It requires the New Architecture, so rebuild your native app afterwards (`npx expo prebuild` for Expo, or `pod install` for bare React Native). The addon detects it at runtime and otherwise falls back to the built-in JavaScript renderer, for example in Expo Go or on tvOS.

```sh
npm install react-native-enriched-markdown
```

Code blocks are syntax highlighted when the renderer is built with highlighting enabled (its default). Highlighting and LaTeX math each add native code to your app, so if you only need plain notes you can leave them out by adding this to your app's `package.json`:

```json
{
  "enriched-markdown": {
    "enableCodeHighlight": false,
    "enableMath": false
  }
}
```

Add notes using the parameters field:

```ts
export default {
  component: MyComponent,
  parameters: {
    notes: `
      # Component Documentation
      This is a markdown description of the component.
      
      ## Usage
      \`\`\`tsx
      <MyComponent prop="value" />
      \`\`\`
    `,
  },
} satisfies Meta<typeof MyComponent>;
```
