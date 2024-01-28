# Storybook Notes Addon for react-native

The Notes Addon allows you to write notes (text or markdown) for your stories in [Storybook](https://storybook.js.org).

## Installation

```sh
yarn add -D @storybook/addon-ondevice-notes
```

## Configuration

Then, add following content to `.storybook/main.ts`:

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: ['@storybook/addon-ondevice-notes'],
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
