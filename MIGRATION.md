# Migration

- [From version 3.4.x to 4.0.x](#from-version-34x-to-40x)
  - [React 16.3+](#react-163)
  - [Generic addons](#generic-addons)
  - [Knobs select ordering](#knobs-select-ordering)
  - [Knobs URL parameters](#knobs-url-parameters)
  - [Keyboard shortcuts moved](#keyboard-shortcuts-moved)
  - [Removed addWithInfo](#removed-addwithinfo)
  - [Removed RN packager](#removed-rn-packager)
  - [Removed RN addons](#removed-rn-addons)
  - [Storyshots Changes](#storyshots-changes)
  - [Webpack 4](#webpack-4)
  - [Babel 7](#babel-7)
  - [Create-react-app](#create-react-app)
    - [Upgrade CRA1 to babel 7](#upgrade-cra1-to-babel-7)
    - [Migrate CRA1 while keeping babel 6](#migrate-cra1-while-keeping-babel-6)
  - [start-storybook opens browser](#start-storybook-opens-browser)
  - [CLI Rename](#cli-rename)
  - [Addon story parameters](#addon-story-parameters)
- [From version 3.3.x to 3.4.x](#from-version-33x-to-34x)
- [From version 3.2.x to 3.3.x](#from-version-32x-to-33x)
  - [`babel-core` is now a peer dependency (#2494)](#babel-core-is-now-a-peer-dependency-2494)
  - [Base webpack config now contains vital plugins (#1775)](#base-webpack-config-now-contains-vital-plugins-1775)
  - [Refactored Knobs](#refactored-knobs)
- [From version 3.1.x to 3.2.x](#from-version-31x-to-32x)
  - [Moved TypeScript addons definitions](#moved-typescript-addons-definitions)
  - [Updated Addons API](#updated-addons-api)
- [From version 3.0.x to 3.1.x](#from-version-30x-to-31x)
  - [Moved TypeScript definitions](#moved-typescript-definitions)
  - [Deprecated head.html](#deprecated-headhtml)
- [From version 2.x.x to 3.x.x](#from-version-2xx-to-3xx)
  - [Webpack upgrade](#webpack-upgrade)
  - [Packages renaming](#packages-renaming)
  - [Deprecated embedded addons](#deprecated-embedded-addons)

## From version 3.4.x to 4.0.x

With 4.0 as our first major release in over a year, we've collected a lot of cleanup tasks. Most of the deprecations have been marked for months, so we hope that there will be no significant impact on your project.

### React 16.3+

Storybook uses [Emotion](https://emotion.sh/) for styling which currently requires React 16.3 and above.

If you're using Storybook for anything other than React, you probably don't need to worry about this.

However, if you're developing React components, this means you need to upgrade to 16.3 or higher to use Storybook 4.0.

> **NOTE:** This is a temporary requirement, and we plan to restore 15.x compatibility in a near-term 4.x release.

Also, here's the error you'll get if you're running an older version of React:

```
core.browser.esm.js:15 Uncaught TypeError: Object(...) is not a function
    at Module../node_modules/@emotion/core/dist/core.browser.esm.js (core.browser.esm.js:15)
    at __webpack_require__ (bootstrap:724)
    at fn (bootstrap:101)
    at Module../node_modules/@emotion/styled-base/dist/styled-base.browser.esm.js (styled-base.browser.esm.js:1)
    at __webpack_require__ (bootstrap:724)
    at fn (bootstrap:101)
    at Module../node_modules/@emotion/styled/dist/styled.esm.js (styled.esm.js:1)
    at __webpack_require__ (bootstrap:724)
    at fn (bootstrap:101)
    at Object../node_modules/@storybook/components/dist/navigation/MenuLink.js (MenuLink.js:12)
```

### Generic addons

4.x introduces generic addon decorators that are not tied to specific view layers [#3555](https://github.com/storybooks/storybook/pull/3555). So for example:

```js
import { number } from "@storybook/addon-knobs/react";
```

Becomes:

```js
import { number } from "@storybook/addon-knobs";
```

### Knobs select ordering

4.0 also reversed the order of addon-knob's `select` knob keys/values, which had been called `selectV2` prior to this breaking change. See the knobs [package README](https://github.com/storybooks/storybook/blob/master/addons/knobs/README.md#select) for usage.

### Knobs URL parameters

Addon-knobs no longer updates the URL parameters interactively as you edit a knob. This is a UI change but it shouldn't break any code because old URLs are still supported.

In 3.x, editing knobs updated the URL parameters interactively. The implementation had performance and architectural problems. So in 4.0, we changed this to a "copy" button tp the addon which generates a URL with the updated knob values and copies it to the clipboard.

### Keyboard shortcuts moved

- Addon Panel to `Z`
- Stories Panel to `X`
- Show Search to `O`
- Addon Panel right side to `G`

### Removed addWithInfo

`Addon-info`'s `addWithInfo` has been marked deprecated since 3.2. In 4.0 we've removed it completely. See the package [README](https://github.com/storybooks/storybook/blob/master/addons/info/README.md) for the proper usage.

### Removed RN packager

Since storybook version v4.0 packager is removed from storybook. The suggested storybook usage is to include it inside your app.
If you want to keep the old behaviour, you have to start the packager yourself with a different project root.
`npm run storybook start -p 7007 | react-native start --projectRoot storybook`

Removed cli options: `--packager-port --root --projectRoots -r, --reset-cache --skip-packager --haul --platform --metro-config`

### Removed RN addons

The `@storybook/react-native` had built-in addons (`addon-actions` and `addon-links`) that have been marked as deprecated since 3.x. They have been fully removed in 4.x. If your project still uses the built-ins, you'll need to add explicit dependencies on `@storybook/addon-actions` and/or `@storybook/addon-links` and import directly from those packages.

### Storyshots Changes

1.  `imageSnapshot` test function was extracted from `addon-storyshots`
    and moved to a new package - `addon-storyshots-puppeteer` that now will
    be dependant on puppeteer. [README](https://github.com/storybooks/storybook/tree/master/addons/storyshots/storyshots-puppeteer)
2.  `getSnapshotFileName` export was replaced with the `Stories2SnapsConverter`
    class that now can be overridden for a custom implementation of the
    snapshot-name generation. [README](https://github.com/storybooks/storybook/tree/master/addons/storyshots/storyshots-core#stories2snapsconverter)
3.  Storybook that was configured with Webpack's `require.context()` feature
    will need to add a babel plugin to polyfill this functionality.
    A possible plugin might be [babel-plugin-require-context-hook](https://github.com/smrq/babel-plugin-require-context-hook).
    [README](https://github.com/storybooks/storybook/tree/master/addons/storyshots/storyshots-core#configure-jest-to-work-with-webpacks-requirecontext)

### Webpack 4

Storybook now uses webpack 4. If you have a [custom webpack config](https://storybook.js.org/configurations/custom-webpack-config/), make sure that all the loaders and plugins you use support webpack 4.

### Babel 7

Storybook now uses Babel 7. There's a couple of cases when it can break with your app:

- If you aren't using Babel yourself, and don't have .babelrc, install following dependencies:
  ```
  npm i -D @babel/core babel-loader@next
  ```
- If you're using Babel 6, make sure that you have direct dependencies on `babel-core@6` and `babel-loader@7` and that you have a `.babelrc` in your project directory.

### Create-react-app

If you are using `create-react-app` (aka CRA), you may need to do some manual steps to upgrade, depending on the setup.

- `create-react-app@1` may require manual migrations.
  - If you're adding storybook for the first time, it should just work: `sb init` should add the correct dependencies.
  - If you're upgrading an existing project, your `package.json` probably already uses Babel 6, making it incompatible with `@storybook/react@4` which uses Babel 7. There are two ways to make it compatible, each of which is spelled out in detail in the next section:
    - Upgrade to Babel 7 if you are not dependent on Babel 6-specific features.
    - Migrate Babel 6 if you're heavily dependent on some Babel 6-specific features).
- `create-react-app@2` should be compatible as is, since it uses babel 7.

#### Upgrade CRA1 to babel 7

```
yarn remove babel-core babel-runtime
yarn add @babel/core babel-loader --dev
```

#### Migrate CRA1 while keeping babel 6

```
yarn add babel-loader@7
```

Also, make sure you have a `.babelrc` in your project directory. You probably already do if you are using Babel 6 features (otherwise you should consider upgrading to Babel 7 instead). If you don't have one, here's a simple one that works:

```json
{
  "presets": ["env", "react"]
}
```

### start-storybook opens browser

If you're using `start-storybook` on CI, you may need to opt out of this using the new `--ci` flag.

### CLI Rename

We've deprecated the `getstorybook` CLI in 4.0. The new way to install storybook is `sb init`. We recommend using `npx` for convenience and to make sure you're always using the latest version of the CLI:

```
npx -p @storybook/cli sb init
```

### Addon story parameters

Storybook 4 introduces story parameters, a more convenient way to configure how addons are configured.

```js
storiesOf('My component', module)
  .add('story1', withNotes('some notes')(() => <Component ... />))
  .add('story2', withNotes('other notes')(() => <Component ... />));
```

Becomes:

```js
// config.js
addDecorator(withNotes);

// Component.stories.js
storiesOf('My component', module)
  .add('story1', () => <Component ... />, { notes: 'some notes' })
  .add('story2', () => <Component ... />, { notes: 'other notes' });
```

This example applies notes globally to all stories. You can apply it locally with `storiesOf(...).addDecorator(withNotes)`.

The story parameters correspond directly to the old withX arguments, so it's easy to migrate your code. See the parameters documentation for the packages that have been upgraded:

- [Notes](https://github.com/storybooks/storybook/blob/master/addons/notes/README.md)
- [Jest](https://github.com/storybooks/storybook/blob/master/addons/jest/README.md)
- [Knobs](https://github.com/storybooks/storybook/blob/master/addons/knobs/README.md)
- [Viewport](https://github.com/storybooks/storybook/blob/master/addons/viewport/README.md)
- [Backgrounds](https://github.com/storybooks/storybook/blob/master/addons/backgrounds/README.md)
- [Options](https://github.com/storybooks/storybook/blob/master/addons/options/README.md)

## From version 3.3.x to 3.4.x

There are no expected breaking changes in the 3.4.x release, but 3.4 contains a major refactor to make it easier to support new frameworks, and we will document any breaking changes here if they arise.

## From version 3.2.x to 3.3.x

It wasn't expected that there would be any breaking changes in this release, but unfortunately it turned out that there are some. We're revisiting our [release strategy](https://github.com/storybooks/storybook/blob/master/RELEASES.md) to follow semver more strictly.
Also read on if you're using `addon-knobs`: we advise an update to your code for efficiency's sake.

### `babel-core` is now a peer dependency ([#2494](https://github.com/storybooks/storybook/pull/2494))

This affects you if you don't use babel in your project. You may need to add `babel-core` as dev dependency:

```
npm install --save-dev babel-core
```

This was done to support different major versions of babel.

### Base webpack config now contains vital plugins ([#1775](https://github.com/storybooks/storybook/pull/1775))

This affects you if you use custom webpack config in [Full Control Mode](https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode) while not preserving the plugins from `storybookBaseConfig`. Before `3.3`, preserving them was just a recommendation, but now it [became](https://github.com/storybooks/storybook/pull/2578) a requirement.

### Refactored Knobs

Knobs users: there was a bug in 3.2.x where using the knobs addon imported all framework runtimes (e.g. React and Vue). To fix the problem, we [refactored knobs](https://github.com/storybooks/storybook/pull/1832). Switching to the new style is easy:

In the case of React or React-Native, import knobs like this:

```js
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs/react";
```

In the case of Vue: `import { ... } from '@storybook/addon-knobs/vue';`

In the case of Angular: `import { ... } from '@storybook/addon-knobs/angular';`

## From version 3.1.x to 3.2.x

**NOTE:** technically this is a breaking change, but only if you use TypeScript. Sorry people!

### Moved TypeScript addons definitions

TypeScript users: we've moved the rest of our addons type definitions into [DefinitelyTyped](http://definitelytyped.org/). Starting in 3.2.0 make sure to use the right addons types:

```sh
npm install @types/storybook__addon-notes @types/storybook__addon-options @types/storybook__addon-knobs @types/storybook__addon-links --save-dev
```

See also [TypeScript definitions in 3.1.x](#moved-typescript-definitions).

### Updated Addons API

We're in the process of upgrading our addons APIs. As a first step, we've upgraded the Info and Notes addons. The old API will still work with your existing projects but will be deprecated soon and removed in Storybook 4.0.

Here's an example of using Notes and Info in 3.2 with the new API.

```js
storiesOf("composition", module).add(
  "new addons api",
  withInfo("see Notes panel for composition info")(
    withNotes({ text: "Composition: Info(Notes())" })(context => (
      <MyComponent name={context.story} />
    ))
  )
);
```

It's not beautiful, but we'll be adding a more convenient/idiomatic way of using these [withX primitives](https://gist.github.com/shilman/792dc25550daa9c2bf37238f4ef7a398) in Storybook 3.3.

## From version 3.0.x to 3.1.x

**NOTE:** technically this is a breaking change and should be a 4.0.0 release according to semver. However, we're still figuring things out and didn't think this change necessitated a major release. Please bear with us!

### Moved TypeScript definitions

TypeScript users: we are in the process of moving our typescript definitions into [DefinitelyTyped](http://definitelytyped.org/). If you're using TypeScript, starting in 3.1.0 you need to make sure your type definitions are installed:

```sh
npm install @types/node @types/react @types/storybook__react --save-dev
```

### Deprecated head.html

We have deprecated the use of `head.html` for including scripts/styles/etc. into stories, though it will still work with a warning.

Now we use:

- `preview-head.html` for including extra content into the preview pane.
- `manager-head.html` for including extra content into the manager window.

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
npx -p @storybook/cli sb init
```

**Details**

If the above doesn't work, or you want to make the changes manually, the details are below:

> We have adopted the same versioning strategy that has been adopted by babel, jest and apollo.
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

We used to ship 2 addons with every single installation of storybook: `actions` and `links`. But in practice not everyone is using them, so we decided to deprecate this and in the future, they will be completely removed. If you use `@storybook/react/addons` you will get a deprecation warning.

If you **are** using these addons, migrating is simple:

- add the addons you use to your `package.json`.
- update your code:
  change `addons.js` like so:
  ```js
  import "@storybook/addon-actions/register";
  import "@storybook/addon-links/register";
  ```
  change `x.story.js` like so:
  ```js
  import React from "react";
  import { storiesOf } from "@storybook/react";
  import { action } from "@storybook/addon-actions";
  import { linkTo } from "@storybook/addon-links";
  ```
