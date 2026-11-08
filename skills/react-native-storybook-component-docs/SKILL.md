---
name: react-native-storybook-component-docs
description: Look up the components of a React Native project with Storybook, with their props and usage examples, to answer questions about them or to reuse them instead of building duplicates. Use when the project uses @storybook/react-native and you need a component's props or an existing component to reuse. For a UI change, use react-native-storybook-ui-workflow, which includes the same lookup.
---

# React Native Storybook component docs

Run `npx sb-rn skills component-docs` and follow its output.

- Run it from the app's directory, where its `.rnstorybook` folder is. The commands read story files and do not need the app running.
- If `sb-rn` is not found, the project's `@storybook/react-native` predates it. Read the component source files and stories instead.
