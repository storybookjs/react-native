# Migration

## Table of contents

-   [From version 3.2.x to 3.3.x](#from-version-32x-to-33x)
    -   [Refactored Knobs](#refactored-knobs)
    -   [Storyshots Jest configuration](#storyshots-jest-configuration)
-   [From version 3.1.x to 3.2.x](#from-version-31x-to-32x)
    -   [Moved TypeScript addons definitions](#moved-typescript-addons-definitions)
    -   [Updated Addons API](#updated-addons-api)
-   [From version 3.0.x to 3.1.x](#from-version-30x-to-31x)
    -   [Moved TypeScript definitions](#moved-typescript-definitions)
    -   [Deprecated head.html](#deprecated-headhtml)
-   [From version 2.x.x to 3.x.x](#from-version-2xx-to-3xx)
    -   [Webpack upgrade](#webpack-upgrade)
    -   [Packages renaming](#packages-renaming)
    -   [Deprecated embedded addons](#deprecated-embedded-addons)

## From version 3.2.x to 3.3.x

There should be no breaking changes in this release, but read on if you're using `addon-knobs`: we advise an update to your code for efficiency's sake.

### Refactored Knobs

Knobs users: there was a bug in 3.2.x where using the knobs addon imported all framework runtimes (e.g. React and Vue). To fix the problem, we [refactored knobs](https://github.com/storybooks/storybook/pull/1832). Switching to the new style is easy:

In the case of React or React-Native, import knobs like this:

```js
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
```

In the case of Vue: `import { ... } from '@storybook/addon-knobs/vue';`

In the case of Angular: `import { ... } from '@storybook/addon-knobs/angular';`

### Storyshots Jest configuration

Storyshots users will need to add a line to their `jest.config.js`:

```js
  transformIgnorePatterns: ['/node_modules/(?!lodash-es/.*)'],
```

We are working to resolve the issue that requires this: https://github.com/storybooks/storybook/issues/2570

## From version 3.1.x to 3.2.x

**NOTE:** technically this is a breaking change, but only if you use TypeScript. Sorry people!

### Moved TypeScript addons definitions

TypeScript users: we've moved the rest of our addons type definitions into [DefinitelyTyped](http://definitelytyped.org/). Starting in 3.2.0 make sure to use the right addons types:

```sh
npm install @types/storybook__addon-notes @types/storybook__addon-options @types/storybook__addon-knobs @types/storybook__addon-links --save-dev
```

See also [TypeScript definitions in 3.1.x](#moved-typescript-definitions).

### Updated Addons API

We're in the process of upgrading our addons APIs. As a first step, we've upgraded the Info and Notes addons. The old API will still work with your existing projects, but will be deprecated soon and removed in Storybook 4.0.

Here's an example of using Notes and Info in 3.2 with the new API.

```js
storiesOf('composition', module)
  .add('new addons api',
    withInfo('see Notes panel for composition info')(
      withNotes({ text: 'Composition: Info(Notes())' })(context =>
        <MyComponent name={context.story} />
      )
    )
  );
```

It's not beautiful, but we'll be adding a more convenient/idiomatic way of using these [withX primitives](https://gist.github.com/shilman/792dc25550daa9c2bf37238f4ef7a398) in Storybook 3.3.

## From version 3.0.x to 3.1.x

**NOTE:** technically this is a breaking change and should be a 4.0.0 release according to semver. However, we're still figuring things out, and didn't think this change necessitated a major release. Please bear with us!

### Moved TypeScript definitions

TypeScript users: we are in the process of moving our typescript definitions into [DefinitelyTyped](http://definitelytyped.org/). If you're using TypeScript, starting in 3.1.0 you need to make sure your type definitions are installed:

```sh
npm install @types/node @types/react @types/storybook__react --save-dev
```

### Deprecated head.html

We have deprecated the use of `head.html` for including scripts/styles/etc. into stories, though it will still work with a warning.

Now we use:

-   `preview-head.html` for including extra content into the preview pane.
-   `manager-head.html` for including extra content into the manager window.

[Read our docs](https://storybook.js.org/configurations/add-custom-head-tags/) for more details.

## From version 2.x.x to 3.x.x

This major release is mainly an internal restructuring.
Upgrading requires work on behalf of users, this was unavoidable.
We're sorry if this inconveniences you, we have tried via this document and provided tools to make the process as easy as possible.

### Webpack upgrade

Storybook will now use webpack 2 (and only webpack 2).
If you are using a custom `webpack.config.js` you need to change this to be compatible.
You can find the guide to upgrading your webpack config [on webpack.js.org](https://webpack.js.org/guides/migrating/).

### Packages renaming

All our packages have been renamed and published to npm as version 3.0.0 under the `@storybook` namespace.

To update your app to use the new package names, you can use the cli:

```bash
npm install --global @storybook/cli

# if you run this inside a v2 app, it should perform the necessary codemods.
getstorybook
```

#### Details

If the above doesn't work, or you want to make the changes manually, the details are below:

> We have adopted the same versioning strategy as have been adopted by babel, jest and apollo.
> It's a strategy best suited for ecosystem type tools, which consist of many separately installable features / packages.
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
| `@kadira/storybook-addon-notes`              | `@storybook/addon-notes`         |
| `@kadira/storybook-addon-options`            | `@storybook/addon-options`       |
| `@kadira/storybook-addon-graphql`            | `@storybook/addon-graphql`       |
| `@kadira/react-storybook-decorator-centered` | `@storybook/addon-centered`      |

If your codebase is small, it's probably doable to just replace them by hand. (in your codebase and in `package.json`).

But if you have a lot of occurrences in your codebase, you can use a [codemod we created](./lib/codemod) for you.

> A codemod makes automatic changed to your app's code.

You have to change your `package.json`, prune old and install new dependencies by hand.

`npm prune` will remove all dependencies from `node_modules` which are no longer referenced in `package.json`.

### Deprecated embedded addons

We used to ship 2 addons with every single installation of storybook: `actions` and `links`. But in practice not everyone is using them, so we decided to deprecate this and in the future they will be completely removed. If you use `@storybook/react/addons` you will get a deprecation warning.

If you **are** using these addons, migrating is simple:

-   add the addons you use to your `package.json`.
-   update your code:
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
    import { linkTo } from '@storybook/addon-links';
    ```
