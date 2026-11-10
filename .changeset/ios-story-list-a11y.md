---
'@storybook/react-native-ui': patch
---

The on-device story list is no longer one opaque element in the iOS accessibility tree. The bottom sheet that holds it, and its handle, background and backdrop, are no longer marked as accessible elements, so VoiceOver and UI automation see the search field and every story row instead of empty "Bottom Sheet" elements. The list is also hidden from accessibility while the sheet is closed, so VoiceOver cannot reach rows rendered off-screen.
