---
'@storybook/react-native': patch
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
---

Restore the `react-native-reanimated` and `react-native-safe-area-context` peer dependency ranges that were accidentally pinned to the monorepo's exact versions (`4.5.1` and `5.8.0`)
