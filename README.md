# React Storybook Centered Decorator

React Storybook decorator to center components.

### Usage

```sh
npm i @kadira/react-storybook-decorator-centered
```

Then add the decorator like this:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MyComponent from '../my_component';
import centered from '@kadira/react-storybook-decorator-centered';

storiesOf('MyComponent', module)
  .addDecorator(centered);
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

You can also add this decorator globally like this:

```js
import { configure, addDecorator } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

addDecorator(centered);

configure(function () {
  ...
}, module);
```
