# Storybook Centered Decorator

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook Centered Decorator can be used to center components inside the preview in [Storybook](https://storybook.js.org).

This addon works with Storybook for:

-   [React](https://github.com/storybooks/storybook/tree/master/app/react)
-   [Vue](https://github.com/storybooks/storybook/tree/master/app/vue)

### Usage

```sh
npm install @storybook/addon-centered --save-dev
```

#### As a decorator

You can set the decorator locally.

exampwle for React:

```js
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';

import MyComponent from '../Component';

storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

example for Vue:

```js
import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered';

import MyComponent from '../Component.vue';
storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => ({
    components: { MyComponent },
    template: '<my-component />'
  })
  .add('with some props', () => ({
    components: { MyComponent },
    template: '<my-component text="The Comp"/>'
  });
```

Also, you can also add this decorator globally

example for React:

```js
import { configure, addDecorator } from '@storybook/react';
import centered from '@storybook/addon-centered';

addDecorator(centered);

configure(function () {
  //...
}, module);
```

example for Vue:

```js
import { configure, addDecorator } from '@storybook/vue';
import centered from '@storybook/addon-centered';

addDecorator(centered);

configure(function () {
  //...
}, module);
```

#### As an extension

1 - Configure the extension

```js
import { configure, setAddon } from '@storybook/react';
import centered from '@storybook/addon-centered';

setAddon({
  addCentered(storyName, storyFn) {
    this.add(storyName, (context) => (
      centered.call(context, storyFn)
    ));
  },
});

configure(function () {
  //...
}, module);
```

2 - Use it in your story

```js
import { storiesOf } from '@storybook/react';

import Component from '../Component';

storiesOf('Component', module)
  .addCentered('without props', () => (<Component />))
```
