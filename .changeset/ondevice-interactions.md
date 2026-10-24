---
'@storybook/react-native': minor
---

Add an experimental built-in Interactions panel, enabled with `features.ondeviceInteractions` in `main`. It lists the queries, `userEvent` calls, `step` and `expect` calls from a story's play function and can rerun the story. With the feature enabled, play functions run without `reactNative.playFn`, can be rerun while they're running, and get `canvas` and `userEvent` like on the web.

Add `@storybook/react-native/test`, the React Native counterpart of `storybook/test`, with Testing Library-style queries (`within`, `getByRole`, `getByText`, `getByLabelText`, …), `userEvent` (`click`, `type`, `clear`, `keyboard`) and `waitFor`. `userEvent` dispatches events on elements, which needs a React Native version with `EventTarget` support on elements, currently the Canary release channel.
