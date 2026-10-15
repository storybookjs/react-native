---
'@storybook/react-native': major
---

`.rnstorybook` main configs no longer load addons from `addons`. List them in `deviceAddons`. The Storybook CLI automigration `rn-ondevice-addons-to-device-addons` renames the field when `deviceAddons` is not already set. `definePreview({ addons })` is unchanged.
