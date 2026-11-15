---
'@storybook/react-native': patch
---

Support Storybook 11.0.0-beta.0. Its preview now calls `window.addEventListener` while setting up listeners, which React Native doesn't provide, so `start()` threw `globalWindow.addEventListener is not a function`.
