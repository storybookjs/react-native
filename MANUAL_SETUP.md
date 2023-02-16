# Setup for v6 React Native Storybook

Before getting into the guide consider using a template for a simpler setup process.

**Prebuilt Templates:**

For expo you can use this [template](https://github.com/dannyhw/expo-template-storybook) with the following command

```sh
expo init --template expo-template-storybook AwesomeStorybook
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
expo install @storybook/react-native@next @storybook/core-common @react-native-async-storage/async-storage
```

**React native CLI**

```sh
yarn add -D @storybook/react-native@next @storybook/core-common @react-native-async-storage/async-storage react-native-safe-area-context
```

**IOS**

If running on an IOS device make sure to run pod install first

```sh
cd ios; pod install; cd ..;
```

# Configuration

## .storybook

Create a folder called `.storybook` with files: `main.js`, `preview.js`, `Storybook.tsx`

You can use this one-liner to quickly create those files:
```console
mkdir .storybook && cd .storybook && touch main.js preview.js Storybook.tsx
```

### main.js

```js
module.exports = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)'
  ],
  addons: [],
};
```

### preview.js

```js
export const decorators = [];
export const parameters = {};
```

### Storybook.tsx

```jsx
import { getStorybookUI } from '@storybook/react-native';

import './storybook.requires';

const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;
```

## metro.config.js

Update your metro config to include sbmodern in the resolverMainFields. 

On expo you might need create the metro.config.js file.

```js
module.exports = {
  /* existing config */
  resolver: {
    resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
  },
};
```

## package.json

Add the following to the scripts in your package.json, we use the name `prestart` to cause the script to run before every `yarn start`.

```json
{
  "scripts": {
    "prestart": "sb-rn-get-stories",
    "storybook-watcher": "sb-rn-watcher",
  }
}
```


# Adding stories

To render storybook update your App.tsx file to export the UI component.

```js
import StorybookUIRoot from './.storybook/Storybook';
export { StorybookUIRoot as default };
```

**Add a stories file**

In the main.js we created the path was set as `../components/**/*.stories.?(ts|tsx|js|jsx)` which matches any .stories file inside the components folder.

Create a file called `Button.stories.tsx` in the components folder.

```jsx
import {Button} from 'react-native';

export default {
  title: 'React Native Button',
  component: Button,
  args: {
    title: 'Hello world',
  },
};

export const Basic = args => <Button {...args} />;
```

This is a simple example you can do more by adding addons and exploring more features of storybook.


# Run storybook

To run storybook first generate the stories list:

```sh
yarn sb-rn-get-stories
```

Then you can run `yarn ios` or `yarn android` to run the app.
