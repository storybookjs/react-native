---
'@storybook/addon-ondevice-notes': minor
---

Render notes with `react-native-enriched-markdown` instead of `react-native-markdown-display`.

`react-native-enriched-markdown` is now a peer dependency of `@storybook/addon-ondevice-notes`. It is a native module that requires the New Architecture, so install it in your app and rebuild the native app (`npx expo prebuild` or `pod install`). Notes now support GitHub Flavored Markdown tables, task lists, `==highlight==`, superscript, subscript and syntax-highlighted code blocks. Highlighting and LaTeX math add native code to your app; if you only need plain notes, add `"enriched-markdown": { "enableCodeHighlight": false, "enableMath": false }` to your app's `package.json`.
