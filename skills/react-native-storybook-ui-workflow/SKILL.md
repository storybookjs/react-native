---
name: react-native-storybook-ui-workflow
description: Storybook's workflow for UI changes in a React Native project with Storybook - look up the components to reuse, write and update stories, and check them on the device. Use when you create, change or delete a component, story, style or theme in a project that uses @storybook/react-native, or when the user asks for it.
---

# React Native Storybook UI workflow

Run `npx sb-rn skills ui-workflow` and read the output in its entirety. It is the ordered workflow for this project's version of `@storybook/react-native`. Follow it.

- Run it, and every `sb-rn` command, from the app's directory, where its `.rnstorybook` folder is.
- If `sb-rn` is not found, the project's `@storybook/react-native` predates it. Tell the user, and use the `writing-react-native-storybook-stories` skill for the stories instead.
