---
'@storybook/react-native': patch
---

Allow `react-native-url-polyfill` v4. The dependency range is now `^3.0.0 || ^4.0.0`, so an app that uses v4 no longer gets a second, nested v3 copy for Storybook.
