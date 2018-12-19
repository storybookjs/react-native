# Storybook Addon Cssresources

Storybook Addon Cssresources to switch between css resources at runtime for your story [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Cssresources Demo](docs/demo.gif)

## Installation

```sh
yarn add -D @storybook/addon-cssresources
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-cssresources/register';
```

## Usage

You need add the all the css resources at compile time using the `withCssResources` decorator. They can be added globally or per story. You can then choose which ones to load from the cssresources addon ui:

```js
// Import from @storybook/X where X is your framework
import { configure, addDecorator, storiesOf } from '@storybook/react';
import { withCssResources } from '@storybook/addon-cssresources';

// global
addDecorator(
  withCssResources({
    cssresources: [{
        name: `bluetheme`,
        code: `<style>body { background-color: lightblue; }</style>`,
        picked: false,
      },
    ],
  })
);

// per story
storiesOf('Addons|Cssresources', module)
  .addDecorator(
    withCssResources({
      cssresources: [{
          name: `fontawesome`,
          code: `<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></link>`,
          picked: true,
        }, {
          name: `whitetheme`,
          code: `<style>.fa { color: #fff }</style>`,
          picked: true,
        },
      ],
    })
  )
  .add('Camera Icon', () => <i className="fa fa-camera-retro"> Camera Icon</i>);
```
