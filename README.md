# Storybook for React Native

With Storybook for React Native you can design and develop individual React Native components without running your app.

This readme is for the 6.0 beta documentation, [find the 5.3 readme here](https://github.com/storybookjs/react-native/tree/v5.3.25#readme)

For more information about storybook visit: [storybook.js.org](https://storybook.js.org)

> NOTE: `@storybook/react-native` doesn't work yet with 6.4, please pin other storybook packages (like @storybook/addons) to `~6.3`

Work on v6 is currently underway, if you want to help out or are just curious then check out the [project board](https://github.com/storybookjs/react-native/projects/2?fullscreen=true) to see the open issues related to 6.0. If you want to work on something then assign it to yourself and drag the item to the doing column.

![picture of storybook](https://user-images.githubusercontent.com/3481514/145904252-92e3dc1e-591f-410f-88a1-b4250f4ba6f2.png)

Pictured is from the template mentioned in [getting started](#getting-started)

# Table of contents

- 🚀 [Getting Started](#getting-started)
- 📒 [Writing stories](#writing-stories)
- 🔌 [Addons](#addons)
- 📱 [Hide/Show Storybook](#hideshow-storybook)
- 🔧 [getStorybookUI](#getstorybookui-options)
- 🤝 [Contributing](#contributing)
- ✨ [Examples](#examples)

# Getting Started

## New project

There is some project boilerplate with @storybook/react-native and @storybook/addons-react-native-web both already configured with a simple example.

For expo you can use this [template](https://github.com/dannyhw/expo-template-storybook) with the following command

```sh
expo init --template expo-template-storybook AwesomeStorybook
```

For react native cli you can use this [template](https://github.com/dannyhw/react-native-template-storybook)

```sh
npx react-native init MyApp --template react-native-template-storybook
```

## Existing project

Normally to setup an existing project you would use the storybook cli to generate the files.

For v6 the cli setup command is still being worked on, for now use the manual guide [here](MANUAL_SETUP.md).


# Writing stories

In v6 you can use the CSF syntax that looks like this:

```jsx
import {MyButton} from './Button';

export default {
  title: 'components/MyButton',
  component: MyButton,
};

export const Basic = args => (
  <MyButton {...args} />
);

Basic.args = {
  text: 'Hello World',
  color: 'purple',
};

```

You should configure the path to your story files in the main.js config file from the .storybook folder.

```js
module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)'
  ],
  addons: []
}
```

## Decorators and Parameters

For stories you can add decorators and parameters on the default export or on a specifc story

```jsx
export default {
  title: 'Button',
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

For global decorators and parameters you can add them to preview.js inside your .storybook folder.

```jsx
import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';
export const decorators = [withBackgrounds, (Story)=> <View style={{flex: 1, color: 'blue'}}><Story/></View>];
export const parameters = {
  backgrounds: {
    default: 'plain',
    values: [
      {name: 'plain', value: 'white'},
      {name: 'warm', value: 'hotpink'},
      {name: 'cool', value: 'deepskyblue'},
    ]
  },
};

```

# Addons

The cli will install some basic addons for you such as controls and actions.
Ondevice addons are addons that can render with the device ui that you see on the phone.

Currently the addons available are:

- @storybook/addon-ondevice-controls: adjust your components props in realtime
- @storybook/addon-ondevice-actions: mock onPress calls with actions that will log information in the actions tab
- @storybook/addon-ondevice-notes: Add some markdown to your stories to help document their usage
- @storybook/addon-ondevice-backgrounds: change the background of storybook to compare the look of your component against different backgrounds

Install each one you want to use and add them to the main.js addons list as follows:

```js
addons: [
  '@storybook/addon-ondevice-notes',
  '@storybook/addon-ondevice-controls',
  '@storybook/addon-ondevice-backgrounds',
  '@storybook/addon-ondevice-actions',
],
```


### Using the addons in your story

For details of each ondevice addon you can see the readme:

- [actions](addons/ondevice-actions)
- [backgrounds](addons/ondevice-backgrounds)
- [controls](addons/ondevice-controls)
- [notes](addons/ondevice-notes)

# Hide/Show storybook

Storybook on react native is a normal React Native component that can be used or hidden anywhere in your RN application based on your own logic.

You can also create a separate app just for storybook that also works as a package for your visual components.

## Using the DEV Menu

Some have opted to toggle the storybook component by using a custom option in the react native developer menu.

An example of this can found in the ignite CLI boiler plate for storybook which you can see [here](https://github.com/infinitered/ignite/blob/master/boilerplate/storybook/toggle-storybook.tsx)


# getStorybookUI options


You can pass these parameters to getStorybookUI call in your storybook entry point:

```
{
    tabOpen: Number (0)
        -- which tab should be open. -1 Navigator, 0 Preview, 1 Addons
    initialSelection: string | Object (undefined)
        -- initialize storybook with a specific story.  eg: `mybutton--largebutton` or `{ kind: 'MyButton', name: 'LargeButton' }`
    shouldDisableKeyboardAvoidingView: Boolean (false)
        -- Disable KeyboardAvoidingView wrapping Storybook's view
    keyboardAvoidingViewVerticalOffset: Number (0)
        -- With shouldDisableKeyboardAvoidingView=true, this will set the keyboardverticaloffset (https://facebook.github.io/react-native/docs/keyboardavoidingview#keyboardverticaloffset) value for KeyboardAvoidingView wrapping Storybook's view
}
```

# Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](CONTRIBUTING.md) to get started,
  or find us on [Discord](https://discord.gg/sMFvFsG) and look for the react-native channel.

Looking for a first issue to tackle?

- We tag issues with [Good First Issue](https://github.com/storybookjs/react-native/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) when we think they are well suited for people who are new to the codebase or OSS in general.
- [Talk to us](https://discord.gg/sMFvFsG), we'll find something to suits your skills and learning interest.

# Examples

Here are some example projects to help you get started

- A mono repo setup by @axeldelafosse https://github.com/axeldelafosse/storybook-rnw-monorepo
- Expo setup https://github.com/dannyhw/expo-storybook-starter
- React native cli setup https://github.com/dannyhw/react-native-storybook-starter
- Want to showcase your own project? open a PR and add it to the list!
