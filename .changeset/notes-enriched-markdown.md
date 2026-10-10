---
'@storybook/addon-ondevice-notes': minor
---

Notes can now be rendered natively with `react-native-enriched-markdown`.

Install `react-native-enriched-markdown` in your app and rebuild it (`npx expo prebuild` or `pod install`); the addon picks it up automatically and renders notes as native text with support for GitHub Flavored Markdown tables, task lists, `==highlight==`, superscript, subscript and syntax-highlighted code blocks. Without it, or where its native module is unavailable (Expo Go, tvOS, old architecture), notes keep using the previous JavaScript renderer, so nothing changes for existing setups.

Highlighting and LaTeX math add native code to your app; if you only need plain notes, add `"enriched-markdown": { "enableCodeHighlight": false, "enableMath": false }` to your app's `package.json`.
