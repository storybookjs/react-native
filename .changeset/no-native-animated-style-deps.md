---
'@storybook/react-native-ui': patch
---

The addons panel no longer passes `useAnimatedStyle` dependencies on native, where Reanimated 4.6+ ignores them and warns ("Dependencies should only be used on the web").
