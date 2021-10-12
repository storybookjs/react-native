# How to test the 6.0 alpha

## Setting up a new project from scratch

**Vanilla React Native:** Run the [setup script](https://gist.github.com/dannyhw/9b84973dcc6ff4fa2e86e32d571d294e) or follow this guide to do it step-by-step.

**Expo:** Run the [expo setup script](https://gist.github.com/dannyhw/92b3ff0d6ccaead9df2820a507154b87) or follow this guide to do it step-by-step.

This guide assumes that you have yarn, node, npm and npx and they are in your path so your
terminal can run them. The guide is for Mac/Linux, Windows might need slight adjustments. Contributions for a Windows guide are welcome!

First, create the project:

**Vanilla React Native**

```shell
npx react-native init RnSBSixAlpha --template react-native-template-typescript
cd RnSBSixAlpha
```

**Expo**

```shell
npm install --global expo-cli
expo init -t expo-template-blank-typescript appName
cd appName
```

Next, open the project in your chosen editor, here I use vscode

```shell
code .
```

Now install the react native storybook dependencies, here I'm installing all the available ondevice addons. You can just pick the addons you want to use.

**Vanilla React Native**

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
            @storybook/addon-controls
```

**Expo**

For Expo, we need to separately install the react native packages so Expo can maintain the compatibility for us.

```shell
expo install @storybook/react-native@next \
    @storybook/addon-ondevice-actions@next \
    @storybook/addon-ondevice-controls@next \
    @storybook/addon-ondevice-backgrounds@next \
    @storybook/addon-ondevice-notes@next \
    @storybook/addon-actions \
    @storybook/addon-controls \
    @react-native-async-storage/async-storage \
    @react-native-community/datetimepicker \
    @react-native-community/slider
```

Datetime picker, slider and addon-controls are required for controls to work. If you don't want controls you don't need to install these (controls is the knobs replacement).

Continue by updating your metro config to have `resolver:{resolverMainFields: ['sbmodern', 'browser', 'main']}`.
This enables us to use the modern build of storybook instead of the polyfilled versions.

**Vanilla React Native**

```shell
echo "/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['sbmodern', 'browser', 'main'],
  },
};" > metro.config.js
```

**Expo**

```shell
echo "const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields = [
  'sbmodern',
  ...defaultConfig.resolver.resolverMainFields,
];
defaultConfig.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: false,
  },
});
defaultConfig.watchFolders = [...defaultConfig.watchFolders, './.storybook'];
module.exports = defaultConfig;
" > metro.config.js;
```

Create .storybook/main and preview.js, here we use unix commands to set this up. If you are using windows then just make the .storybook folder and components folder then add the content for main.js and preview.js from those "echo '...' >" commands

```shell
mkdir .storybook
mkdir components
echo "module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)'
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

echo "import { getStorybookUI } from '@storybook/react-native';

import './storybook.requires';

const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;" >.storybook/Storybook.tsx

echo "import StorybookUIRoot from './.storybook/Storybook';
export { StorybookUIRoot as default };" > App.tsx
```

Now add `prestart: "sb-rn-get-stories"` and `"storybook-watcher": "sb-rn-watcher"` to your package json scripts.

If you want you can use this node script to do that for you

```shell
node -e 'const fs = require("fs");
const packageJSON = require("./package.json");
packageJSON.scripts = {
    ...packageJSON.scripts,
    prestart: "sb-rn-get-stories",
    "storybook-watcher": "sb-rn-watcher"
};
fs.writeFile("./package.json", JSON.stringify(packageJSON, null, 2), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(packageJSON));
  console.log("writing to " + "./package.json");
});';
```

If you're using macOS and vanilla React Native, run pod install:

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
  argTypes: {
    onPress: {action: 'pressed the button'},
  },
  args: {
    text: 'Hello world',
  },
};

export default MyButtonMeta;

type MyButtonStory = ComponentStory<typeof MyButton>;

export const Basic: MyButtonStory = args => <MyButton {...args} />;

" > components/Button/Button.stories.tsx
```

Run the stories auto detection which uses main.js to detect stories.

```shell
yarn sb-rn-get-stories
```

Now run your app as normal with `yarn ios` or `yarn android`
