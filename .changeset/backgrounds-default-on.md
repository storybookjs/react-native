---
'@storybook/react-native': major
---

The built-in Backgrounds panel is now enabled by default. Set `features.ondeviceBackgrounds: false` in `.rnstorybook/main` to turn it off; `ondeviceBackgrounds: true` is no longer needed. Stories without `parameters.backgrounds` get no background, as before.

The panel and the story background also read the legacy `@storybook/addon-ondevice-backgrounds` parameters: a `values` array is keyed by each entry's `name`, and `default` (or the first value) is applied while no `backgrounds` global is set. `parameters.backgrounds.disable: true` now also skips the story background. See the migration guide for moving to `options` and `initialGlobals`.
