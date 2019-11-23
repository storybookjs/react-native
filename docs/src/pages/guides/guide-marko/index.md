---
id: 'guide-marko'
title: 'Storybook for Marko'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using marko, you could try forcing it to use marko:

```sh
npx -p @storybook/cli sb init --type marko
```

## Manual setup

If you want to set up Storybook manually for your marko project, this is the guide for you.

## Step 1: Add dependencies

### Add @storybook/marko

Add `@storybook/marko` to your project. To do that, run:

```sh
npm install @storybook/marko --save-dev
```

### Add marko, @babel/core and babel-loader

Make sure that you have `marko`, `@babel/core`, and `babel-loader` in your dependencies as well because we list these as a peer dependencies:

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

```js
import { configure } from '@storybook/marko';

configure(require.context('../src', true, /\.stories\.js$/), module);
```

That will load all the stories underneath your `../src` directory that match the pattern `*.stories.js`. We recommend co-locating your stories with your source files, but you can place them wherever you choose.

## Step 4: Write your stories

Now create a `../src/index.stories.js` file, and write your first story like this:

```js
import Button from '../components/button/index.marko';

export default { title: 'Button' }

export const withText = () => ({
  component: Button,
  input: { text 'some text' }
});

export const withEmoji = () => ({
  component: Button,
  input: { text '😀 😎 👍 💯' }
});
```

Each story is a single state of your component. In the above case, there are two stories for the demo button component:

```plaintext
Button
  ├── With Text
  └── With Emoji
```

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
