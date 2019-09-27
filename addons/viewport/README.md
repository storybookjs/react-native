# Storybook Viewport Addon

Storybook Viewport Addon allows your stories to be displayed in different sizes and layouts in [Storybook](https://storybook.js.org). This helps build responsive components inside of Storybook.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](https://github.com/storybookjs/storybook/blob/master/addons/viewport/docs/viewport.png)

## Installation

Install the following npm module:

```sh
npm i --save-dev @storybook/addon-viewport
```

or with yarn:

```sh
yarn add -D @storybook/addon-viewport
```

Then, add following content to .storybook/addons.js

```js
import '@storybook/addon-viewport/register';
```

You should now be able to see the viewport addon icon in the the toolbar at the top of the screen.

## Configuration

The viewport addon is configured by story parameters with the `viewport` key. To configure globally, import `addParameters` from your app layer in your `config.js` file.

```js
import { addParameters } from '@storybook/react';

addParameters({
  viewport: {
    viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
    defaultViewport: 'someDefault',
  },
});
```

Options can take a object with the following keys:

### defaultViewport : String

---

Setting this property to, let say `iphone6`, will make `iPhone 6` the default device/viewport for all stories. Default is `'responsive'` which fills 100% of the preview area.

### viewports : Object

---

A key-value pair of viewport's key and properties (see `Viewport` definition below) for all viewports to be displayed. Default is [`MINIMAL_VIEWPORTS`](src/defaults.ts)

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

## Configuring per component or story

Parameters can be configured for a whole set of stories or a single story via the standard parameter API:

```js
import addStories from '@storybook/react';

addStories('Stories', module)
  // To set a default viewport for all the stories for this component
  .addParameters({ viewport: { defaultViewport: 'iphone6' }})
  .add('story', () => </>, { viewport: { defaultViewport: 'iphonex' }});
```

## Examples

### Use Detailed Set of Devices

The default viewports being used is [`MINIMAL_VIEWPORTS`](src/defaults.ts). If you'd like to use a more granular list of devices, you can use [`INITIAL_VIEWPORTS`](src/defaults.ts) like so in your `config.js` file in your `.storybook` directory.

```js
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});
```

### Use Custom Set of Devices

This will replace all previous devices with `Kindle Fire 2` and `Kindle Fire HD` by simply calling `addParameters` with the two devices as `viewports` in `config.js` file in your `.storybook` directory.

```js
import { addParameters } from '@storybook/react';

const newViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

addParameters({
  viewport: { viewports: newViewports },
});
```

### Add New Device

This will add both `Kindle Fire 2` and `Kindle Fire HD` to the list of devices. This is achieved by making use of the exported [`INITIAL_VIEWPORTS`](src/defaults.ts) property, by merging it with the new viewports and pass the result as `viewports` to `configureViewport` function

```js
import { addParameters } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const newViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...newViewports,
    },
  },
});
```
