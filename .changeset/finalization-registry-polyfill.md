---
'@storybook/react-native': patch
---

Storybook no longer fails to start with "Property 'FinalizationRegistry' doesn't exist" on React Native versions before 0.88 (for example Expo SDK 57). The generated `storybook.requires` file now imports `@storybook/react-native/polyfills` first, which adds a no-op `FinalizationRegistry` when Hermes has none. Restart Metro after updating so the file is regenerated.
