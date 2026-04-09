---
'@storybook/react-native': minor
---

Add `deviceAddons` property to `StorybookConfig` for separating on-device addons from core addons. On-device addons listed in `deviceAddons` are only consumed at runtime by the code generator, not evaluated as presets by Storybook Core. This prevents `extract` failures caused by loading React Native code in a Node.js context. Backwards compatible: addons in the `addons` field continue to work.
