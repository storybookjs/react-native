---
'@storybook/react-native': patch
---

Index CSF factories story files that have no default export, the shape Storybook's `csf-factories` codemod produces. The on-device index now reads the meta from a file's factory stories, like Storybook does, instead of skipping every file without `export default meta`, which left the index empty and failed with `EmptyIndexError`. Its title, `includeStories`, `excludeStories` and `tags` are read from the meta's input, so metas from a preview not made with this package's `definePreview` work too. In a CSF factories file only factory stories are indexed.
