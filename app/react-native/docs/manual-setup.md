# Manual Setup

First, install the `@storybook/react-native` module

```sh
yarn add @storybook/react-native --dev
```

Create a new directory called `storybook` in your project root and create an entry file (index.js) as given below.
(Don't forget to replace "MyApplicationName" with your app name).

**storybook/index.js**
```js
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import './rn-addons';

// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI();

AppRegistry.registerComponent('MyApplicationName', () => StorybookUIRoot);
export default StorybookUIRoot;
```

Create a file called `rn-addons.js`
In this file you can import on device addons.

**storybook/rn-addons.js**
```
import '@storybook/addon-ondevice-knobs/register';
import '@storybook/addon-ondevice-notes/register';
...
```


Then write your first story in the `stories` directory like this:

```js
import { storiesOf } from '@storybook/react-native';
import React from 'react';
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

Finally replace your app entry with
```js
import './storybook';
```

For example, if your entry app is named App.js/index.js (Expo/Vanilla). You can replace it with the following.

```
import StorybookUI from './storybook';

export default StorybookUI;
```

If you cannot replace your entry point just make sure that the component exported from `./storybook` is displayed
somewhere in your app. `StorybookUI` is simply a RN `View` component that can be embedded anywhere in your 
RN application, e.g. on a tab or within an admin screen.

## Server support

If you want to support having a storybook server running add following NPM script into your `package.json` file:

```json
{
  "scripts": {
    "storybook": "storybook start"
  }
}
```

If you want to have addons inside browser, create a file named `addons.js` file in `storybook`. Here is a list of default addons:

**storybook/addons.js**
```js
import '@storybook/addon-actions';
import '@storybook/addon-links';
```

