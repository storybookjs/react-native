---
'@storybook/react-native': minor
---

Controls can now be built in. Set `features: { ondeviceControls: true }` in `.rnstorybook/main.ts` to get the Controls panel from `@storybook/react-native`, without installing `@storybook/addon-ondevice-controls` or listing it in `deviceAddons`.

The native modules are optional, so the built-in controls work with no extra native installs (Expo Go, tvOS, macOS, the old architecture, or before you rebuild):

- `date` uses `@react-native-community/datetimepicker` when it's installed and linked (a dialog on Android, a bottom sheet on iOS) and otherwise falls back to validated `YYYY-MM-DD` and `HH:mm` text inputs. Web keeps the `datetime-local` input.
- `range` uses `@react-native-community/slider` when it's installed and linked, and otherwise the JavaScript slider.

Storybook checks that each module's native side is available before using it, and warns in development when a package is installed but not linked. If `@storybook/addon-ondevice-controls` is still in `deviceAddons`, the built-in panel replaces it (same addon id), so you won't get two Controls panels.
