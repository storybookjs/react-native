# Manual Setup

First, install the `@storybook/react-native-storybook` module

```shell
npm i -D @storybook/react-native-storybook
```

Create a new directory called `storybook` in your project root and create an entry file (index.ios.js or index.android.js) as given below. (Don't forget to replace "MyApplicationName" with your app name).

```js
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native-storybook';
import './addons';

// import your stories
configure(function() {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({port: 7007, host: 'localhost'});
AppRegistry.registerComponent('MyApplicationName', () => StorybookUI);
```

Create a file named `addons.js` file in `storybook` directory to use default set of addons.

```
import '@storybook/react-native-storybook/addons';
```

Then write your first story in the `stories` directory like this:

```js
// index.js

import React from 'react';
import { storiesOf } from '@storybook/react-native-storybook';
import { View, Text } from 'react-native';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
};

const CenteredView = (props) => (
  <View style={style}>
    {props.children}
  </View>
);

storiesOf('CenteredView')
  .add('default view', () => (
    <CenteredView>
      <Text>Hello Storybook</Text>
    </CenteredView>
  ));
```

Then add following NPM script into your `package.json` file:

```js
{
  "scripts": {
    ...
    "storybook": "storybook start -p 7007"
    ...
  }
}
```
