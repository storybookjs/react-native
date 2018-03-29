# Manual Setup

First, install the `@storybook/react-native` module

```sh
npm install @storybook/react-native
```

Create a new directory called `storybook` in your project root and create an entry file (index.ios.js or index.android.js) as given below. (Don't forget to replace "MyApplicationName" with your app name).

```js
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';
import './addons';

// import your stories
configure(function() {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({
  port: 7007,
  host: 'localhost',
});
AppRegistry.registerComponent('MyApplicationName', () => StorybookUI);
```

Create a file named `addons.js` file in `storybook` directory to use addons. Here is a list of default addons:

```js
import '@storybook/addon-actions';
import '@storybook/addon-links';
```

Then write your first story in the `stories` directory like this:

```js
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

storiesOf('CenteredView')
  .add('default view', () => (
    <CenteredView>
      <Text>Hello Storybook</Text>
    </CenteredView>
  ));
```

Then add following NPM script into your `package.json` file:

```json
{
  "scripts": {
    "storybook": "storybook start -p 7007"
  }
}
```
