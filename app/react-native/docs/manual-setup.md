# Manual Setup

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

If your using expo you don't need to use the register component call and you can just do `export default StorybookUIRoot`

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

## Storybook server for react native

React native server makes it possible to use some of the web storybook features with react native. You can also control multiple devices at once and it could be beneficial for you depending on your use case.

To get the server setup first install it

`npm install --save-dev @storybook/react-native-server`

and add following NPM script into your `package.json` file:

```json
{
  "scripts": {
    "storybook": "start-storybook -p 7007"
  }
}
```

If you want to have addons inside browser, create a file named `addons.js` in the `storybook` folder. For example:

**storybook/addons.js**

```js
import '@storybook/addon-actions';
import '@storybook/addon-links';
```
