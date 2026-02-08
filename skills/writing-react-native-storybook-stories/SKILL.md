---
name: writing-react-native-storybook-stories
description: Create and edit React Native Storybook stories using Component Story Format (CSF). Use when writing .stories.tsx files, adding stories to React Native components, configuring Storybook addons (controls, actions, backgrounds, notes), setting up argTypes, decorators, parameters, or working with portable stories for testing. Applies to any task involving @storybook/react-native story authoring.
---

# React Native Storybook Stories

Write stories for React Native components using `@storybook/react-native` v10 and Component Story Format (CSF).

## Quick Start

Minimal story file:

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyComponent } from './MyComponent';

const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    label: 'Hello',
  },
};
```

## File Conventions

- Name: `ComponentName.stories.tsx` colocated with the component
- Import `Meta` and `StoryObj` from `@storybook/react-native`
- Default export: `meta` object with `satisfies Meta<typeof Component>`
- Named exports: UpperCamelCase story names, typed as `StoryObj<typeof meta>`
- Use `args` for props, `argTypes` for control config, `parameters` for addon config
- Use `render` for custom render functions, `decorators` for wrappers

## Story Patterns

### Multiple stories with shared args

```tsx
export const Primary: Story = {
  args: { variant: 'primary', title: 'Click me' },
};

export const Secondary: Story = {
  args: { ...Primary.args, variant: 'secondary' },
};
```

### Custom render function

```tsx
export const WithScrollView: Story = {
  render: (args) => (
    <ScrollView>
      <MyComponent {...args} />
    </ScrollView>
  ),
};
```

### Render with hooks (must be a named function)

```tsx
export const Interactive: Story = {
  render: function InteractiveRender() {
    const [count, setCount] = useReducer((s) => s + 1, 0);
    return <Counter count={count} onPress={setCount} />;
  },
};
```

### Actions (mock callbacks)

```tsx
import { fn } from 'storybook/test';

const meta = {
  component: Button,
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;
```

Or via argTypes:

```tsx
argTypes: { onPress: { action: 'pressed' } },
```

### Custom story name

```tsx
export const MyStory: Story = {
  storyName: 'Custom Display Name',
  args: { label: 'Hello' },
};
```

### Custom title / nesting

```tsx
const meta = {
  title: 'NestingExample/Message/Bubble',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
```

## Controls & ArgTypes

For the full control type reference, see [references/controls.md](references/controls.md).

Common patterns:

```tsx
const meta = {
  component: MyComponent,
  argTypes: {
    // Select dropdown
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    // Range slider
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    // Color picker
    color: { control: { type: 'color' } },
    // Conditional control (shows only when `advanced` arg is true)
    padding: { control: 'number', if: { arg: 'advanced' } },
  },
} satisfies Meta<typeof MyComponent>;
```

Auto-detection: TypeScript prop types are automatically mapped to controls (`string` -> text, `boolean` -> boolean, union types -> select, `number` -> number).

## Parameters

### Addon parameters

```tsx
parameters: {
  // Markdown docs in the Notes addon tab
  notes: `# MyComponent\nUsage: \`<MyComponent label="hi" />\``,
  // Background options for Backgrounds addon
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'light', value: 'white' },
      { name: 'dark', value: '#333' },
    ],
  },
},
```

### RN-specific UI parameters

| Parameter               | Type                                         | Description                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noSafeArea`            | `boolean`                                    | Remove top safe area padding. **When using this, the component itself must handle safe areas** since Storybook will no longer provide safe area padding. Prefer `useSafeAreaInsets()` over `SafeAreaView` — apply insets as `paddingTop`/`paddingBottom` on the container, and for scrollable content use `contentContainerStyle` padding instead of wrapping in `SafeAreaView`. |
| `storybookUIVisibility` | `'visible'` \| `'hidden'`                    | Initial UI visibility                                                                                                                                                                                                                                                                                                                                                            |
| `hideFullScreenButton`  | `boolean`                                    | Hide fullscreen toggle                                                                                                                                                                                                                                                                                                                                                           |
| `layout`                | `'padded'` \| `'centered'` \| `'fullscreen'` | Story container layout                                                                                                                                                                                                                                                                                                                                                           |

Parameters can be set at story, meta (component), or global (preview.tsx) level.

## Decorators

Wrap stories in providers, layouts, or context:

```tsx
const meta = {
  component: MyComponent,
  decorators: [
    (Story) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MyComponent>;
```

Global decorators go in `.rnstorybook/preview.tsx`:

```tsx
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';
import type { Preview } from '@storybook/react-native';

const preview: Preview = {
  decorators: [withBackgrounds],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'plain',
      values: [
        { name: 'plain', value: 'white' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};

export default preview;
```

## Configuration

### .rnstorybook/main.ts

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-notes',
  ],
  framework: '@storybook/react-native',
};

export default main;
```

Story globs also support the object form for multi-directory setups:

```ts
stories: [
  '../components/**/*.stories.?(ts|tsx|js|jsx)',
  { directory: '../other_components', files: '**/*.stories.?(ts|tsx|js|jsx)' },
],
```

## Portable Stories (Testing)

Reuse stories in Jest tests:

```tsx
import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './Button.stories';

const { Primary, Secondary } = composeStories(stories);

test('renders primary button', () => {
  render(<Primary />);
  expect(screen.getByText('Click me')).toBeTruthy();
});

// Override args in tests
test('renders with custom props', () => {
  render(<Primary title="Custom" />);
  expect(screen.getByText('Custom')).toBeTruthy();
});
```

For single stories use `composeStory`:

```tsx
import { composeStory } from '@storybook/react';
import meta, { Primary } from './Button.stories';

const PrimaryStory = composeStory(Primary, meta);
```

Setup global annotations for tests in a Jest setup file:

```ts
// setup-portable-stories.ts
import { setProjectAnnotations } from '@storybook/react';
import * as previewAnnotations from '../.rnstorybook/preview';
setProjectAnnotations(previewAnnotations);
```

## Addons Summary

| Addon       | Package                                 | Purpose                    |
| ----------- | --------------------------------------- | -------------------------- |
| Controls    | `@storybook/addon-ondevice-controls`    | Edit props interactively   |
| Actions     | `@storybook/addon-ondevice-actions`     | Log component interactions |
| Backgrounds | `@storybook/addon-ondevice-backgrounds` | Change story backgrounds   |
| Notes       | `@storybook/addon-ondevice-notes`       | Add markdown documentation |
