# Storybook for React Native

With Storybook for React Native you can design and develop individual React Native components without running your app.

For more information visit: [storybook.js.org](https://storybook.js.org)

> NOTE: `@storybook/react-native` and `@storybook/react-native-server` are now on a different release cycle from the Storybook Core packages (`@storybook/react`, `@storybook/vue`, etc.). The last stable version of `@storybook/react-native` is `5.3.25` and it should be used with `5.3` versions of Storybook Core.

_To re-iterate storybook dependencies with a version 6.0 and higher are not supported by react native storybook yet._

# Table of contents

- 🚀 [Getting Started](#getting-started)
- 📒 [Making stories](#making-stories)
- 🔌 [On device Addons](#ondevice-addons)
- 📱 [Other ways to render storybook](#other-ways-to-render-storybook)
- 🔧 [getStorybookUI Options](#getstorybookui-options)
- 🤝 [Contributing](#contributing)

# Getting Started

To get started run this command from within the root of your react native app:

```
npx -p @storybook/cli sb init --type react_native
```

You'll be prompted asking if you want to install @storybook/react-native-server, you can safely choose not to install this now since you can add it later and its not required.

This command will setup most things for you, now you just need to add the following to your entrypoint (usually App.js or index.js).

```
export {default} from "./storybook";
```

The above steps use the storybook cli to install the most useful addons and creates a few example stories in a folder called `storybook`.

All the config for storybook and the entrypoint also live in the `storybook` folder by default.

If you prefer to set things up yourself you can follow the [manual setup](https://github.com/storybookjs/react-native/blob/master/app/react-native/docs/manual-setup.md)

If you're struggling check out this [snack](https://snack.expo.io/@dannyhw/expo-storybook-example) with a working example

# OndeviceUI and React native Server

The react native storybook is designed to be flexible so that you can navigate all your stories and use addons within the device ui, you also have the option to use the web ui via `@storybook/react-native-server` if thats what you prefer.

The UI that allows you to navigate stories on the device is what we will call the "OnDeviceUI". When referring to features specific to this UI this term is used to distinguish it from the server ui.

# Making stories

The simplest type of story could look something like this

```

  import React from 'react';
  import { storiesOf } from '@storybook/react-native';

  // I import the component I want to display here
  import CustomButton from './CustomButton';

  // here I define that I want to create stories with the label "Buttons",
  // this will be the name in the storybook navigation

  const buttonStories = storiesOf('Buttons', module);

  // then I add a story with the name default view, I can add multiple stories to button stories
  buttonStories.add('default view', () => (<CustomButton onPress={() => null} />));
```

You can then include addons such as action and knobs to make it more interactive.

# Ondevice Addons

The cli will install some basic addons for you such as knobs and actions.
Ondevice addons are addons that can render with the device ui that you see on the phone.

Currently the addons available are:

- @storybook/addon-ondevice-knobs: adjust your components props in realtime
- @storybook/addon-ondevice-actions: mock onPress calls with actions that will log information in the actions tab
- @storybook/addon-ondevice-notes: Add some markdown to your stories to help document their usage
- @storybook/addon-ondevice-backgrounds: change the background of storybook to compare the look of your component against different backgrounds

Add each one you want to use to the rn-addons.js file in the `storybook` folder:

```
import '@storybook/addon-ondevice-actions/register';
```

Make sure to import the rn-addons.js file in the storybook entrypoint (index.js in the storybook folder by default):

```
import './rn-addons';
```

### Using the addons in your story

Based on the previous example heres how you could extend it to use addons.

```
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

# Other ways to render storybook

In the getting started guide we suggest that you override you change the default export to be the storybook UI, this might not be what you want depending on how you are using storybook.

There are a few options on how you can make the storybook render in your app so it's up to you to decide which works best for your project.

## Run storybook as a separate app/component library

Using the approach from the getting started setup you can make an app that just displays your storybook and then you could use this app to share your component library. Then you can export all your components from somewhere within the project and use the project as a component library/package.

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

# Storybook server (optional)

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
