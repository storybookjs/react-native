---
id: 'guide-react-native'
title: 'Storybook for React Native'
---

This guide will help you to manually setup React Native Storybook and explain about addons and Storybook server. 


## Table of contents

-   [Manual setup](#manual-setup)
-   [Writing stories](#writing-stories)
-   [Addons](#addons)
-   [Storybook Server](#storybook-server)

## Manual setup

**1. Add `@storybook/react-native` to your project.**

To use React Native Storybook you need to have it as a dependency in your project. To do that, simply run:

```sh
npm i --save-dev @storybook/react-native
```

**2. Create the Storybook directory.**

Create a new directory called `storybook` in your project root.
 
**3. Create an entry file for Storybook.**

Create an `index.js` file as given below. Do not forget to replace `%APP_NAME%` with your app name if you are not
using expo.

``storybook/index.js``
```js
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories');
}, module);

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
```

**4. Create a file for on device addons**

Create a file called `rn-addons.js` that you can use to include on device addons (more about them in addons section).
You can see an example below.

`storybook/rn-addons.js`
```
import '@storybook/addon-ondevice-knobs/register';
import '@storybook/addon-ondevice-notes/register';
...
```

**5. Display StorybookUI in your app.**

 Finally you need to expose StorybookUI somewhere in your app.
 The easiest solution is to replace your app entry with:
 
```js
export default from './storybook';
```

If you cannot replace your entry point just make sure that the component exported from `./storybook` is displayed
somewhere in your app. `StorybookUI` is simply a RN `View` component that can be embedded anywhere in your 
RN application, e.g. on a tab or within an admin screen.

---

## Writing stories
Now you can write some stories inside the `storybook/stories/index.js` file, like this:

```js
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, Text } from 'react-native';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
};

const CenteredView = ({ children }) => (
  <View style={style}>
    {children}
  </View>
);

storiesOf('CenteredView', module)
  .add('default view', () => (
    <CenteredView>
      <Text>Hello Storybook</Text>
    </CenteredView>
  ));
```

Refer to [Writing Stories](https://storybook.js.org/basics/writing-stories) for more information.



---

## Addons

Storybook supports addons. You can read more about them [here](https://storybook.js.org/addons/introduction)

There is one big difference in React Native is that it has two types of addons: Addons that work in the browser
and addons that work on the app itself (on device addons).

## Browser addons
Browser addons are default addons to storybook. You create a file called `addons.js` inside `storybook` directory and
the addons will be automatically loaded inside your browser.

`storybook/addons.js`

```js
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
```

## On device addons
On device addons are addons that are displayed in your app in addons panel.
To use them you have to create a file called `rn-addons.js` in `storybook` directory. 
Because React Native does not dynamically resolve imports, you will also have to manually import this file before
`getStorybookUI` call.

Example:

`storybook/rn-addons.js`
```js
import '@storybook/addon-ondevice-knobs/register';
import '@storybook/addon-ondevice-notes/register';
...
```

`storybook/index.js`
```js
import { getStorybookUI } from '@storybook/react-native';

...
import './rn-addons';
...

const StorybookUI = getStorybookUI();
export default StorybookUI;
```

This step is done automatically when you install Storybook for the first time.

## Compatibility
Web and onDevice addon compatibility can be found [here](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

## Performance of on device addons
Because on device addons are inside the app, they are also rerendered on every change. Be aware that this can have
performance implications for your app.
 
 ---
 
## Storybook server
The default usage of React Native Storybook till version 4 involved starting Storybook server.
Starting from v4 we do not expect user to start the server since in most cases it is not really necessary.
 
In case you still want to run Storybook server simply add the following script to your `package.json`.
 ```json
 {
   "scripts": {
     ...
     "storybook": "storybook start"
   }
 }
 ```
 
And then call `npm run storybook`.

Using Storybook server gives some additional functionality to Storybook for React Native.

**Websockets connection**

By using websockets connection you can create your own tools that integrate with your storybook app and control it from
outside of your app.

**IDE Plugins**

Having server running allows you to control your storybook view from inside web page or your ide.

There is a plugin for [JetBrains IDEs](https://plugins.jetbrains.com/plugin/9910-storybook) and there is one 
for [VS Code](https://github.com/orta/vscode-react-native-storybooks).


**Web addons**

There are Storybook addons that work with React Native but do not have on device implementations.

