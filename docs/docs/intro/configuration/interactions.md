---
sidebar_position: 8
---

# Interactions

The `ondeviceInteractions` [feature flag](./feature-flags.md) adds an experimental Interactions panel to the on-device UI, like the Interactions panel on Storybook web. It lists the `step` and `expect` calls from a story's play function as they run, shows which passed or failed, and has a button to rerun the story.

When this flag is enabled you don't need to install another package or add anything to your `deviceAddons` array.

## Setup

```ts
// .rnstorybook/main.ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  features: {
    ondeviceInteractions: true,
  },
};

export default main;
```

With the flag enabled:

- Play functions run, without setting `reactNative.playFn`.
- `canvasElement` in a play function is the host element that wraps the story. You can read its `textContent` and walk its `children`.
- Rerunning a story while its play function is running cancels the run and starts a new one.

## Writing play functions

Use `step` and `expect` from `storybook/test`, and they show up in the panel:

```tsx
import { expect } from 'storybook/test';

export const Assertions: Story = {
  play: async ({ canvasElement, step }) => {
    await step('Check the initial count', async () => {
      await expect(canvasElement.textContent).toContain('Count: 0');
    });
  },
};
```

## Dispatching events

On React Native versions where elements support `EventTarget`, currently the [Canary release channel](https://reactnative.dev/docs/releases/release-levels), play functions can call `dispatchEvent` on elements. React Native maps a dispatched event to the component's existing props, so the component needs no test-only code:

| Event                                  | Prop                       |
| -------------------------------------- | -------------------------- |
| `change` with `nativeEvent: { text }`  | `TextInput` `onChangeText` |
| `change` with `nativeEvent: { value }` | `Switch` `onValueChange`   |
| `click`                                | `Pressable` `onPress`      |

```tsx
const event = new Event('change', { bubbles: true });
event.nativeEvent = { text: 'Ada' };
input.dispatchEvent(event); // calls the TextInput's onChangeText('Ada')
```

React Native elements don't have DOM APIs like `querySelector`, so there are no Testing Library queries yet. You can find elements by walking `children` and checking `id` (from `nativeID`), `tagName` or `textContent`.

## Limitations

- This is experimental and may change in any release.
- Passing a React Native element to Storybook's `expect` throws, because Storybook serializes it as a DOM element. Assert on values such as `textContent` instead.
