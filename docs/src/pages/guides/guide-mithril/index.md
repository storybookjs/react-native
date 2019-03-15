---
id: 'guide-mithril'
title: 'Storybook for Mithril'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using mithril, you could try forcing it to use mithril:

```sh
npx -p @storybook/cli sb init --type mithril
```

## Manual setup

If you want to set up Storybook manually for your mithril project, this is the guide for you.

## Step 1: Add dependencies

### Add @storybook/mithril

Add `@storybook/mithril` to your project. To do that, run:

```sh
npm install @storybook/mithril --save-dev
```

### Add mithril, @babel/core and babel-loader

Make sure that you have `mithril`, `@babel/core`, and `babel-loader` in your dependencies as well because we list these as a peer dependencies:

```sh
npm install mithril --save
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

```js
import { configure } from '@storybook/mithril';

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
> ```js
> import { configure } from '@storybook/mithril';
> 
> function loadStories() {
>   const req = require.context('../stories', true, /\.stories\.js$/);
>   req.keys().forEach(filename => req(filename));
> }
> 
> configure(loadStories, module);
> ```
> 
> </details>

## Step 4: Write your stories

Now create a `../stories/index.js` file, and write your first story like this:

```js
/** @jsx m */

import m from 'mithril';
import { storiesOf } from '@storybook/mithril';
import { Button } from '<your-button>';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with emoji', () => (
    <Button><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Button>
  ));
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
