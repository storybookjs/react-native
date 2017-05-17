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
npm install @storybook/codemod
```

## Transforms

### add-organisation-to-package-name

Updates package names in imports to include our organisation name prefix
(`@storybook/`), stripping off the old `@storybook/` prefix.

```js
> jscodeshift -t add-organisation-to-package-name path/to/source.js
```

Example:

```js
import { storiesOf } from '@kadira/storybook';
```

becomes

```js
import { storiesOf } from '@storybook/react';
```
