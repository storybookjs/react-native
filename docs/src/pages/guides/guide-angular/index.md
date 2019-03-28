---
id: 'guide-angular'
title: 'Storybook for Angular'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using angular, you could try forcing it to use angular:

```sh
npx -p @storybook/cli sb init --type angular
```

## Manual setup

If you want to set up Storybook manually for your Angular project, this is the guide for you.

## Step 1: Add dependencies

### Add @storybook/angular

Add `@storybook/angular` to your project. To do that, run:

```sh
npm install @storybook/angular --save-dev
```

### Add @babel/core, and babel-loader

Make sure that you have `@babel/core`, and `babel-loader` in your dependencies as well because we list these as a peer dependencies:

```sh
npm install babel-loader @babel/core --save-dev 
```

## Step 2: Add a npm script

Then add the following NPM script to your `package.json` in order to start the storybook later in this guide:

```json
{
  "scripts": {
    "storybook": "start-storybook"
  }
}
```

## Step 3: Create the config file

For a basic Storybook configuration, the only thing you need to do is tell Storybook where to find stories.

To do that, create a file at `.storybook/config.js` with the following content:

```ts
import { configure } from '@storybook/angular';

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);
```

That'll load stories in `../stories/index.js`. You can choose where to place stories, you can co-locate them with source files, or place them in an other directory.

> Requiring all your stories becomes bothersome real quick, so you can use this to load all stories matching a glob.
> 
> <details>
>   <summary>details</summary>
> 
> ```ts
> import { configure } from '@storybook/angular';
> 
> function loadStories() {
>   const req = require.context('../stories', true, /\.stories\.ts$/);
>   req.keys().forEach(filename => req(filename));
> }
> 
> configure(loadStories, module);
> ```
> 
> </details>

## Step 4: Storybook TypeScript configuration

`@storybook/angular` is using [ForkTsCheckerWebpackPlugin](https://github.com/Realytics/fork-ts-checker-webpack-plugin) to boost the build performance. 
This makes it necessary to create a `tsconfig.json` file at `.storybook/tsconfig.json` with the following content:

```json
{
  "extends": "../tsconfig.json",
  "exclude": [
    "../src/test.ts",
    "../src/**/*.spec.ts",
    "../projects/**/*.spec.ts"
  ],
  "include": [
    "../src/**/*",
    "../projects/**/*"
  ]
}
```

## Step 5: Write your stories

Now create a `../stories/index.js` file, and write your first story like this:

```ts
import { storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

storiesOf('My Button', module)
  .add('with emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
    },
  }))
  .add('with emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
    },
  }));
```

Each story is a single state of your component. In the above case, there are two stories for the demo button component:

```plaintext
Button
  ├── with text
  └── with emoji
```

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
