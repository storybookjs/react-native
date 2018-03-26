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

Import and use the `configure` function in your `config.js` file.

```js
import { configure } from '@storybook/addon-viewport';
```

### defaultViewport : String
----
Setting this property to, let say `iphone6`, will make `iPhone 6` the default device/viewport for all stories. Default is `'responsive'` which fills 100% of the preview area.

### viewports : Object
----
A key-value pair of viewport's key and properties for all viewports to be displayed. Default is [`INITIAL_VIEWPORTS`](src/shared/index.js)

## Examples

### Basic Usage

Simply import the Storybook Viewport Addon in the `addons.js` file in your `.storybook` directory.

```js
import '@storybook/addon-viewport/register'
```

This will register the Viewport Addon to Storybook and will show up in the action area.


### Use Custom Set of Devices

This will replace all previous devices with `Kindle Fire 2` and `Kindle Fire HD` by simply calling `configure` with the two devices as `viewports` in `config.js` file in your `.storybook` directory.

```js
import { configure } from '@storybook/addon-viewport';

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

configure({
  viewports: newViewports
});
```


### Add New Device

This will add both `Kindle Fire 2` and `Kindle Fire HD` to the list of devices. This is acheived by making use of the exported [`INITIAL_VIEWPORTS`](src/shared/index.js) property, by merging it with the new viewports and pass the result as `viewports` to `configure` function

```js
import { configure, INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

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

configure({
  viewports: {
    ...INITIAL_VIEWPORTS,
    ...newViewports
  }
});
```


### Change The Default Viewport

This will make `iPhone 6` the default viewport for all stories.

```js
import { configure } from '@storybook/addon-viewport';

configure({
  defaultViewport: 'iphone6'
});
```
