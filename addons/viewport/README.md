# Storybook Viewport Addon

Storybook Viewport Addon allows your stories to be displayed in different sizes and layouts in [Storybook](https://storybook.js.org).  This helps build responsive components inside of Storybook.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://github.com/storybooks/storybook/blob/master/addons/viewport/docs/viewport.png)

## Installation

Install the following npm module:

    npm i --save-dev @storybook/addon-viewport

or with yarn:

    yarn add -D @storybook/addon-viewport


## Configuration

Import and use the `configureViewport` function in your `config.js` file.

```js
import { configureViewport } from '@storybook/addon-viewport';
```

### defaultViewport : String
----
Setting this property to, let say `iphone6`, will make `iPhone 6` the default device/viewport for all stories. Default is `'responsive'` which fills 100% of the preview area.

### viewports : Object
----
A key-value pair of viewport's key and properties (see `Viewport` definition below) for all viewports to be displayed. Default is [`INITIAL_VIEWPORTS`](src/shared/index.js)

#### Viewport Model
```js
{
  /**
   * name to display in the dropdown
   * @type {String}
   */
  name: 'Responsive',

  /**
   * Inline styles to be applied to the story (iframe).
   * styles is an object whose key is the camelCased version of the style name, and whose
   * value is the style’s value, usually a string
   * @type {Object}
   */
  styles: {
    width: '100%',
    height: '100%',
  },

  /**
   * type of the device (e.g. desktop, mobile, or tablet)
   * @type {String}
   */
  type: 'desktop',
}
```

## Decorators

Sometimes you want to show collection of mobile stories, and you know those stories look horible on desktop (`responsive`), so you think you need to change the default viewport only for those?

Here is the answer, with `withViewport` decorator, you can change the default viewport of single, multiple, or all stories.

`withViewport` accepts either
* A `String`, which represents the default viewport, or
* An `Object`, which looks like
```js
{
  name: 'iphone6', // default viewport
  onViewportChange({ viewport }) { // called whenever different viewport is selected from the dropdown

  }
}
```

## Examples

### Basic Usage

Simply import the Storybook Viewport Addon in the `addons.js` file in your `.storybook` directory.

```js
import '@storybook/addon-viewport/register'
```

This will register the Viewport Addon to Storybook and will show up in the action area.


### Use Custom Set of Devices

This will replace all previous devices with `Kindle Fire 2` and `Kindle Fire HD` by simply calling `configureViewport` with the two devices as `viewports` in `config.js` file in your `.storybook` directory.

```js
import { configureViewport } from '@storybook/addon-viewport';

const newViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  }
};

configureViewport({
  viewports: newViewports
});
```


### Add New Device

This will add both `Kindle Fire 2` and `Kindle Fire HD` to the list of devices. This is acheived by making use of the exported [`INITIAL_VIEWPORTS`](src/shared/index.js) property, by merging it with the new viewports and pass the result as `viewports` to `configureViewport` function

```js
import { configureViewport, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const newViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  }
};

configureViewport({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...newViewports
  }
});
```


### Change The Default Viewport

This will make `iPhone 6` the default viewport for all stories.

```js
import { configureViewport } from '@storybook/addon-viewport';

configureViewport({
  defaultViewport: 'iphone6'
});
```

## withViewport Decorator

Change the default viewport for single/multiple/global stories, or listen to viewport selection changes

```js
import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withViewport } from '@storybook/addon-viewport';

// Globablly
addDecorator(withViewport('iphone5'));

// Collection
storiesOf('Decorator with string', module)
  .addDecorator(withViewport('iphone6'))
  .add('iPhone 6', () => (
    <h1>
      Do I look good on <b>iPhone 6</b>?
    </h1>
  ));

// Single
storiesOf('Parameterized story', module)
  .addDecorator(withViewport())
  .add(
    'iPad',
    () => (
      <h1>
        Do I look good on <b>iPad</b>?
      </h1>
    ),
    { viewport: 'ipad' }
  );

storiesOf('Decorator with object', module)
  .addDecorator(
    withViewport({
      onViewportChange({ viewport }) {
        console.log(`Viewport changed: ${viewport.name} (${viewport.type})`); // e.g. Viewport changed: iphone6 (mobile)
      },
    })
  )
  .add('onViewportChange', () => <MobileFirstComponent />);

```
