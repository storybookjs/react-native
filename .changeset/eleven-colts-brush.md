---
'@storybook/react-native-ui-common': minor
'@storybook/react-native-ui-lite': minor
'@storybook/react-native-ui': minor
'@storybook/react-native': minor
---

feat: add built-in backgrounds addon behind `features.ondeviceBackgrounds` flag

When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.
