# Storybook Notes Addon for react-native

The Notes Addon allows you to write notes (text or markdown) for your stories in [Storybook](https://storybook.js.org).

## Installation

```sh
yarn add -D @storybook/addon-ondevice-notes react-native-enriched-markdown
```

Notes are rendered with [react-native-enriched-markdown](https://github.com/software-mansion/enriched-markdown), a native Markdown renderer. It is a peer dependency, so it has to be installed in your app, and it requires the New Architecture (Fabric).

Because it contains native code, rebuild your app after installing it:

```sh
# Expo
npx expo prebuild

# Bare React Native
cd ios && bundle exec pod install
```

Code blocks in notes are syntax highlighted when the renderer is built with highlighting enabled (its default). Highlighting and LaTeX math each add native code to your app, so if you only need plain notes you can leave them out by adding this to your app's `package.json`:

```json
{
  "enriched-markdown": {
    "enableCodeHighlight": false,
    "enableMath": false
  }
}
```

To keep highlighting but limit the compiled grammars, use `codeHighlightLanguages` instead, for example `["tsx", "bash", "json"]`.

See the [react-native-enriched-markdown installation guide](https://github.com/software-mansion/enriched-markdown/tree/main/packages/react-native-enriched-markdown#installation) for details, including notes for pnpm users.

## Configuration

Then, add following content to `.rnstorybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  deviceAddons: ['@storybook/addon-ondevice-notes'],
};

export default main;
```

## Usage

Use the `notes` parameter to add a note to stories:

```tsx
import type { Meta } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'My title',
  component: MyComponent,
  parameters: {
    notes: `
     # Here I can add some markdown
     
     Put a full new line between each element.
    `,
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
```

See the [example app](../../examples/expo-example) for more examples.
