# Storybook Addon Backgrounds

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Centered Decorator can be used to center components inside the preview in [Storybook](https://storybook.js.org).

This addon works with Storybook for:

-   [React](https://github.com/storybooks/storybook/tree/master/app/react)

![React Storybook Screenshot](https://storybook.js.org/img/addon-backgrounds.gif)

## Installation

```sh
npm i --save @storybook/addon-backgrounds
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-backgrounds/register';
```

## Usage

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from "@storybook/react";
import backgrounds from "@storybook/addon-backgrounds";

storiesOf("Button", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced", default: true },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("with text", () => <button>Click me</button>);
```

Of course it's easy to create a library module so you can re-use:

```js
import addonBackgrounds from "@storybook/addon-backgrounds";

export const backgrounds = addonBackgrounds([
  { name: "twitter", value: "#00aced", default: true },
  { name: "facebook", value: "#3b5998" },
]);
```

```js
import React from 'react';
import { storiesOf } from "@storybook/react";

import { backgrounds } from "./my-lib";

storiesOf("Button", module)
  .addDecorator(backgrounds)
  .add("with text", () => <button>Click me</button>);
```
