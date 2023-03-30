# Migration

- [Migration](#migration)
  - [From version 5.3.x to 6.5.x](#from-version-53x-to-65x)
    - [Additional dependencies](#additional-dependencies)
      - [Controls (the new knobs)](#controls-the-new-knobs)
    - [.storybook Folder](#storybook-folder)
    - [Update your index.js file](#update-your-indexjs-file)
    - [Add a main.js and preview.js](#add-a-mainjs-and-previewjs)
    - [Scripts in package.json](#scripts-in-packagejson)
    - [Update your metro config](#update-your-metro-config)
    - [Convert your stories to CSF](#convert-your-stories-to-csf)
    - [Theming](#theming)
    - [Test ids for tabs](#test-ids-for-tabs)
    - [The server](#the-server)

## From version 5.3.x to 6.5.x

### Additional dependencies

To make storybook more compatible with core storybook libraries we are using some new dependencies. You will need to add these to your project.

```sh
yarn add -D @storybook/react-native @storybook/core-common @react-native-async-storage/async-storage react-native-safe-area-context react-dom
```

#### Controls (the new knobs)

To use the controls addon you will need these dependencies

```sh
yarn add -D @storybook/addon-ondevice-controls @storybook/addons @storybook/addon-controls @react-native-community/datetimepicker @react-native-community/slider 
```

### .storybook Folder

Rename the storybook folder to .storybook

### Update your index.js file

In 6.5 we use a script to generate your imports for stories and addons. This uses the new main.js file to generate the storybook.requires.js file. This file is then imported into the index.js file.

Remove the configure call, story imports and addon imports and reduce the index file to have this content. The most important thing is to import the `storybook.requires` file.

Also if your Storybook folder is called `storybook` you should change it to `.storybook` .

```js
// .storybook/index.js
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';

const StorybookUIRoot = getStorybookUI({
  // options go here
});

export default StorybookUI
```

### Add a main.js and preview.js

In your `.storybook` folder add the `main.js` and `preview.js` files. 

In the stories field of your `main.js` file update the regex to work for your project.

In the addons field list the addons you want to use, these must be compatible with React Native Storybook. Addons made for React Native are usually prefixed with `addon-ondevice`.

```jsx
// .storybook/main.js
module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-ondevice-backgrounds',
  ],
};
```

Move any global decorators and parameters your have to `preview.js` , if you don’t have any then just export an empty array for decorators and an empty object for parameters.

```jsx
// .storybook/preview.js
import { View } from 'react-native';

export const decorators = [
  // Using a decorator to apply padding for every story
  (StoryFn) => (
    <View style={{flex:1, padding:8}}>
      <StoryFn />
    </View>
  ),
];

export const parameters = {
  my_param: 'anything',
};
```

### Scripts in package.json

In storybook 6.5 there are some new binaries that generate your story imports and one that watches for new files.

You can add these scripts to your package.json file.

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories",
    "storybook-watch": "sb-rn-watcher",
  }
}
```

You'll want to run the generate script whenever you add a new story file. Alternatively you can keep the watcher running.

There are some options you can pass to the both these scripts. You can see them by running `yarn  sb-rn-get-stories --help` and `sb-rn-watcher --help`.

```
  .description('Getter and watcher for react native storybook')
  .option(
    '-c, --config-path <path>',
    'The path to your config folder relative to your project-dir',
    './.storybook'
  )
  .option('-a, --absolute', 'Use absolute paths for story imports');
```

### Update your metro config

We use the sbmodern resolver field in order to resolve the modern version of storybook packages. Doing this removes the polyfills that ship in commonjs modules and fixes multiple long standing issues such as the promises never resolving bug and more (caused by corejs promises polyfill).

**Expo**

First create metro config file if you don't have it yet. 
```sh
npx expo customize metro.config.js
```

Then add sbmodern to the start of the `resolver.resolverMainFields` list.

```js
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields.unshift('sbmodern');

module.exports = defaultConfig;
```

**React native**

```js
module.exports = {
  /* existing config */
  resolver: {
    resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
  },
};
```


### Convert your stories to CSF

Whilst storiesOf will still work it is now deprecated so we recommend that you convert your stories to CSF.

There is a codemod for your convenience which should automatically make the code changes for you (make sure to update the glob to fit your files):

```sh
npx storybook@next migrate storiesof-to-csf --glob="src/**/*.stories.tsx"
```

Replace the storiesOf API with a default export that defines the title and component of your stories. Replace the add method with named exports that define each story. If you have any parameters or decorators, you can add them to the default export or to stories. 

```jsx
// Before
storiesOf('Button', module)
  .addParameters({ myParam: "anything" })
  .addDecorator((Story)=> <Wrapper>{Story}</Wrapper>)
  .add('primary', () => <Button primary label="Button" />)
  .add('secondary', () => <Button label="Button" />);

// After
export default {
  title: 'Button',
  component: Button,

  // for all stories in this file
  parameters: {  myParam: "anything" },
};

export const Primary = { args: { primary: true, label: "button" } };

export const Secondary = { 
  // this gives the property "label" the default value "button"
  args: { label: "button" } 
  
  // for just this story
  decorators: [(Story) => (<Wrapper><Story/></Wrapper>)],
  parameters: {myParam: "something else"} 
};

```

### Theming

The theme structure in Storybook 6.5 provides much more granular control over
more of the Storybook UI, including addons, this unfortunately makes it
difficult to provide backwards compatibility. If you were previously using a
custom theme you will now need to migrate it to the new theme.

The themeable values are comprehensively listed in the `Theme` type in
[theme.ts](https://github.com/storybookjs/react-native/blob/next-6.0/app/react-native/src/preview/components/Shared/theme.ts).

Below the old theme keys are listed against a comparable key in the new theme,
although bear in mind that there are many more aspects of the UI that can be
themed now, this is just to help get you started:

- `backgroundColor`: `backgroundColor`
- `storyListBackgroundColor`: `panel.backgroundColor`
- `listItemTextColor`: `storyList.storyTextColor`
- `listItemActiveColor`: `storyList.storySelectedBackgroundColor`
- `listItemActiveTextColor`: `storyList.storySelectedTextColor`
- `headerTextColor`: `storyList.headerTextColor`
- `labelColor`: `inputs.labelTextColor`
- `borderColor`: `panel.borderColor`, `navigation.borderColor`, `inputs.text.borderColor`, `inputs.radio.borderColor`, `inputs.swatch.borderColor`
- `previewBorderColor`: The preview no longer has a border and uses an elevation shadow instead
- `buttonTextColor`: `tabs.inactiveTextColor`, `button.primary.textColor`, `button.secondary.textColor`
- `buttonActiveTextColor`: `tabs.activeTextColor`
- `secondaryLabelColor`: `inputs.slider.valueTextColor`


### Test ids for tabs

The tabs were renamed to Sidebar, Canvas and Addons. So the test ids for the tabs are now:

BottomMenu.Sidebar, BottomMenu.Canvas, BottomMenu.Addons

And their text was updated to SIDEBAR, CANVAS, ADDONS.

### The server

The server is a package called `@storybook/react-native-server` and its an optional companion app that lets you control the React Native Storybook UI thats on your device via a web UI.

In this version the configuration for that was changes slightly.

Now to configure the server you'll add a `.storybook_server` folder with a `main.js`. In this file you should put the same stories regex that you have in your `.storybook/main.js` file.

```jsx
module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  env: () => ({}),
  addons: ['@storybook/addon-essentials'],
};
```

Then in `package.json` you'll need a new script

```json
"start-server": "react-native-storybook-server"
```

For more information about this please read this [blog post](https://dev.to/dannyhw/quick-guide-for-storybookreact-native-server-v6-4nl2).
