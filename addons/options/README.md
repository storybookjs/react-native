# Storybook UI Options Addon

The Options addon can be used to set configure the Storybook UI. This addon works with both [React Storybook](https://github.com/storybooks/react-storybook) and [React Native Storybook](https://github.com/storybooks/react-native-storybook).

![](docs/screenshot.png)

## Getting Started

First, install the addon

```shell
npm install -D @storybook/addon-options
```

Add this line to your `addons.js` file (create this file inside your storybook config directory if needed).

```js
import '@storybook/addon-options/register';
```

Import and use the `setOptions` function in your config.js file.

```js
import * as storybook from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'CUSTOM-OPTIONS',
  url: 'https://github.com/storybooks/storybook-addon-options',
  goFullScreen: false,
  showLeftPanel: false,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
  sortStoriesByKind: false,
});

storybook.configure(() => require('./stories'), module);
```
