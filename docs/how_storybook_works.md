# How Storybook Works

In this guide, we'll discuss how Storybook works internally. This document is useful if you are looking to add more features to storybook or trying to hack it. If you just looking to use Storybook, you don't need to familiar with this document.

## TOC

* [Major Components](#major-components)
* [Development Setup](#development-setup)

## Major Components

Storybook mainly comes with few different components. Here are they:

1. Storybook Manager UI - That's the UI of the storybook where you interact with.
2. Storybook Preview - This is the iframe your components are rendered.
3. Webpack Dev Server - Storybook runs a Webpack Dev Server with [HMR](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) support. (usually, you invoke this with `npm run storybook`.)
4. Static Builder - Build the storybook into a set of static files. (usually, you invoke this with `npm run build-storybook`.)

Let's have a look at each of these component with more information.

### 1. Storybook Manager UI

This is the core UI of the storybook. Visit [storybook UI](https://github.com/kadirahq/storybook-ui) repo to add UI related changes.

### 2. Storybook Preview

This is the place we render components related to stories. This has a live connection to the Webpack dev server and it support [HMR](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack). This usually renders as an iframe inside the Manager UI.

Once loaded, preview sends information like available stories, actions to the parent frame(Manager UI) via some iframe hacks. (using [page-bus](https://www.npmjs.com/package/page-bus) module).

It also receives instructions from the parent window(Manager UI) to do certain tasks like switching stories.

Source code for Storybook preview is located at `src/client/preview`.

### 3. Webpack Dev Server

This is script initialize the Webpack dev server. It loads both the Manager UI and the Storybook preview and starts a HTTP server in a given port.

Source code for Webpack Dev Server is located at: `src/index.js`.

### 4. Static Builder

This is the static builder which creates a set of files which contains your Storybook. Then you can deploy this into GitHub pages or another static files hosting server (or service).
code

## Development Setup

When you are developing the Storybook follow these steps.

* Run the development watcher with `npm run dev` inside the local repo.
* Link the local repo with `npm link`
* Then pick a [sample app](https://github.com/kadira-samples/react-storybook-demo) and link storybook into that with `npm link @kadira/storybook`.
* Then run the storybook with `npm run storybook`.
* Now change code as necessary and see changes.
* To reflect changes in the Manager UI, you need to reload the Storybook browser window.
* To reflect any changes done in the server code, you need to re-run the storybook command. (`npm run storybook`)
