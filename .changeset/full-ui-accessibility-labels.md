---
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
---

Label the full on-device UI's controls for screen readers and UI automation tools such as Appium, as the lite UI already does. The sidebar and fullscreen toggles, the story list button, the search field and its clear button, search results, the "clear recently opened" button and a linked brand logo now have accessible names, the story tree's rows are exposed as buttons, and the selected story is marked as selected. The "expand all" button in both UIs is now labelled "Expand all" or "Collapse all" by what pressing it does, instead of the opposite. On iOS, where the story list button's label replaces its visible text, the button also exposes the open story as its accessibility value in both UIs, and the lite UI's search field is now labelled "Find components" like the full UI's.
