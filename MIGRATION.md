# Migration

## Table of contents

-   [from version 2.x.x to 3.x.x](#from-version-2xx-to-3xx)
    -   [Webpack upgrade](#webpack-upgrade)
    -   [Packages renaming](#packages-renaming)
    -   [Deprecated embedded addons](#deprecated-embedded-addons)

## from version 2.x.x to 3.x.x

This major release is mainly an internal restructuring.
Upgrading requires work on behalf of users, this was unavoidable.
We're sorry if this inconveniences you, we have tried via this document and provided tools to make the process as easy as possible.

### Webpack upgrade

Storybook will now use webpack 2 (and only webpack 2).
If you are using a custom `webpack.config.js` you need to change this to be compatible.
You can find the guide to upgrading your webpack config [on webpack.js.org](https://webpack.js.org/guides/migrating/).

### Packages renaming

All our packages have been renamed and published to npm as version 3.0.0.

> We have adopted the same versioning strategy as have been adopted by babel, jest and apollo.
> It's a strategy best suited for ecosystem type tools, which consist of many seperately installable features / packages.
> We think this describes storybook pretty well.

The new package names are:

| old                                          | new                              |
| -------------------------------------------- | -------------------------------- |
| `getstorybook`                               | `@storybook/cli`                 |
| `@kadira/getstorybook`                       | `@storybook/cli`                 |
|                                              |                                  |
| `@kadira/storybook`                          | `@storybook/react`               |
| `@kadira/react-storybook`                    | `@storybook/react`               |
| `@kadira/react-native-storybook`             | `@storybook/react-native`        |
|                                              |                                  |
| `storyshots`                                 | `@storybook/addon-storyshots`    |
| `@kadira/storyshots`                         | `@storybook/addon-storyshots`    |
|                                              |                                  |
| `@kadira/storybook-ui`                       | `@storybook/ui`                  |
| `@kadira/storybook-addons`                   | `@storybook/addons`              |
| `@kadira/storybook-channels`                 | `@storybook/channels`            |
| `@kadira/storybook-channel-postmsg`          | `@storybook/channel-postmessage` |
| `@kadira/storybook-channel-websocket`        | `@storybook/channel-websocket`   |
|                                              |                                  |
| `@kadira/storybook-addon-actions`            | `@storybook/addon-actions`       |
| `@kadira/storybook-addon-links`              | `@storybook/addon-links`         |
| `@kadira/storybook-addon-info`               | `@storybook/addon-info`          |
| `@kadira/storybook-addon-knobs`              | `@storybook/addon-knobs`         |
| `@kadira/storybook-addon-comments`           | `@storybook/addon-comments`      |
| `@kadira/storybook-addon-notes`              | `@storybook/addon-notes`         |
| `@kadira/storybook-addon-options`            | `@storybook/addon-options`       |
| `@kadira/storybook-addon-graphql`            | `@storybook/addon-graphql`       |
| `@kadira/react-storybook-decorator-centered` | `@storybook/addon-centered`      |

If your codebase is small, it's probably doable to just replace them by hand. (in your codebase and in `package.json`).

But if you have a lot of occurances in your codebase, you can use a [codemod we created](./lib/codemod) for you.

You have to change your `package.json`, prune old and install new dependencies by hand.

`npm prune` will remove all dependecies from `node_modules` which are no longer referenced in `package.json`.

### Deprecated embedded addons

We used to ship 2 addons with every single installation of storybook: `actions` and `links`. But in practice not everyone is using them, so we decided to deprecate this and in the future they will be completely removed. If you use `@storybook/react/addons` you will get a deprecation warning.

If you **are** using these addons, migrating is simple:

-   add the addons you use to your `package.json`.
-   change your code to this:
    change `addons.js` like so:
    ```js
    import '@storybook/addon-actions/register';
    import '@storybook/addon-links/register';
    ```
    change `x.story.js` like so:
    ```js
    import React from 'react';
    import { storiesOf } from '@storybook/react';
    import { action } from '@storybook/addon-actions';
    import { link } from '@storybook/addon-links';
    ```
