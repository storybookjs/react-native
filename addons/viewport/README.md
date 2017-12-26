# Storybook Viewport Addon

Storybook Viewport Addon allows your stories to be displayed in different sizes and layouts in [Storybook](https://storybookjs.org).  This helps build responsive components inside of Storybook.

This addon works with Storybook for: [React](https://github.com/storybooks/storybook/tree/master/app/react) and [Vue](https://github.com/storybooks/storybook/tree/master/app/vue).

![Screenshot](https://github.com/storybooks/storybook/blob/master/docs/viewport.png)

## Installation

Install the following npm module:

    npm i --save-dev @storybook/addon-viewport

or with yarn:

    yarn add -D @storybook/addon-viewport

## Basic Usage

Simply import the Storybook Viewport Addon in the `addons.js` file in your `.storybook` directory.

```js
import '@storybook/addon-viewport/register'
```

This will register the Viewport Addon to Storybook and will show up in the action area.

## FAQ

#### How do I add a new device?

Unfortunately, this is currently not supported.

#### How can I make a custom screen size?

Unfortunately, this is currently not supported.
