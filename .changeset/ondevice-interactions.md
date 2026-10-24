---
'@storybook/react-native': minor
---

Add an experimental built-in Interactions panel, enabled with `features.ondeviceInteractions` in `main`. It lists the `step` and `expect` calls from a story's play function and can rerun the story. With the feature enabled, play functions run without `reactNative.playFn`, get the story's root element as `canvasElement`, and can be rerun while they're running. On React Native versions with `EventTarget` support on elements, currently the Canary release channel, play functions can dispatch events on elements to press buttons and type into inputs.
