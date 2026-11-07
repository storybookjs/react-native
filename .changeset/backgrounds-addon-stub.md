---
'@storybook/addon-ondevice-backgrounds': major
---

Deprecated: backgrounds are built into `@storybook/react-native`. This package is now a compatibility stub. Its `register` entry registers nothing and warns once in development, so the built-in Backgrounds panel is the only one, and `withBackgrounds` renders the story unchanged so backgrounds aren't applied twice. The `Background` type is still exported. `@storybook/react-native` is now a peer dependency. Remove the package from `deviceAddons`, drop `withBackgrounds` from your decorators and uninstall it.
