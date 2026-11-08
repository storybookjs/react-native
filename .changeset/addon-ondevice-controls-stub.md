---
'@storybook/addon-ondevice-controls': major
---

Deprecated: Controls are built into `@storybook/react-native`. This package is now an empty compatibility stub. `register` registers nothing (the built-in panel is used) and warns once in development that you can remove the package from `deviceAddons` and uninstall it. `ADDON_ID`, `PARAM_KEY` and the `dist/controlArgTypes` re-exports are kept.

It no longer depends on `@gorhom/portal`, `polished`, `tinycolor2` or `react-native-modal-datetime-picker`, and no longer has `@react-native-community/datetimepicker`, `@react-native-community/slider` or `@gorhom/bottom-sheet` as peers. It now has `@storybook/react-native` as a peer dependency.
