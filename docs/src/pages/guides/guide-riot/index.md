---
id: 'guide-riot'
title: 'Storybook for Riot'
---

## Automatic setup

You may have tried to use our quick start guide to setup your project for Storybook.
If it failed because it couldn't detect you're using riot, you could try forcing it to use riot:

```sh
npx -p @storybook/cli sb init --type riot
```

## Manual setup

If you want to set up Storybook manually for your Angular project, this is the guide for you.

## Step 1: Add dependencies

### Add @storybook/riot

Add `@storybook/riot` to your project. To do that, run:

```sh
npm install @storybook/riot --save-dev
```

### Add riot, @babel/core, and babel-loader

Make sure that you have `riot`, `@babel/core`, and `babel-loader` in your dependencies as well because we list these as a peer dependencies:

```sh
npm install riot babel-loader @babel/core --save-dev
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
import { configure } from '@storybook/riot';

configure(require.context('../src', true, /\.stories\.js$/), module);
```

That will load all the stories underneath your `../src` directory that match the pattern `*.stories.js`. We recommend co-locating your stories with your source files, but you can place them wherever you choose.

## Step 4: Storybook TypeScript configuration

`@storybook/riot` is using [ForkTsCheckerWebpackPlugin](https://github.com/Realytics/fork-ts-checker-webpack-plugin) to boost the build performance.
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

Now create a `../src/index.stories.js` file, and write your first story like this:

```js
import { tag, mount } from '@storybook/riot';
import SimpleTestRaw from './SimpleTest.txt'; //can be loaded as string if you prefer
import './AnotherTest.tag';
//if you need to import .tag files as text, just use the raw-loader instead of the riot-tag-loader

export default { title: 'My Component' };
  
// the template is compiled below
export const builtWithTag = () => (
  tag('test', '<div>simple test ({ opts.value })</div>', '', '', () => {}) &&
  mount('test', { value: 'with a parameter' })
);

// tags[0] will be the parent tag, always
// you can leave out the root tag, if we find out that the new root tag
// is a built-in html tag, it will be wrapped
export const builtAsString = () => ({
  tags: ['<test><div>simple test</div></test>']
});

// the component is a string, it will be instantiated without params
// e.g. <SimpletestRaw/>
export const builtFromRawImport = () => SimpleTestRaw;

// the comprehensive form is this one
// list all the possible tags (the root element is in the content)
// then scenario is compiled and executed
// WARN : the tag file root element must have exactly the same name (or else you will see nothing)
export const builtFromTagsAndScenario = () => ({
  tags: [{ content: SimpleTestRaw, boundAs: 'mustBeUniquePlease' }],
  scenario:
    '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
});

// the tag is already compiled before running the js
// the tag name 'anothertest' must match exactly the root tag inside the tag file
// must be lower case
export const builtFromThePrecompilation = () => mount('anothertest', {});
```

Each story is a single state of your component. In the above case, there are two stories for the demo button component:

```plaintext
My Component
  ├── Built With Tag
  ├── Built As String
  ├── Built From Raw Import
  ├── Built From Tags And Scenario
  └── Built From The Precompilation
```

## Finally: Run your Storybook

Now everything is ready. Run your storybook with:

```sh
npm run storybook
```

Storybook should start, on a random open port in dev-mode.

Now you can develop your components and write stories and see the changes in Storybook immediately since it uses Webpack's hot module reloading.
