# Storybook Codemods

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook Codemods is a collection of codemod scripts written with JSCodeshift.
It will help you migrate breaking changes.

## Installation

```sh
npm install jscodeshift
npm install @storybook/codemod
```

-   `@storybook/codemod` is out collection of codemod scripts.
-   `jscodeshift` is a tool we use to apply our codemods.

After running the migration commands, you can remove them from your `package.json`, if you added them.

## How to run a codemod script

From the directory where you installed both `jscodeshift` and `@storybook/codemod` run:

Example:

```sh
./node_modules/.bin/jscodeshift -t ../react-storybook/lib/codemod/dist/update-organisation-name.js . --ignore-pattern "node_modules|dist"
```

Explanation:

    <jscodeShiftCommand> -t <transformFileLocation> <pathToSource> --ignore-pattern "<globPatternToIgnore>"

## Transforms

### add-organisation-to-package-name

Updates package names in imports to migrate to the new package names of storybook.

```sh
./node_modules/.bin/jscodeshift -t ../react-storybook/lib/codemod/dist/update-organisation-name.js . --ignore-pattern "node_modules|dist"
```

There's a mapping of paths we replace but this example explains the gist of it:

Example:

```js
import { storiesOf } from '@kadira/storybook';
import { storiesOf } from '@kadira/storybook-addon-links';
```

Becomes

```js
import { storiesOf } from '@storybook/react';
import { storiesOf } from '@storybook/addon-links';
```
