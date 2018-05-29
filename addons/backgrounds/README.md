# Storybook Addon Backgrounds

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

---

Storybook Background Addon can be used to change background colors inside the preview in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![React Storybook Screenshot](https://storybook.js.org/img/addon-backgrounds.gif)

## Installation

```sh
npm i -D @storybook/addon-backgrounds
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
import { storiesOf } from '@storybook/react';
import { withBackgrounds } from '@storybook/addon-backgrounds';

storiesOf('Button', module)
  .addDecorator(
    withBackgrounds([
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ])
  )
  .add('with text', () => <button>Click me</button>);
```

You can add the backgrounds to all stories with `addDecorator` in `.storybook/config.js`:

```js
import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { withBackgrounds } from '@storybook/addon-backgrounds';

addDecorator(
  withBackgrounds([
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ])
);
```

If you want to override backgrounds for a single story or group of stories, pass the `backgrounds` parameter:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .addParameters({
    backgrounds: [
      { name: 'red', value: '#F44336' },
      { name: 'blue', value: '#2196F3', default: true },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

If you don't want to use backgrounds for a story, you can set the `backgrounds` parameter to `[]`, or use `{ skip: true }` to skip the addon:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module).add('with text', () => <button>Click me</button>, {
  backgrounds: { skip: true },
});
```
