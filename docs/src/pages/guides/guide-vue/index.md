---
id: 'guide-vue'
title: 'Storybook for Vue'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using vue, you could try forcing it to use vue:

```sh
npx -p @storybook/cli sb init --type vue
```

## Manual setup

If you want to set up Storybook manually for your Vue project, this is the guide for you.

## Step 1: Add dependencies

### Add @storybook/vue

Add `@storybook/vue` to your project. To do that, run:

```sh
npm install @storybook/vue --save-dev
```

### Add peer dependencies

Make sure that you have `vue`, `vue-loader`, `vue-template-compiler`, `@babel/core`, `babel-loader` and `babel-preset-vue` in your dependencies as well, because we list these as a peer dependencies:

```sh
npm install vue --save
npm install vue-loader vue-template-compiler @babel/core babel-loader babel-preset-vue --save-dev
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
import { configure } from '@storybook/vue';

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
> import { configure } from '@storybook/vue';
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
>
>
> You might be using global components or vue plugins such as vuex, in that case you'll need to register them in this `config.js` file.
>
> <details>
>   <summary>details</summary>
>
> ```js
> import { configure } from '@storybook/vue';
>
> import Vue from 'vue';
>
> // Import Vue plugins
> import Vuex from 'vuex';
>
> // Import your global components.
> import Mybutton from '../src/stories/Button.vue';
>
> // Install Vue plugins.
> Vue.use(Vuex);
>
> // Register global components.
> Vue.component('my-button', Mybutton);
>
> function loadStories() {
>   // You can require as many stories as you need.
>   require('../src/stories');
> }
>
> configure(loadStories, module);
> ```
>
> This example registered your custom `Button.vue` component, installed the Vuex plugin, and loaded your Storybook stories defined in `../stories/index.js`.
>
> All custom components and Vue plugins should be registered before calling `configure()`.
>
> </details>


## Step 4: Write your stories

Now create a `../stories/index.js` file, and write your first story like this:

```js
import Vue from 'vue';
import { storiesOf } from '@storybook/vue';
import MyButton from './Button.vue';

storiesOf('Button', module)
  .add('with text', () => '<my-button>with text</my-button>')
  .add('with emoji', () => '<my-button>😀 😎 👍 💯</my-button>')
  .add('as a component', () => ({
    components: { MyButton },
    template: '<my-button :rounded="true">rounded</my-button>'
  }));
```

Each story is a single state of your component. In the above case, there are three stories for the demo button component:

```plaintext
Button
  ├── with text
  ├── with emoji
  └── as a component
```

> If your story is returning a plain template you can only use globally registered components.
>
> To register them, use `Vue.component('my-button', Mybutton)` in your `config.js` file.
>
> <details>
>   <summary>details</summary>
>
> If your story returns a plain string like below, you will need to register globally each VueJs component that it uses. 
>
> ```js
>  .add('with text', () => '<my-component>with text</my-component>')
> ```
>
> In big solutions, globally registered components can conflict with each other.
>
> Here are two other ways to use components in your stories without globally registering them.
>
> - register components locally in the "components" member of the vue component object. See the story "as a component" above.
> - use a JSX render function like below. No need to register anything.
>
> ```jsx
>   .add('with text', () => ({
>      render: h => <my-component>with text</my-component>
>   }))
> ```
>
> </details>

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
