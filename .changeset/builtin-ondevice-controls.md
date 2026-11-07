---
'@storybook/react-native': major
---

The Controls panel is now built into `@storybook/react-native` and on by default. You no longer need `@storybook/addon-ondevice-controls`; remove it from `deviceAddons` and uninstall it. To turn the panel off, set `features: { ondeviceControls: false }` in `.rnstorybook/main.ts`.

The native modules are now optional, so controls work with no extra native installs (Expo Go, tvOS, macOS, the old architecture, or before you rebuild):

- `date` uses `@react-native-community/datetimepicker` when it's installed and linked (a dialog on Android, a bottom sheet on iOS) and otherwise falls back to validated `YYYY-MM-DD` and `HH:mm` text inputs. Web keeps the `datetime-local` input. `react-native-modal-datetime-picker` is no longer used.
- `range` uses `@react-native-community/slider` when it's installed and linked, and otherwise the JavaScript slider.

Storybook checks that each module's native side is available before using it, and warns in development when a package is installed but not linked.

`getControlArgTypes`, `hasEnabledControl`, `ADDON_ID` and `PARAM_KEY` are exported from `@storybook/react-native/controls`.

Also fixes controls that keep local state (such as the number input) showing an empty value after switching stories while the Controls panel is open.
