# Story Links Addon

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

The Storybook Links addon can be used to create links between stories in [Storybook](https://storybook.js.org).

This addon works with Storybook for:
[React](https://github.com/storybooks/storybook/tree/master/app/react) and
[React Native](https://github.com/storybooks/storybook/tree/master/app/react-native).

## Getting Started

You can use this addon without installing it.

```js
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

storiesOf('Button', module)
  .add('First', () => (
    <button onClick={linkTo('Button', 'Second')}>Go to "Second"</button>
  ))
  .add('Second', () => (
    <button onClick={linkTo('Button', 'First')}>Go to "First"</button>
  ));
```

Have a look at the linkTo function:

```js
import { linkTo } from '@storybook/addon-links'

linkTo('Toggle', 'off')
```

With that, you can link an event in a component to any story in the Storybook.

-   First parameter is the the story kind name (what you named with `storiesOf`).
-   Second parameter is the story name (what you named with `.add`).

> You can also pass a function instead for any of above parameter. That function accepts arguments emitted by the event and it should return a string. <br/>
> Have a look at [PR86](https://github.com/kadirahq/react-storybook/pull/86) for more information.
