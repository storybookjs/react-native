# Contributing to React Storybook

We welcome you help to make React Storybook better. This document will help to streamline the contributing process and save everyone's precious time.

## Issues

No software is bug free. So, if you got an issue, follow these steps:

* Check the [Known Issues](https://github.com/kadirahq/react-storybook/blob/master/docs/known_issues.md) list.
* Search the [issue list](https://github.com/kadirahq/react-storybook/issues?utf8=%E2%9C%93&q=) for current and old issues.
* If non of that is helping, create an issue with with following information:
  * Clear title (make is shorter if possible).
  * Describe the issue in clear language.
  * Share error logs, screenshots and etc.
  * To speed up the issue fixing process, send us a sample repo with the issue you faced.

## Pull Requests (PRs)

We welcome your contributions. There are many ways you can help us. This is few of those ways:

* Fix typos and add more documentation.
* Try to fix some [bugs](https://github.com/kadirahq/react-storybook/labels/bug).
* Work on [enhancements](https://github.com/kadirahq/react-storybook/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) and new [features](https://github.com/kadirahq/react-storybook/issues?q=is%3Aissue+is%3Aopen+label%3Afeature).
* Add more tests (specially for the UI).

Before you sending a new PR, make you to run `npm test`. Do not send a PR if tests are failing. If you need any help, create an issue and ask.

## Development Guide

This is a simple guide shows you how to work with React Storybook development.

Source code is located at the `src` directory and they are written 2015+ syntax. Tests are lives very close to source files. (See `client/__tests__` directory).

Before publishing to npm we convert these ES2015 scripts into ES5. We do this using the `prepublish` NPM script. You can invoke that manually with `npm run prepublish.`

### Development Setup

Usually, we need to work with a sample app when building features or fixing bugs. For that use [this TODOMVC app](https://github.com/kadira-samples/react-storybook-demo) or this [very simple demo](https://github.com/kadira-samples/react-storybook-simple-demo).

Then follow these steps:

* Visit to the React Storybook repo(local directory) and NPM link it. Apply this command: `npm link`.
* After that, visit to the sample app and run `npm link @kadira/storybook` to use the linked storybook module.
* Now run `npm run storybook` on the sample app

Now your sample app uses the local version of React Storybook.

After every code change, you need to run `npm run prepublish` in the storybook repo. That's hard and boring. So you can run `npm run dev` instead. It watches source files and prepublish it.

### Client Changes

After you've done any client changes, you may need to reload the React Storybook web app manually. So, reload the web app to see changes.

### Server Changes

After you've done any server changes, you may need to re-run `npm run storybook` command again in the sample app.
