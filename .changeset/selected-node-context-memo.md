---
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
---

Stop every story switch from re-rendering the whole sidebar tree. The provider for the selected node now keeps its context value stable between renders, so a switch re-renders only the nodes it changes rather than every node in the tree.
