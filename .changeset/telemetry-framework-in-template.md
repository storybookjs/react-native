---
'@storybook/react-native': patch
---

Telemetry: attribute React Native `dev` events with `metadata.framework.name` on upgrade

`withStorybook` already sent `dev` telemetry after #907, but existing `.rnstorybook/main` files often omit `framework`, so Metabase could not attribute usage. On enabled Storybook startups we now ensure framework metadata is present without modifying user files (no codemod): use the real config dir when metadata already has a framework name, otherwise send the event via a temporary main that includes `framework: '@storybook/react-native'`. The CLI template also declares `framework` for newly generated projects.
