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

Install:

```sh
npm i -D @storybook/addon-actions
```

Then, add following content to `.storybook/addons.js`

```js
import '@storybook/addon-actions/register';
```

## LinkTo component

To add a link from one story to another, just import `LinkTo` component and use it:

```js
import { storiesOf } from '@storybook/react';
import { LinkTo } from '@storybook/addon-links';

storiesOf('Link', module)
  .add('First', () => (
    <LinkTo story="Second">Go to Second</LinkTo>
  ))
  .add('Second', () => (
    <LinkTo story="First">Go to First</LinkTo>
  ));
```

It uses native `a` element, but prevents page reloads on plain left click. You can still use default browser methods to open link in new tab.
It accepts all the props the `a` element does, plus to special props, both optional:

-   `kind` is the the story kind name (what you named with `storiesOf`). If it is omitted, the current kind will be preserved.
-   `story` is the story name (what you named with `.add`). If it is omitted, the link will point to the first story in the given kind.

```js
<LinkTo
  kind="Toggle"
  story="off"
  target="_blank"
  title="link to second story"
  style={{color: '#1474f3'}}
>Go to Second</LinkTo>
```

## linkTo callback function

If you want to use something other then `a` element, you may import `linkTo` function instead:

```js
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

storiesOf('Button', module)
  .add('First', () => (
    <button onClick={linkTo('Button', 'Second')}>Go to Second</button>
  ))
  .add('Second', () => (
    <button onClick={linkTo('Button', 'First')}>Go to First</button>
  ));
```

You can also pass a function instead for any of above parameter. That function accepts arguments emitted by the event and it should return a string:

```js
import { storiesOf } from '@storybook/react';
import { LinkTo, linkTo } from '@storybook/addon-links';

storiesOf('Select', module)
  .add('Index', () => (
    <select value="Index" onChange={linkTo('Select', e => e.currentTarget.value)}>
      <option>Index</option>
      <option>First</option>
      <option>Second</option>
      <option>Third</option>
    </select>
  ))
  .add('First', () =>  <LinkTo story="Index">Go back</LinkTo>)
  .add('Second', () => <LinkTo story="Index">Go back</LinkTo>)
  .add('Third', () => <LinkTo story="Index">Go back</LinkTo>);
```

## hrefTo function

If you just want to get an URL for a particular story, you may use `hrefTo` function. It returns a promise, which resolves to string containing a relative URL:

```js
import { storiesOf } from '@storybook/react';
import { hrefTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';

storiesOf('Href', module)
  .add('log', () => {
    hrefTo('Href', 'log').then(action('URL of this story'));

    return <span>See action logger</span>;
  });
```
