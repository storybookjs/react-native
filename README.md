# Storybook UI Options Addon

The Options addon can be used to set configure the Storybook UI. This addon works with both [React Storybook](https://github.com/kadirahq/react-storybook) and [React Native Storybook](https://github.com/kadirahq/react-native-storybook).

![](docs/screenshot.png)

## Getting Started

First, install the addon

```shell
npm install -D @kadira/storybook-addon-options
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@kadira/storybook-addon-options/register';
```

Import and use the `setOptions` function in your config.json file.

```js
import * as storybook from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/kadirahq/storybook-addon-options',
  goFullScreen: false,
  showLeftPanel: false,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
});

storybook.configure(() => require('./stories'), module);
```
