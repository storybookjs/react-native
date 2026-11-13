---
'@storybook/react-native': minor
---

Stories now get their tags in the story index, combined from the project, meta and story `tags` the same way Storybook does for the web, instead of a fixed `['story']`. Stories without the `dev` tag (for example `tags: ['!dev']`) are hidden from the on-device sidebar and are not opened by default, but can still be selected by id. The index served by the channel server includes the same tags.
