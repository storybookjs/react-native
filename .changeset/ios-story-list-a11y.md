---
'@storybook/react-native-ui': patch
---

The on-device story list is no longer one opaque element in the iOS accessibility tree: the bottom sheet that holds it is no longer marked accessible, so VoiceOver and UI automation can see the search field and every story row. The list is also hidden from accessibility while the sheet is closed, so VoiceOver cannot reach rows rendered off-screen.
