---
'@storybook/react-native': minor
---

Add a built-in on-device Actions panel behind the `ondeviceActions` feature flag. Set `features: { ondeviceActions: true }` in `.rnstorybook/main.ts` and remove `@storybook/addon-ondevice-actions` from `deviceAddons`; the separate package is no longer needed. The built-in panel uses the same addon id as the package, so if both are enabled the built-in one replaces the package's panel instead of adding a second one, and a warning is logged in development.
