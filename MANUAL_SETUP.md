# Setup for v6 React Native Storybook

Before getting into the guide consider using a template for a simpler setup process.

**Prebuilt Templates:**

For expo you can use this [template](https://github.com/dannyhw/expo-template-storybook) with the following command

```sh
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

For react native cli you can use this [template](https://github.com/dannyhw/react-native-template-storybook)

```sh
npx react-native init MyApp --template react-native-template-storybook
```

You can also choose to use a bash script if you prefer, however it is more involved.

- [expo setup script](https://gist.github.com/dannyhw/92b3ff0d6ccaead9df2820a507154b87)
- [rn-cli setup script](https://gist.github.com/dannyhw/9b84973dcc6ff4fa2e86e32d571d294e)

# Manual setup

You may wish to setup everything yourself, you can use the following guide to do so.

# Install dependencies

**Expo**

```sh
expo install @storybook/react-native @react-native-async-storage/async-storage react-dom react-native-safe-area-context
```

**React native CLI**

```sh
yarn add -D @storybook/react-native @react-native-async-storage/async-storage react-native-safe-area-context react-dom
```

**IOS**

If running on an IOS device with rn cli make sure to run pod install first

```sh
cd ios; pod install; cd ..;
```

# Configuration

## .storybook

Create a folder called `.storybook` with files: `main.js`, `preview.js`, `Storybook.tsx`

You can use this one-liner to quickly create those files:

```console
mkdir .storybook && touch .storybook/main.js .storybook/preview.js .storybook/index.tsx
```

### .storybook/main.js

```js
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
};
```

### .storybook/preview.js

```js
export const decorators = [];
export const parameters = {};
```

## package.json

Add the following to the scripts in your package.json.

```json
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories"
  }
}
```

### generate storybook.requires.js

run `yarn storybook-generate`

### .storybook/index.tsx

```jsx
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({});

export default StorybookUIRoot;
```

## metro.config.js

Update your metro config to enable `transformer.unstable_allowRequireContext`

**Expo**

First create metro config file if you don't have it yet.

```sh
npx expo customize metro.config.js
```

Then set `transformer.unstable_allowRequireContext` to true

```js
const { getDefaultConfig } = require('expo/metro-config');

const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.unstable_allowRequireContext = true;

module.exports = defaultConfig;
```

**React native**

```js
const { generate } = require('@storybook/react-native/scripts/generate');

generate({
  configPath: path.resolve(__dirname, './.storybook'),
});

module.exports = {
  /* existing config */
  transformer: {
    unstable_allowRequireContext: true,
  },
};
```

**Add a stories file**

In the main.js we created the path was set as `../components/**/*.stories.?(ts|tsx|js|jsx)` which matches any .stories file inside the components folder.

Create a file called `Button.stories.tsx` in the components folder.

```jsx
import { Button } from 'react-native';

export default {
  title: 'React Native Button',
  component: Button,
};

export const Basic = {
  args: {
    title: 'Hello world',
  },
};
```

This is a simple example you can do more by adding addons and exploring more features of storybook.

## Render Storybook

The only thing left to do is return Storybook's UI in your app entry point (such as `App.js`) like this:

```jsx
export { default } from './.storybook';
```

If you want to be able to swap easily between storybook and your app, have a look at this [blog post](https://dev.to/dannyhw/how-to-swap-between-react-native-storybook-and-your-app-p3o)

# Run storybook

Then you can run `yarn ios` or `yarn android` to run the app like normal.
