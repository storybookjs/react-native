---
'@storybook/addon-ondevice-actions': major
---

Deprecated: the Actions addon is now built into `@storybook/react-native`. This package is an empty compatibility stub. Its `register` no longer registers a panel, so projects that still list it in `deviceAddons` get the built-in Actions panel (only once), plus a one-time warning in development asking them to remove it. Remove it from `deviceAddons` and uninstall it.
