---
'@storybook/react-native': patch
---

Storybook 11.0.0-beta.1 guards its `window.addEventListener` call for landmark navigation itself, so the `setupListeners` workaround is removed and the minimum `storybook` version is now 11.0.0-beta.1.
