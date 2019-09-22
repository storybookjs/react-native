---
id: 'guide-svelte'
title: 'Storybook for Svelte'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using svelte, you could try forcing it to use svelte:

```sh
npx -p @storybook/cli sb init --type svelte
```

## Manual setup

If you want to set up Storybook manually for your Svelte project, this is the guide for you.

> It is very important to remember that Svelte components are precompiled from `.svelte` or `.html` files to vanilla javascript, so there is no 'runtime'.

## Step 1: Add dependencies

### Add @storybook/svelte

Add `@storybook/svelte` to your project. To do that, run:

```sh
npm install @storybook/svelte --save-dev
```

### @babel/core, and babel-loader

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

```js
import { configure } from '@storybook/svelte';

configure(require.context('../src', true, /\.stories\.js$/), module);
```

That will load all the stories underneath your `../src` directory that match the pattern `*.stories.js`. We recommend co-locating your stories with your source files, but you can place them wherever you choose.

## Step 4: Write your stories

Now create a `../src/index.stories.js` file, and write your first story like this:

```js
import MyButton from '../components/MyButton.svelte';

export default { title: 'MyButton' }

export const withText = () => ({
  Component: MyButton,
  props: {
    buttonText: 'some text',
  },
});

export const withEmoji = () => ({
  Component: MyButton,
  props: {
    buttonText: '😀 😎 👍 💯',
  },
});
```

Svelte storybooks don't support using templates in a story yet. 
Instead, you can create a `.svelte` file to compose components together, or simply to access all normal Svelte functionality, like slots.

So you can create a story "view" file, essentially just a .svelte file to load your components into to test.

```html
<!-- MyButtonView  -->
<MyButton {rounded} on:click>
  {buttonText}
</Button>
```

In this example, the `on:click` that is heard on the `MyButton` component is simply passed up to the containing component `MyButtonView` using the svelte shorthand.
It's the equivalent to `on:click="fire('click', event)"`, but it's worth knowing about especially in this "component wrapper" scenario.

> If your component doesn't use slots, you don't need to do this, but if it does or some other svelte functionality that requires the component to exist in a svelte view, then this is how to do that.

You would then write a story for this "view" the exact same way you did with a component.

```js
import MyButtonView from '../views/MyButtonView.svelte';

export default { title 'Button' }

export const wrappedComponentExample = () => ({
  Components: MyButtonView,
  props: {
    buttonText: 'some text',
    rounded: true,
  },
  on: {
    click: (event) => {
      console.log('clicked', event);
    },
  },
});
```

Each story is a single state of your component. In the above case, there are two stories for the demo button component:

```plaintext
Button
  ├── With Text
  ├── With Emoji
  └── Wrapped Component Example
```

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
