---
'@storybook/react-native': patch
---

Support Storybook 11.0.0-alpha.7, which removed deprecated type aliases such as `StoriesHash` and `StoryContextForLoaders`. The sidebar now throws on story index versions below v3, matching core.
