# How Storybook Works

In this guide, we'll discuss how Storybook works internally. This document is useful if you are looking to add more features to storybook or trying to hack it. If you just looking to use Storybook, you don't need to familiar with this document.

## TOC

* [Major Components](#major-components)
* [API](#api)
* [Manager - Preview Communication](#manager-preview-communication)
* [Keyboard Shortcuts](#keyboard-shortcuts)
* [Routing](#routing)

## Major Components

Storybook mainly comes with few different components. Here are they:

1. Storybook Manager UI - That's the UI of the storybook where you interact with.
2. Storybook Preview - This is the iframe your components are rendered.
3. Webpack Dev Server - Storybook runs a Webpack Dev Server with [HMR](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) support. (usually, you invoke this with `npm run storybook`.)
4. Static Builder - Build the storybook into a set of static files. (usually, you invoke this with `npm run build-storybook`.)

Let's have a look at each of these component with more information.

### 1. Storybook Manager UI

This is the management UI for Storybook where you interact with your stories and see your actions. It also loads the Storybook Preview window.

This is written with React according to the [Mantra](https://github.com/kadirahq/mantra/) specification. It also use Redux as the local state. Source code for Manager lives under `src/client/manager`.

It has following [mantra modules](https://kadirahq.github.io/mantra/#sec-Mantra-Modules):

* api - api module, which handles different functionalities of Storybook.
* shortcuts - handles keyboards shortcuts
* preview - handles rendering the preview and communicate with it.
* ui - renders the UI, routing and initializing keyboard shortcuts and so on.

We publish this manager UI as a single JavaScript file to the NPM and it doesn't depend on enduser's locally installed NPM modules. When we run `npm run prepublish` it'll build the manager UI and saved it into `dist/manager.js`.

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

## API

This is the core set of features of the Storybook. It's expose as a Mantra module with the Redux reducer. This exposes a set of few functionalities to interact with the manager. That includes both the user and the Storybook Preview.

Here are those actions:

* setStories(stories)
* selectStory(kind, story)
* addAction(action)
* clearActions()

For more information about the API, have a look at : `src/client/manager/modules/api/actions`.

States of these actions can be access using the `api` field in the reduxStore. It's managed using the `api` reducer in the API module. You can refer it for more information: `src/client/manager/modules/api/configs/reducers`.

## Manager - Preview Communication

Manager and Preview communication done using the `preview` module in the manager. It simply loads the iframe create a communication layer with the Storybook Preview using the page-bus module.

Then, it listen to the events receives from the Storybook Preview and call relevant actions in the `api` module.
It also watch for the changes in the `api` field in the reduxStore and emit events to the Storybook Preview.


## Keyboard Shortcuts

Keyboard Shortcuts are also implemented as a separate module called `shortcuts`. But, it only manages the reduxStore only.

Keyboard events are defined in `src/clibs/key_events.js` module. That's because it'll be used in the Manager UI and in the Storybook Preview. We need to track these events in the iframe and send them to the manager to implement the actions.

So, `ui` and `preview` modules in the Manager UI call actions in the `shortcuts` module when there's a Keyboard event.

Then `ui` module watches reduxStore for those changes apply the shortcut functionality. Refer `src/managers/modules/ui/containers/layout.js` for some examples.

## Routing

For the app, we don't have a routing system. `ui` module's [Mantra routing hook](https://kadirahq.github.io/mantra/#sec-Routing-Component-Mounting) simply loads the Manager UI to the DOM.

But, we also update the URL for the selected story. That's handles by a config located at `src/client/manager/modules/ui/configs/handle_routing.js`

## Development Setup

When you are developing the Storybook follow these steps.

* Run the development watcher with `npm run dev` inside the local repo.
* Link the local repo with `npm link`
* Then pick a [sample app](https://github.com/kadira-samples/react-storybook-demo) and link storybook into that with `npm link @kadira/storybook`.
* Then run the storybook with `DEV_BUILD=1 npm run storybook`.
* `DEV_BUILD` apply some dev time speed optimizations when developing the manager ui.
* Now change code as necessary and see changes.
* To reflect changes in the Manager UI, you need to reload the Storybook browser window.
* To reflect any changes done in the server code, you need to re-run the storybook command. (`DEV_BUILD=1 npm run storybook`)
