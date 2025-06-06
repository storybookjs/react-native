---
sidebar_position: 1
description: Learn how Storybook for React Native helps you build bulletproof UI components in isolation, with full access to native APIs and core Storybook features.
keywords: [react native, storybook, introduction, component development, mobile ui]
---

# Introduction

With Storybook for React Native you can design and develop individual React Native components without running your app.

React Native Storybook aims to be compatible with the core features of Storybook and aims for maximum code reuse from the web. The UI is reimplemented for Native whereas the core features come from the core Storybook internal API's.

## Comparison

To understand how React Native Storybook works it is also useful to understand the differences between it and Storybook on the web.

| Feature             | React Native Storybook                                 | Web Storybook         |
| ------------------- | ------------------------------------------------------ | --------------------- |
| Runtime Environment | Native mobile environment and basic web support        | Browser environment   |
| Preview             | Runs directly in your app, limited isolation           | Runs in iframe        |
| Addons              | Core addons supported (controls/actions/etc)           | Full addon ecosystem  |
| Development Server  | Metro bundler (potentially works with others)          | Webpack/Vite/etc      |
| Platform Features   | Access to native API's                                 | Access to web API's   |
| How it renders      | React Native component you integrate into your app     | It's own separate app |
| Deploy              | Ship to test flight or other pre-prod app distribution | Deploy on the web     |
| Story syntax        | CSF                                                    | CSF                   |

## React Native Web

React Native can be used on the web via React Native Web and so you may be wondering can I use React Native Storybook on the web.

Yes you can use react native storybook on the web.

You can either run the native Storybook directly on the web or you can setup a web Storybook alongside your native storybook and use the `@storybook/react-native-web-vite` framework to get access to the full storybook feature set. You can trade off some extra config and setup for more features and the ability to easily deploy a hosted version of your storybook.

The docs here will focus on the Native storybook and only reference the vite framework where compatibility is concerned.
