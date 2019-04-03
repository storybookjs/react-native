# Storybook Backgrounds Addon for react-native

Storybook Backgrounds Addon for react-native can be used to change background colors of your stories right from the device.

<img src="docs/demo.gif" alt="Storybook Backgrounds Addon Demo" width="400" />

## Installation

```sh
npm i -D @storybook/addon-ondevice-backgrounds
```

## Configuration

Then create a file called `rn-addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-ondevice-backgrounds/register';
```

Then import `rn-addons.js` next to your `getStorybookUI` call.
```js
import './rn-addons';
```

## Usage

react-native users will have to import `storiesOf` from `@storybook/react-native` and are required to add the `withBackgrounds` decorator.

Then write your stories like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

addDecorator(withBackgrounds);

storiesOf('Button', module)
  .addParameters({
    backgrounds: [
      { name: 'dark', value: '#222222' },
      { name: 'light', value: '#eeeeee', default: true },
    ],
  })
  .add('with text', () => <Text>Click me</Text>);
```

See [web backgrounds addon](../backgrounds#usage) for detailed usage and the [crna-kitchen-sink app](../../examples-native/crna-kitchen-sink) for more examples.
