---
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
'@storybook/react-native': patch
---

Fix type errors against React Native 0.88's types, where `View` and `TextInput` refs are `ReactNativeElement`-based instances, `KeyboardEventListener` is no longer exported and style objects are read-only. The sidebar tree nodes now export their prop types (`BranchNodeProps`, `LeafNodeProps`) and ref type (`StoryNodeRef`).
