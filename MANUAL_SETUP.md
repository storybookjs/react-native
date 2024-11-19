# Setup for v8 React Native Storybook

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

# Manual setup

You may wish to setup everything yourself, you can use the following guide to do so.

# Install dependencies

**Expo**

```sh
expo install @storybook/react-native @react-native-async-storage/async-storage react-dom react-native-safe-area-context react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
```

**React native CLI**

```sh
yarn add -D @storybook/react-native @react-native-async-storage/async-storage react-native-safe-area-context react-dom react-native-reanimated react-native-gesture-handler @gorhom/bottom-sheet react-native-svg
```

**IOS**

If running on an IOS device with rn cli make sure to run pod install first

```sh
cd ios; pod install; cd ..;
```

# Configuration

## .storybook

Create a folder called `.storybook` with files: `main.ts`, `preview.tsx`, `index.tsx`

You can use this one-liner to quickly create those files:

```console
mkdir .storybook && touch .storybook/main.ts .storybook/preview.tsx .storybook/index.tsx
```

### .storybook/main.ts

```ts
import { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [],
};

export default main;
```

### .storybook/preview.tsx

```ts
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {},
  decorators: [],
};

export default preview;
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

### generate storybook.requires.ts

run `yarn storybook-generate`

### .storybook/index.tsx

```tsx
import { view } from './storybook.requires';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

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
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig);
```

**React native**

```js
const { getDefaultConfig } = require('@react-native/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = withStorybook(defaultConfig);
```

**Add a stories file**

In the `main.ts` we created the path was set as `../components/\*_/_.stories.?(ts|tsx|js|jsx)` which matches any .stories file inside the components folder.

Create a file called `Button.stories.tsx` in the components folder.

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'react-native';

const meta = {
  title: 'React Native Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Hello world',
  },
};
```

This is a simple example you can do more by adding addons and exploring more features of storybook.

## Render Storybook

The only thing left to do is return Storybook's UI in your app entry point (such as `App.tsx`) like this:

```tsx
export { default } from './.storybook';
```

If you want to be able to swap easily between storybook and your app, have a look at this [blog post](https://dev.to/dannyhw/how-to-swap-between-react-native-storybook-and-your-app-p3o)

# Run storybook

Then you can run `yarn ios` or `yarn android` to run the app like normal.
