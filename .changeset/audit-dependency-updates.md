---
'@storybook/react-native': patch
'@storybook/react-native-ui': patch
'@storybook/react-native-ui-lite': patch
'@storybook/react-native-ui-common': patch
---

Update dependencies with security fixes. `@storybook/react-native` now depends on `glob@^14.0.5` (13.x is affected by GHSA-3g3m-2fjr-6pw4), and the `@storybook/react` dependency range now starts at 10.6.7, which peers on `storybook@^10.6.7` and so steers projects past the `storybook` versions fixed in 10.6.2.
