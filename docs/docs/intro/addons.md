# Addons

Since react native storybook has a react native UI the web based addon panels need to be reimplemented for react native. Addons that don't include a ui should also be compatible with react native, for example msw and deep controls.

The addons made available by us are the following. There are more addons available via the community and you can also write your own addons.

| Addon       | Package                               |
| ----------- | ------------------------------------- |
| actions     | @storybook/addon-ondevice-actions     |
| backgrounds | @storybook/addon-ondevice-backgrounds |
| controls    | @storybook/addon-ondevice-controls    |
| notes       | @storybook/addon-ondevice-notes       |

## Configuration

To use these addons, add them to your `.storybook/main.ts`:

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
  ],
};

export default main;
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

The Backgrounds addon allows you to change background colors of your stories directly on the device. Perfect for testing components against different backgrounds.

```sh
npm install --save-dev @storybook/addon-ondevice-backgrounds
```

First, add the required decorator in `.storybook/preview.tsx`:

```ts
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

const preview: Preview = {
  decorators: [withBackgrounds], // This decorator is required
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'white' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};

export default preview;
```

You can then override these background options in individual stories:

```ts
export default {
  component: MyComponent,
  parameters: {
    backgrounds: {
      default: 'warm',
      values: [
        { name: 'warm', value: 'hotpink' },
        { name: 'cool', value: 'deepskyblue' },
      ],
    },
  },
} satisfies Meta<typeof MyComponent>;
```

Component-level background settings will override the global settings from preview.tsx, but the decorator is still required.

## Controls

Controls provides a graphical UI to dynamically edit component props without code. It requires additional dependencies for form inputs:

```sh
npm install --save-dev @storybook/addon-ondevice-controls @react-native-community/datetimepicker @react-native-community/slider
```

Controls can be defined in multiple ways:

1. Inferred from `args` values:

```ts
export default {
  component: MyComponent,
  args: {
    text: 'Hello', // infers text control
    enabled: true, // infers boolean control
  },
} satisfies Meta<typeof MyComponent>;
```

2. Inferred using TypeScript props with `babel-plugin-react-docgen-typescript`:

```js
// babel.config.js
module.exports = {
  plugins: [['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }]],
};
```

This will automatically create controls based on your component's types.

3. Define controls using argTypes:

```ts
export default {
  component: MyComponent,
  argTypes: {
    text: { control: 'text' },
    enabled: { control: 'boolean' },
    color: { control: 'color' },
    size: { control: { type: 'range', min: 0, max: 100 } },
    type: { control: { type: 'radio', options: ['small', 'medium', 'large'] } },
  },
} satisfies Meta<typeof MyComponent>;
```

## Notes

The Notes addon enables you to write additional documentation (text or markdown) for your stories.

```sh
npm install --save-dev @storybook/addon-ondevice-notes
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
