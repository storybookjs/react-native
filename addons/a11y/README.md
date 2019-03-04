# storybook-addon-a11y

This storybook addon can be helpful to make your UI components more accessible.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![](docs/screenshot.png)

## Getting started

First, install the addon.

```sh
$ yarn add @storybook/addon-a11y --dev
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@storybook/addon-a11y/register';
```

import the `withA11y` decorator to check your stories for violations within your components.

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

// should only be added once
// best place is in config.js
addDecorator(withA11y)

storiesOf('button', module)
  .add('Accessible', () => (
    <button>
      Accessible button
    </button>
  ))
  .add('Inaccessible', () => (
    <button style={{ backgroundColor: 'red', color: 'darkRed', }}>
      Inaccessible button
    </button>
  ));
```

For more customizability. Use the `addParameters` function to configure [aXe options](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure).
You can override these options at story level too.

```js
import React from 'react';
import { storiesOf, addDecorator, addParameters } from '@storybook/react';

import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y)
addParameters({
  a11y: {
    // ... axe options
    element: '#root', // optional selector which element to inspect
    config: {} // axe-core configurationOptions (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1)
    options: {} // axe-core optionsParameter (https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter)
  },
});

storiesOf('button', module)
  .add('Accessible', () => (
    <button style={{ backgroundColor: 'black', color: 'white', }}>
      Accessible button
    </button>
  ))
  .add('Inaccessible', () => (
    <button style={{ backgroundColor: 'black', color: 'black', }}>
      Inaccessible button
    </button>
  ));
```

## Roadmap

* Make UI accessibile
* Show in story where violations are.
* Add more example tests
* Add tests
* Make CI integration possible
