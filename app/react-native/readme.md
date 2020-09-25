# Storybook for React Native

With Storybook for React Native you can design and develop individual React Native components without running your app.

For more information visit: [storybook.js.org](https://storybook.js.org)

> NOTE: `@storybook/react-native` and `@storybook/react-native-server` are now on a different release cycle from the Storybook Core packages (`@storybook/react`, `@storybook/vue`, etc.). The last stable version of `@storybook/react-native` is `5.3.23` and it should be used with `5.3` versions of Storybook Core.

_To re-iterate storybook dependencies with a version 6.0 and higher are not supported by react native storybook yet._

# Table of contents

- 🚀 [Getting Started](#getting-started)
  - 📒 [Making stories](#making-stories)
  - [On device Addons](#ondevice-addons)
- [Other ways to render storybook](#other-ways-to-render-storybook)
- [getStorybookUI Options](#getstorybookui-options)
- [Contributing](#contributing)

# Getting Started

Follow these steps to setup storybook for your project. This will be the most simple setup that will show the stories and storybook UI on the Device.

First add the react native storybook library to your react native app.

If you're struggling check out this [snack](https://snack.expo.io/@dannyhw/expo-storybook-example) with a working example

### Install with yarn

```shell
yarn add @storybook/react-native
```

### Install with npm

```shell
npm i --save @storybook/react-native
```

Add this code in your index.js in order to render storybook. There are some other ways of doing this, but this will get you started.

```js
// index.js
import { getStorybookUI, configure } from '@storybook/react-native';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';

configure(() => {
  require('./src/stories.js'); // we will create this file in the next steps
}, module);

const StorybookUIRoot = getStorybookUI({});

AppRegistry.registerComponent(appName, () => StorybookUIRoot);
```

If your using expo you don't need to use the register component call and you can just do `export default storybookUIRoot`

## Making stories

To make you storybook stories appear you need to import them in the configure function. You can do this individually or import a file that itself imports all of the stories.

```js
//index.js
configure(() => {
  require('./src/stories.js');
}, module);
```

```js
// src/stories.js
import './components/myComponent/MyComponent.stories.jsx';
import './components/button/CustomButton.stories.jsx';
```

In the stories.js file I import some stories of components I've made.
You use stories to render your component in the storybook UI.

A story file for a custom button component could look something like following.

```jsx
// src/components/button/CustomButton.stories.jsx
import React from 'react';
import { storiesOf } from '@storybook/react-native';
// I import my component here
import CustomButton from './CustomButton';
import { View } from 'react-native';

// here I define that I want to create stories with the label "Buttons",
// this will be the name in the storybook navigation

const buttonStories = storiesOf('Buttons', module);

// then I add a story with the name default view, I can add multiple stories to button stories
buttonStories.add('default view', () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <CustomButton onPress={() => null} />
  </View>
));
```

## Ondevice Addons

You will most likely want to make use of addons, some good starter addons are "knobs" and "actions".
Knobs will give you a way to change the props on the components in the storybook dynamically.
Actions can provide information about function calls and can be used in place of onPress functions.

First install the ondevice addon packages in your project

```shell
yarn add @storybook/addon-ondevice-actions @storybook/addon-ondevice-knobs @storybook/addon-actions @storybook/addon-knobs
```

```shell
npm i --save @storybook/addon-ondevice-actions @storybook/addon-ondevice-knobs @storybook/addon-actions @storybook/addon-knobs
```

Create a file for your addons called rn-addons.js and add the following in this file

```js
// rn-addons.js
import '@storybook/addon-ondevice-knobs/register';
import '@storybook/addon-ondevice-actions/register';
```

Now you can edit your index.js to import the rn-addons file.

```js
// index.js
import { getStorybookUI, configure } from '@storybook/react-native';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';
import './rn-addons.js';

configure(() => {
  require('./src/stories.js');
}, module);

const StorybookUIRoot = getStorybookUI({});

AppRegistry.registerComponent(appName, () => StorybookUIRoot);
```

Now to use addons in your stories:

```js
// src/components/button/CustomButton.stories.jsx
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CustomButton from './CustomButton';
import { View } from 'react-native';

// the action function has one argument which is the name of the action,
// this will be displayed in the actions tab in the addons panel
// action("name here")
import { action } from '@storybook/addon-actions';

// the boolean knob renders a switch which lets you toggle a value between true or false
// you call it like boolean("name here", default_value)
import { boolean, withKnobs } from '@storybook/addon-knobs';

const buttonStories = storiesOf('CustomButton', module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator(withKnobs);

// I use to boolean knob to set the disabled prop based on the knob state
// I use the action function to log every time the button gets called
buttonStories.add('default view', () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <CustomButton onPress={action('Button Press!')} disabled={boolean('Disabled', false)} />
  </View>
));
```

Other ondevice supported addons are addon-ondevice-backgrounds and addon-ondevice-notes.
More documentation for that coming soon.

# Other ways to render storybook

There are a few options on how you can make the storybook render in your app so it's up to you to decide which works best for your project.

The example in the "getting started" section means that any existing app no longer renders because we hijacked the index.js file to export the storybook ui. There are some other options you can use if want to mix your app and storybook together

## Optionally run storybook or your app

You could do something like this if you want to run storybook in dev mode and your app in release mode.

```js
import StorybookUI from './storybook';

import App from './app';

module.exports = __DEV__ ? StorybookUI : App;
```

Or you could use some kind of setting/environment variable to define what renders.

## React Native Navigation, or other custom approaches

`StorybookUI` is a RN `View` component that can be embedded anywhere in your RN application, e.g. on a tab or within an admin screen.

You could also create a separate app just for storybook that also works as a package for your visual components.

## Storybook server (optional)

Storybook server is used to control the component visible on the device via a web ui. This is useful to control multiple devices at once and compare them at the same time.

Install the package

yarn `yarn add @storybook/react-native-server`

npm `npm i --save @storybook/react-native-server`

To run the server you can use `yarn start-storybook`
or add a script to your package.json like

```
"storybook": "start-storybook"
```

_You can change "storybook" to any name you like._

This will open the server web client, you will need to open storybook on the device for the stories to appear in the sidebar.

To enable addons for react native server add a folder `storybook/` in the root of the project with a addons.js file inside. The server will detect this file and import it. The file should contain the addon imports similar to the rn-addons.js file but using the regular storybook (for web) addons. For example:

```
// storybook/addons.js
require('@storybook/addon-knobs/register');
require('@storybook/addon-actions/register');
```

If you get the error `Can't resolve 'babel-loader'` install babel-loader from npm and it should fix it.

### Server cli options

```
-h, --host <host>
    host to listen on
-p, --port <port>
    port to listen on
--https
    whether server is running on https
-c, --config-dir [dir-name]
    storybook config directory
-e, --environment [environment]
    DEVELOPMENT/PRODUCTION environment for webpack
-i, --manual-id
    allow multiple users to work with same storybook
--smoke-test
    Exit after successful start
```

# getStorybookUI Options

You can pass these parameters to getStorybookUI call in your storybook entry point:

```
{
    onDeviceUI: Boolean (true)
        -- display navigator and addons on the device
    disableWebsockets: Boolean (false)
        -- allows to display stories without running storybook server. Should be used with onDeviceUI
    secured: Boolean (false)
        -- use wss/https instead of ws/http
    host: String (NativeModules.SourceCode.scriptURL)
        -- host to use
    port: Number (7007)
        -- port to use
    query: String ("")
        -- additional query string to pass to websockets
    isUIHidden: Boolean (false)
        -- should the ui be closed initially.
    tabOpen: Number (0)
        -- which tab should be open. -1 Navigator, 0 Preview, 1 Addons
    initialSelection: Object (null)
        -- initialize storybook with a specific story. In case a valid object is passed, it will take precedence over `shouldPersistSelection. ex: `{ kind: 'Knobs', story: 'with knobs' }`
    shouldPersistSelection: Boolean (true)
        -- initialize storybook with the last selected story.
    shouldDisableKeyboardAvoidingView: Boolean (false)
        -- Disable KeyboardAvoidingView wrapping Storybook's view
    keyboardAvoidingViewVerticalOffset: Number (0)
        -- With shouldDisableKeyboardAvoidingView=true, this will set the keyboardverticaloffset (https://facebook.github.io/react-native/docs/keyboardavoidingview#keyboardverticaloffset) value for KeyboardAvoidingView wrapping Storybook's view
}
```

# Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](https://github.com/storybookjs/react-native/blob/master/CONTRIBUTING.md) to get started,
  or find us on [Discord](https://discord.gg/sMFvFsG) and look for the react-native channel.

Looking for a first issue to tackle?

- We tag issues with [Good First Issue](https://github.com/storybookjs/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) when we think they are well suited for people who are new to the codebase or OSS in general.
- [Talk to us](https://discord.gg/sMFvFsG), we'll find something to suits your skills and learning interest.
