---
id: 'guide-react-native'
title: 'Storybook for React Native'
---

This guide will help you to manually setup React Native Storybook and explain about addons and Storybook server.

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using react-native, you could try forcing it to use react-native:

```sh
npx -p @storybook/cli sb init --type react_native
```

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

`storybook/index.js`

```js
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
```

**4. Create a file for on device addons**

Create a file called `rn-addons.js` that you can use to include on device addons (more about them in addons section). You can see an example below.

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

If you cannot replace your entry point just make sure that the component exported from `./storybook` is displayed somewhere in your app. `StorybookUI` is simply a RN `View` component that can be embedded anywhere in your RN application, e.g. on a tab or within an admin screen.

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
  backgroundColor: '#F5FCFF',
};

const CenteredView = ({ children }) => <View style={style}>{children}</View>;

storiesOf('CenteredView', module).add('default view', () => (
  <CenteredView>
    <Text>Hello Storybook</Text>
  </CenteredView>
));
```

Refer to [Writing Stories](https://storybook.js.org/basics/writing-stories) for more information.

---

## Addons

Storybook supports addons. You can read more about them [here](https://storybook.js.org/addons/introduction)

There is one big difference in React Native is that it has two types of addons: Addons that work in the browser and addons that work on the app itself (on device addons).

## Browser addons

Browser addons are default addons to storybook. You create a file called `addons.js` inside `storybook` directory and the addons will be automatically loaded inside your browser.

`storybook/addons.js`

```js
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
```

## On device addons

On device addons are addons that are displayed in your app in addons panel. To use them you have to create a file called `rn-addons.js` in `storybook` directory. Because React Native does not dynamically resolve imports, you will also have to manually import this file before the `getStorybookUI` call.

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

Web and onDevice addon compatibility can be found [here](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

## Performance of on device addons

Because on device addons are inside the app, they are also rerendered on every change. Be aware that this can have performance implications for your app.

---

## Storybook server

Storybook RN server, `@storybook/react-native-server` is a separate package that provides a standalone server that the Storybook ondevice client can connect to.

Running storybook server gives a few advantages over simply running on-device:

**Websockets connection.** By using websockets connection you can create your own tools that integrate with your storybook app and control it from outside of your app.

**IDE Plugins.** Running server allows you to control your storybook view from inside web page or your IDE. There is a plugin for [JetBrains IDEs](https://plugins.jetbrains.com/plugin/9910-storybook) and there is one for [VS Code](https://github.com/orta/vscode-react-native-storybooks).

**Web addons.** There are Storybook addons that work with React Native but do not have on device implementations.

To run Storybook server, you need to install a few dependencies and add a run script to your `package.json`.

First:

```sh
npm i --save-dev @storybook/react-native-server babel-loader
```

Then:

```json
{
  "scripts": {
    ...
    "storybook": "(adb reverse tcp:7007 tcp:7007 || true) && start-storybook"
  }
}
```

Finally:

```sh
npm run storybook
```

**Note** You can change port to custom with `start-storybook -p=YOUR_PORT_NUMBER`, but then you also have to pass it as an option to `getStorybookUI({port: YOUR_PORT_NUMBER})`. If you are running on android, there might be need to run `adb reverse tcp:YOUR_PORT_NUMBER tcp:YOUR_PORT_NUMBER`.

### Start App
To see your Storybook stories on the device, you should start your mobile app for the <platform> of your choice (typically ios or android). (Note that due to an implementation detail, your stories will only show up in the left pane of your browser window after your device has connected to this storybook server.)

### Historical notes

Some context may be useful if you've used older versions of Storybook for RN and find these instructions confusing.

Prior to v4, `@storybook/react-native` included a built-in server and needed that server to function. In v4.x, the server became optional, but was still included in the package. Finally in v5, we've split out the server into its own package (as documented above), and this has a variety of maintenance and compatibility benefits.

For more information, see the RN migration instructions for [v4](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#removed-rn-packager) and [v5](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-server).
