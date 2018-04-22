# Storybook Addon Actions

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Addon Actions can be used to display data received by event handlers in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](docs/screenshot.png)

## Getting Started

Install:

```sh
npm i -D @storybook/addon-actions
```

Then, add following content to `.storybook/addons.js`

```js
import '@storybook/addon-actions/register';
```

Import the `action` function and use it to create actions handlers. When creating action handlers, provide a **name** to make it easier to identify.

> _Note: Make sure NOT to use reserved words as function names. [issues#29](https://github.com/storybooks/storybook-addon-actions/issues/29#issuecomment-288274794)_

```js
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';

import Button from './button';

action('button-click')

storiesOf('Button', module)
  .add('default view', () => (
    <Button onClick={ action('button-click') }>
      Hello World!
    </Button>
  ))
```

## Action Decorators

If you wish to process action data before sending them over to the logger, you can do it with action decorators.

`decorateAction` takes an array of decorator functions. Each decorator function is passed an array of arguments, and should return a new arguments array to use. `decorateAction` returns a function that can be used like `action` but will log the modified arguments instead of the original arguments.

```js
import { decorateAction } from '@storybook/addon-actions';

import Button from './button';

const firstArgAction = decorateAction([
  args => args.slice(0, 1)
]);

storiesOf('Button', module)
  .add('default view', () => (
    <Button onClick={ firstArgAction('button-click') }>
      Hello World!
    </Button>
  ))
```

## Configuration

Arguments which are passed to the action call will have to be serialized while be "transfered"
over the channel.

This is not very optimal and can cause lag when large objects are being logged, for this reason it is possible 
to configure a maximum depth.

To apply the configuration globally use the `configureActions` function in your `config.js` file.

```js
import { configureActions } from '@storybook/addon-actions';

configureActions({
  depth: 100
})
```

To apply the configuration per action use:
```js
action('my-action', {
  depth: 5 
})
```

### Available Options

|Name|Type|Description|Default|
|---|---|---|---|
|`depth`|Number|Configures the transfered depth of any logged objects.|`10`|
