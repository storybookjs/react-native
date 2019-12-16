# Storybook Addon Backgrounds

Storybook Background Addon can be used to change background colors inside the preview in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![React Storybook Screenshot](https://raw.githubusercontent.com/storybookjs/storybook/master/docs/static/img/addon-backgrounds.gif)

## Installation

```sh
npm i -D @storybook/addon-backgrounds
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-backgrounds/register';
```

## Usage

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module)
  .addParameters({
    backgrounds: [
      { name: 'twitter', value: '#00aced', default: true },
      { name: 'facebook', value: '#3b5998' },
    ],
  })
  .add('with text', () => <button>Click me</button>);
```

You can add the backgrounds to all stories with `addParameters` in `.storybook/config.js`:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
  backgrounds: [
    { name: 'twitter', value: '#00aced', default: true },
    { name: 'facebook', value: '#3b5998' },
  ],
});

// should be before configure()
```

If you want to override backgrounds for a single story or group of stories, pass the `backgrounds` parameter:

```js
import React from 'react';

export default {
  title: 'Button',
};

export const defaultView = () => <button>Click me</button>;
defaultView.story = {
  parameters: {
    backgrounds: [{ name: 'red', value: 'rgba(255, 0, 0)' }],
  },
};
```

If you don't want to use backgrounds for a story, you can set the `backgrounds` parameter to `[]`, or use `{ disable: true }` to skip the addon:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Button', module).add('example 1', () => <button>Click me</button>, {
  backgrounds: [],
});

export default {
  title: 'Button',
};

export const noBackgrounds = () => <button>Click me</button>;
noBackgrounds.story = {
  parameters: {
    backgrounds: [],
  },
};

export const disabledBackgrounds = () => <button>Click me</button>;
disabledBackgrounds.story = {
  parameters: {
    backgrounds: { disabled: true },
  },
};
```
