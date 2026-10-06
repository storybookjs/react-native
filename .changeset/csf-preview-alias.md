---
'@storybook/react-native': patch
---

Metro and Repack now rewrite `#.storybook/preview` to `{configPath}/preview` so CSF Next stories can use the documented specifier on native.
