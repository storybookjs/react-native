---
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
---

The sidebar no longer crashes iPad debug builds when a group is collapsed with a mouse or trackpad. Sidebar rows and search results no longer set `cursor: 'pointer'`, which on iOS 17+ adds a UIKit pointer hover effect that React Native's Fabric renderer trips over when it unmounts the rows below (facebook/react-native#55489). On web the rows still show a pointer cursor, because `TouchableOpacity` already sets one.
