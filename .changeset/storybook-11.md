---
'@storybook/react-native': major
---

Storybook React Native now requires Storybook 11. Update `storybook`, `@storybook/react` and the other Storybook packages to 11.x.

Story sorting moves to `storySorts` in `.rnstorybook/main.ts`, following Storybook 11. Each sorter only orders the stories that the sorters before it consider equal. `parameters.options.storySort` in preview still works on device but is deprecated, and the requires generator logs a warning when it finds it. See the migration guide for details.
