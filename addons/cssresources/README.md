# Storybook Addon Cssresources

Storybook Addon Cssresources to switch between css resources at runtime for your story [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Cssresources Demo](docs/demo.gif)

### Getting Started
**NOTE: Documentation on master branch is for alpha version, stable release is on [release/3.4](https://github.com/storybooks/storybook/tree/release/3.4/addons/)**

```sh
yarn add -D @storybook/addon-cssresources
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-cssresources/register';
```

You need add the all the css resources at compile time using the `withCssresources` decorator. You can then choose which ones to load from the cssresources addon ui:

```js
// Import from @storybook/X where X is your framework
import { configure, addDecorator } from '@storybook/react';
import { withCssresources } from '@storybook/addon-cssresources';

addDecorator(
  withCssresources({
    cssresources: [
      { name: `bootstrap`, code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"></link>`, picked: true },
      { name: `mycss`, code: `body { background: yellow; }`, picked: true },
    ],
  })
);
```
