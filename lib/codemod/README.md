# Storybook Codemods

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-nqnzoygycp.now.sh/badge.svg)](https://now-examples-slackin-nqnzoygycp.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Codemods is a collection of codemod scripts written with JSCodeshift.
It will help you migrate breaking changes & deprecations.

## Installation

```sh
npm install jscodeshift
npm install @storybook/codemod
```

-   `@storybook/codemod` is our collection of codemod scripts.
-   `jscodeshift` is a tool we use to apply our codemods.

After running the migration commands, you can remove them from your `package.json`, if you added them.

## How to run a codemod script

From the directory where you installed both `jscodeshift` and `@storybook/codemod` run:

Example:

```sh
./node_modules/.bin/jscodeshift -t ./node_modules/@storybook/codemod/dist/transforms/update-organisation-name.js . --ignore-pattern "node_modules|dist"
```

Explanation:

    <jscodeShiftCommand> -t <transformFileLocation> <pathToSource> --ignore-pattern "<globPatternToIgnore>"

## Transforms

### update-organisation-name

Updates package names in imports to migrate to the new package names of storybook.

```sh
./node_modules/.bin/jscodeshift -t ./node_modules/@storybook/codemod/dist/transforms/update-organisation-name.js . --ignore-pattern "node_modules|dist"
```

There's a mapping of paths we replace but this example explains the gist of it:

Example:

```js
import { storiesOf } from '@kadira/storybook';
import { linkTo } from '@kadira/storybook-addon-links';
```

Becomes

```js
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
```

### update-addon-info

Replaces the Info addon's deprecated `addWithInfo` API with the standard `withInfo` API.

```sh
./node_modules/.bin/jscodeshift -t ./node_modules/@storybook/codemod/dist/transforms/update-addon-info.js . --ignore-pattern "node_modules|dist"
```

Simple example:

```js
storiesOf('Button').addWithInfo(
  'simple usage',
  'This is the basic usage of the button.',
  () => (
    <Button label="The Button" />
  )
)
```

Becomes

```js
storiesOf('Button').add('simple usage', withInfo(
  'This is the basic usage of the button.'
)(() => (
  <Button label="The Button" />
)))
```

With options example:

```js
storiesOf('Button').addWithInfo(
  'simple usage (disable source)',
  'This is the basic usage of the button.',
  () => (
    <Button label="The Button" />
  ),
  { source: false, inline: true }
)
```

Becomes

```js
storiesOf('Button').add('simple usage (disable source)', withInfo({
  text: 'This is the basic usage of the button.',
  source: false,
  inline: true
})(() => (
  <Button label="The Button" />
)))
```
