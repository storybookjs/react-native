# React Storybook Centered Decorator

React Storybook decorator to center components.

### Usage

```sh
npm i @kadira/react-storybook-decorator-centered
```

#### As a decorator
You can set the decorator locally:

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MyComponent from '../my_component';
import centered from '@kadira/react-storybook-decorator-centered';

storiesOf('MyComponent', module)
  .addDecorator(centered)
  .add('without props', () => (<MyComponent />))
  .add('with some props', () => (<MyComponent text="The Comp"/>));
```

Or you can also add this decorator globally:

```js
import { configure, addDecorator } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

addDecorator(centered);

configure(function () {
  ...
}, module);
```

#### As an extension
1 - Configure the extension

```js
import React from 'react';
import { configure, setAddon } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

setAddon({
  addCentered(storyName, storyFn) {
    this.add(storyName, (context) => (
      centered.call(context, storyFn)
    ));
  }
});

configure(function () {
  ...
}, module);
```

2 - Use it in your story

```js
import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MyComponent from '../my_component';

storiesOf('MyComponent', module)
  .addCentered('without props', () => (<MyComponent />))
```
