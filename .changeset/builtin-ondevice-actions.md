---
'@storybook/react-native': major
---

The on-device Actions panel is now built into `@storybook/react-native` and enabled by default. Remove `@storybook/addon-ondevice-actions` from `deviceAddons` and uninstall it. To turn the panel off, set `features: { ondeviceActions: false }` in `.rnstorybook/main.ts`.
