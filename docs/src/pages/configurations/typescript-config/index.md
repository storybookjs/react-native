---
id: 'typescript-config'
title: 'TypeScript Config'
---

This is a central reference for using Storybook with TypeScript.

## Typescript configuration presets

The easiest way to write and configure your stories in TypeScript is by using [Storybook presets](../../presets/introduction).

If you're using Create React App (CRA) and have configured it to work with TS, you should use the [CRA preset](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app), which configures Storybook to reuse CRA's TS handling.

If you're not using CRA, the next best thing is to use the [Typescript preset](https://github.com/storybookjs/presets/tree/master/packages/preset-typescript), which configures `ts-loader` under the hood.

If you need more control than the TypeScript preset offers, read on for manual configuration instructions.

> If using TypeScript, some addons require features available in TS version 3.4+.

## Setting up TypeScript with awesome-typescript-loader

### Dependencies you may need

```bash
yarn add -D typescript
yarn add -D awesome-typescript-loader
yarn add -D @storybook/addon-info react-docgen-typescript-loader # optional but recommended
yarn add -D jest "@types/jest" ts-jest #testing
```

We have had the best experience using `awesome-typescript-loader`, but other tutorials may use `ts-loader`, so be sure to configure accordingly. You can even use `babel-loader` with a `ts-loader` configuration.

### Setting up TypeScript to work with Storybook

We [configure storybook's webpack](/configurations/custom-webpack-config/#full-control-mode--default) by changing `.storybook/main.js`:

```js
module.exports = {
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
```

The above example shows a working Webpack config with the [TSDocgen plugin](https://github.com/strothj/react-docgen-typescript-loader) integrated. This plugin is not necessary to use Storybook and the section marked `// optional` can be safely removed if the features of TSDocgen are not required.

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "outDir": "build/lib",
    "module": "commonjs",
    "target": "es5",
    "lib": ["es5", "es6", "es7", "es2017", "dom"],
    "sourceMap": true,
    "allowJs": false,
    "jsx": "react",
    "moduleResolution": "node",
    "rootDirs": ["src", "stories"],
    "baseUrl": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true,
    "declaration": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "scripts"]
}
```

This is for the default configuration where `/stories` is a peer of `src`. If you have them all in `src`, you may wish to replace `"rootDirs": ["src", "stories"]` above with `"rootDir": "src",`.

## Setting up TypeScript with babel-loader

### A note for Create React App users

Please use [`@storybook/preset-create-react-app`](https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app) for full compatibility with [Create React App](https://create-react-app.dev/) features - which includes TypeScript support.

### Setting up TypeScript to work with Storybook

The following code uses [`babel-preset-react-app`](https://github.com/facebook/create-react-app/tree/master/packages/babel-preset-react-app).

We will create a [custom Webpack config](/configurations/custom-webpack-config/) by creating editing/creating the `.storybook/main.js`:

```js
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [['react-app', { flow: false, typescript: true }]],
      },
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
```

### `tsconfig.json`

If your stories are outside the `src` folder, for example the `stories` folder in root, then `"rootDirs": ["src", "stories"]` needs to be added to be added to `compilerOptions` so it knows what folders to compile. Make sure `jsx` is set to preserve. Should be unchanged.

## Create a TSX storybook index

The default storybook index file is `stories/index.stories.js` -- you'll want to rename this to `stories/index.stories.tsx`.

## Using TypeScript with the TSDocgen addon

The very handy [Storybook Info addon](https://github.com/storybookjs/storybook/tree/master/addons/info) autogenerates prop tables documentation for each component, however it doesn't work with Typescript types. The current solution is to use [react-docgen-typescript-loader](https://github.com/strothj/react-docgen-typescript-loader) to preprocess the TypeScript files to give the Info addon what it needs. The webpack config above does this, and so for the rest of your stories you use it as per normal:

```js
import * as React from 'react';
import TicTacToeCell from './TicTacToeCell';

export default {
  title: 'Components',
  parameters: {
    info: { inline: true },
  },
};

export const TicTacToeCell = () => (
  <TicTacToeCell value="X" position={{ x: 0, y: 0 }} />,
);
```

## Customizing Type annotations/descriptions

Please refer to the [react-docgen-typescript-loader](https://github.com/strothj/react-docgen-typescript-loader) docs for writing prop descriptions and other annotations to your Typescript interfaces.

Additional annotation can be achieved by setting a default set of info parameters in `.storybook/preview.js`:

```ts
import { addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

addDecorator(
  withInfo({
    styles: {
      header: {
        h1: {
          marginRight: '20px',
          fontSize: '25px',
          display: 'inline',
        },
        body: {
          paddingTop: 0,
          paddingBottom: 0,
        },
        h2: {
          display: 'inline',
          color: '#999',
        },
      },
      infoBody: {
        backgroundColor: '#eee',
        padding: '0px 5px',
        lineHeight: '2',
      },
    },
    inline: true,
    source: false,
  })
);
```

Note: Component docgen information can not be generated for components that are only exported as default. You can work around the issue by exporting the component using a named export.

## Setting up Jest tests

The ts-jest [README](https://github.com/kulshekhar/ts-jest) explains pretty clearly how to get Jest to recognize TypeScript code.

This is an example `jest.config.js` file for jest:

```js
module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};
```

## Building your TypeScript Storybook

You will need to set up some scripts - these may help:

```json
  "scripts": {
    "start": "react-scripts-ts start",
    "build": "npm run lint && npm run build-lib && build-storybook",
    "build-lib-watch": "tsc -w",
    "build-lib": "tsc && npm run copy-css-to-lib && npm run copy-svg-to-lib && npm run copy-png-to-lib && npm run copy-woff2-to-lib",
    "test": "react-scripts-ts test --env=jsdom",
    "test:coverage": "npm test -- --coverage",
    "eject": "react-scripts-ts eject",
    "storybook": "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    "copy-css-to-lib": "cpx \"./src/**/*.css\" ./build/lib",
    "copy-woff2-to-lib": "cpx \"./src/**/*.woff2\" ./build/lib",
    "copy-svg-to-lib": "cpx \"./src/**/*.svg\" ./build/lib",
    "copy-png-to-lib": "cpx \"./src/**/*.png\" ./build/lib",
    "lint": "tslint -c tslint.json 'src/**/*.{ts,tsx}'"
  },
```

## Related Issues and Helpful Resources

- [Storybook, React, TypeScript and Jest](https://medium.com/@mtiller/storybook-react-typescript-and-jest-c9059ea06fa7)
- [React, Storybook & TypeScript](http://www.joshschreuder.me/react-storybooks-with-typescript/)
