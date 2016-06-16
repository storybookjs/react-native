# Storybook UI

This is the core UI of [react-storybook](https://github.com/kadirahq/react-storybook) and other similar projects. It's a React based UI where you can initialize with a simple function. You can configure it by providing a simple provider API.

![Storybook UI Demo](./docs/storybook-ui-demo.png)

## Usage

First you need to install `@kadira/storybook-ui` into your app.

```sh
npm i --save @kadira/storybook-ui
```


Then you need to create a Provider class like this:

```js
// provider.js
import { Provider } from '@kadira/storybook-ui';
import React from 'react';

export default class MyProvider extends Provider {
  renderPreview() {
    return (
      <p>This is the Preview</p>
    );
  }

  handleAPI(api) {
    // no need to do anything for now.
  }
}
```

Then you need to initialize the UI like this:

```js
import Provider from './provider';
import renderStorybookUI from '@kadira/storybook-ui';

const roolEl = document.getElementById('root');
renderStorybookUI(roolEl, new Provider());
```

Then you'll get a UI like this:

![Simplest Storybook UI](./docs/simple-ui.png)

> **See the [example](/example) app for a complete example.**
