---
'@storybook/react-native': patch
---

Generated `storybook.requires` no longer crashes on startup when `features` is set in `main`. Feature flags are now merged into `globalThis.FEATURES` instead of written onto it, so the file no longer throws `TypeError: Cannot set property 'ondeviceBackgrounds' of undefined` when Metro's `inlineRequires` evaluates it before Storybook has created that object.
