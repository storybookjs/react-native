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
- Like on the web, play functions get `canvas`, Testing Library-style queries scoped to the story, and `userEvent`. `canvasElement` is the host element that wraps the story.
- Rerunning a story while its play function is running cancels the run and starts a new one.

## Writing play functions

Play functions look the same as on Storybook web. Queries, `userEvent` calls, `step` and `expect` all show up in the panel:

```tsx
import { expect } from '@storybook/react-native/test';

export const SignUp: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Name'), 'Ada Lovelace');
    await userEvent.type(canvas.getByPlaceholderText('you@example.com'), 'ada@example.com');
    await userEvent.click(canvas.getByRole('switch', { name: 'Accept the terms' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));

    await expect(await canvas.findByText(/^Signed up/)).toBeTruthy();
  },
};
```

`@storybook/react-native/test` is the React Native counterpart of `storybook/test`. It exports `within`, `userEvent` and `waitFor`, which work on React Native elements, and re-exports `expect`, `fn`, `spyOn` and the other mocking utilities from `storybook/test`.

### Queries

`canvas` and `within(element)` have the `getBy`, `getAllBy`, `queryBy`, `queryAllBy`, `findBy` and `findAllBy` variants of these queries:

| Query               | Matches                                                                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ByRole`            | `role` or `accessibilityRole`, with `TextInput` as `textbox`, `Switch` as `switch` and `Image` as `img`. Options: `name` (the accessible name), `checked`, `disabled`. |
| `ByText`            | The content of a `Text`.                                                                                                                                               |
| `ByLabelText`       | `aria-label`, `accessibilityLabel`, or the text of the element named by `aria-labelledby` or `accessibilityLabelledBy`.                                                |
| `ByPlaceholderText` | A `TextInput`'s `placeholder`.                                                                                                                                         |
| `ByDisplayValue`    | A `TextInput`'s `value` or `defaultValue`.                                                                                                                             |
| `ByAltText`         | An `Image`'s `alt`.                                                                                                                                                    |
| `ByTestId`          | `testID`.                                                                                                                                                              |

Matchers can be a string, a regular expression or a function, with `exact` and `normalizer` options, as in Testing Library. `findBy` queries take `waitFor` options (`timeout`, `interval`) as their last argument.

The queries read props such as `accessibilityRole` from React's internals, because React Native elements don't expose them yet. They may break with a React Native update.

### userEvent

`userEvent` needs a React Native version where elements support `EventTarget`, currently the [Canary release channel](https://reactnative.dev/docs/releases/release-levels). Each method dispatches the event native would, which React Native routes to the component's existing props, so the component needs no test-only code:

| Method                           | What it does                                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `click(element)`                 | Calls `onPress` on the nearest pressable, so clicking the text inside a button presses the button. Toggles a `Switch`. |
| `dblClick(element)`              | Clicks twice.                                                                                                          |
| `type(element, text, { delay })` | Types at the end of a `TextInput`'s value, one character at a time, calling `onChangeText` for each.                   |
| `clear(element)`                 | Calls `onChangeText('')`.                                                                                              |
| `keyboard(text)`                 | Types into the input last clicked or typed into.                                                                       |
| `setup({ delay })`               | Creates an instance with its own options.                                                                              |

Special keys such as `{Enter}`, `hover`, `tab` and `selectOptions` aren't supported.

## Limitations

- This is experimental and may change in any release.
- Matchers from `@testing-library/jest-dom`, such as `toBeVisible`, need the DOM and don't work. Assert on values such as `textContent`, or on whether a query found an element.
