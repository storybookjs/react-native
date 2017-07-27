# Storybook Addon Notes

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook Addon Notes allows you to write notes for your stories in [Storybook](https://storybook.js.org).

This addon works with Storybook for:
[React](https://github.com/storybooks/storybook/tree/master/app/react).

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started

```sh
npm i --save-dev @storybook/addon-notes
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-notes/register';
```

Then write your stories like this:

```js
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import Component from './Component';

storiesOf('Component', module)
  .add('with some emoji', withNotes({ notes: 'A very simple component'})(() => <Component></Component>));
```
