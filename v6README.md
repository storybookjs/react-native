# How to test the 6.0 alpha

## Setting up a new project from scratch

First create a react native project

```shell
npx react-native init RnSBSixAlpha --template react-native-template-typescript
cd RnSBSixAlpha
```

Open up your react native project in your chosen editor, here I use vscode

```shell
code .
```


Now install the react native storybook dependencies, here I'm installing all the available ondevice addons. You can just pick the addons you want to use.

```shell
yarn add @storybook/react-native@next \
            @react-native-async-storage/async-storage \
            @storybook/addon-ondevice-actions@next \
            @storybook/addon-ondevice-controls@next \
            @storybook/addon-ondevice-backgrounds@next \
            @storybook/addon-ondevice-notes@next \
            @storybook/addon-actions \
            @react-native-community/datetimepicker \
            @react-native-community/slider \
            @storybook/addon-controls \
            util util-deprecate
```

Datetime picker, slider and addon-controls are required for controls to work. If you don't want controls you don't need to install these (controls is the knobs replacement).

Currently there is an issue where util and util deprecate are required, this is a dependency issue and will be fixed in the next alpha

Update your metro config to have `resolver:{resolverMainFields: ['sbmodern', 'main']}`.
This enables us to use the modern build of storybook instead of the polyfilled versions

```shell
echo "/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

echo "module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['sbmodern', 'main'],
  },
};" > metro.config.js

```

Create .storybook/main and preview.js, here we use unix commands to set this up. If you are using windows then just make the .storybook folder and components folder then add the content for main.js and preview.js from those "echo '...' >" commands

```shell
mkdir .storybook
mkdir components
echo "module.exports = {
  stories: [
    './components/**/*.stories.?(ts|tsx|js|jsx)'
  ],
   addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
  ],
};" > .storybook/main.js

echo "import {withBackgrounds} from '@storybook/addon-ondevice-backgrounds';

export const decorators = [withBackgrounds];
export const parameters = {
  backgrounds: [
    {name: 'plain', value: 'white', default: true},
    {name: 'warm', value: 'hotpink'},
    {name: 'cool', value: 'deepskyblue'},
  ],
};" > .storybook/preview.js

echo "import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorybookUI } from '@storybook/react-native';

import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  asyncStorage: AsyncStorage,
});

export default StorybookUIRoot;" > Storybook.tsx

echo "import StorybookUIRoot from './Storybook';
export { StorybookUIRoot as default };" > App.tsx
```

Now add `prestart: "sbn-get-stories"` and `"storybook-watcher": "sbn-watcher"` to your package json scripts.

If you want you can use this node script to do that for you

```shell
node -e 'const fs = require("fs");
const packageJSON = require("./package.json");
packageJSON.scripts = {
    ...packageJSON.scripts,
    prestart: "sbn-get-stories",
    "storybook-watcher": "sbn-watcher"
};
fs.writeFile("./package.json", JSON.stringify(packageJSON, null, 2), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(packageJSON));
  console.log("writing to " + "./package.json");
});';
```

If you're on macos then run pod install
```shell
cd ios; pod install; cd ..;
```

Add an example story and component in components

```shell
mkdir components/Button;
echo "import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface MyButtonProps {
  onPress: () => void;
  text: string;
}

export const MyButton = ({onPress, text}: MyButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'violet',
  },
  text: {color: 'black'},
});
" > components/Button/Button.tsx;

echo "import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react-native';
import {MyButton} from './Button';

const MyButtonMeta: ComponentMeta<typeof MyButton> = {
  title: 'MyButton',
  component: MyButton,
};

export default MyButtonMeta;

type MyButtonStory = ComponentStory<typeof MyButton>;

export const Basic: MyButtonStory = args => <MyButton {...args} />;
" > components/Button/Button.stories.tsx
```




Run the stories auto detection which uses main.js to detect stories.
```shell
yarn sbn-get-stories
```

Now run your app as normal with `yarn ios` or `yarn android`