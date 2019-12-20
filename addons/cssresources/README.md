# Storybook Addon Cssresources

Storybook Addon Cssresources to switch between css resources at runtime for your story [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Cssresources Demo](docs/demo.gif)

## Installation

```sh
yarn add -D @storybook/addon-cssresources
```

## Configuration

Then create a file called `main.js` in your storybook config.

Add following content to it:

```js
module.exports = {
  addons: ['@storybook/addon-cssresources/register']
}
```

## Usage

You need add the all the css resources at compile time using the `withCssResources` decorator. They can be added globally or per story. You can then choose which ones to load from the cssresources addon UI:

```js
import { withCssResources } from '@storybook/addon-cssresources';

export default {
  title: 'CssResources',
  parameters: {
    cssresources: [{
        id: `bluetheme`,
        code: `<style>body { background-color: lightblue; }</style>`,
        picked: false,
      },
    ],
  },
  decorators: [withCssResources],
};

export const defaultView = () => (
  <div />
);
```
