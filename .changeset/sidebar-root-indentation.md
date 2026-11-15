---
'@storybook/react-native-ui': patch
---

Indent the full UI's sidebar entries one level under their root heading, as the lite UI already does. Components, groups and stories that sit under a root (the uppercase section heading) used to start at the same left edge as the heading; every level below a root now sits 18 points further right, so the nesting is easier to follow. Entries that have no root are unchanged.
