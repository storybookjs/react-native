# StoryShots [![CircleCI](https://circleci.com/gh/kadirahq/storyshots.svg?style=shield)](https://circleci.com/gh/kadirahq/storyshots)

Snapshot Testing for [React Storybook](https://github.com/kadirahq/react-storybook)

![StoryShots in use](docs/screenshot.png)

With StoryShots, you could use your existing Storybook stories, as the input for snapshot testing. We do it by integrating Jest's snapshot testing support, directly into Storybook.

Read This: [Snapshot Testing in React Storybook](https://voice.kadira.io/snapshot-testing-in-react-storybook-43b3b71cec4f#.ndyuhcxhd)

**Migrating to version 2**: If you are already using version 1.x.x, follow [these steps](https://github.com/kadirahq/storyshots/blob/master/CHANGELOG.md#migrating-from-1xx) to migrate safely to 2.x.x.

## Getting Started

First of all, you need to use the latest version of React Storybook.
So, do this:

```sh
npm update @kadira/storybook
```

Then add the following NPM module into your app.

```sh
npm i -D @kadira/storyshots
```

Then, add a NPM script as follows:

```js
"scripts": {
  "test-storybook": "storyshots"
}
```

Then, run the following command:

```sh
npm run test-storybook
```

After that, you can see an output like this:

![First Run](docs/first-run.png)

This will create a set of snapshots, inside your Storybook config directory. You could publish them into GIT.

## UI Changes

Once you did a UI change, you could run StoryShots again with:

```sh
npm run test-storybook
```

Then, you can see changes with a diff view, like the following:

![UI Changes](docs/screenshot.png)

If these changes are intentional, you could update snapshots with:

```sh
npm run test-storybook -- -u
```

If not, you could try to correct it and re-run the above command.

## Key Features

StoryShots comes with some few features which help you to be productive and customize it, to suit your project.

### Interactive Mode

When you have a lot of UI changes, it's a good idea to check and update them, one by one. That's where our interactive mode comes in.
Run the following command:

```sh
npm run test-storybook -- -i
```

### Watch files

It's pretty useful to watch files and re-run StoryShots again. You can do that with the `-w` flag.

```sh
npm run test-storybook -- -w
```

### Grep Stories

You may don't want to storyshot each and every of your stories. If so, you could grep which stories you want to storyshot, by invoking the `-g` option:

```sh
npm run test-storybook -- -g "theme"
```

You can also use the `-x` option similarly to exclude some stories.

### Provide Custom Loaders

When we are running your stories, we don't use Webpack. So, we can't import files other than `.js` and `.json`.
This means actually, that we can't import your `.css` and `.png` files.

In order to fix this issue, we provide some mock loaders for few of the most common file types.
Here are [they](https://github.com/kadirahq/storyshots/blob/master/src/default_config/loaders.js).

But, we can't add all the loaders you might use. So, we allow you to customize it.
Instead of using our loaders, you could use a set of loaders you want.

For that, first create a file called `loaders.js` in your project root. Then add support to few loaders like this:

```js
var loaders = module.exports = {};

// to support css modules
loaders['css'] = function(path) {
  return {};
};

// to support jpeg files
loaders['jpeg'] = function(path) {
  return path;
}
```

Then, run StoryShots like this:

```
npm run test-storybook -- --loaders=loaders.js
```

> You could also update your original NPM script, according to the following instead.
> ~~~
> "test-storybook": "storyshots --loaders=loaders.js"
> ~~~

### Add Window and Global Polyfills

StoryShot doesn't use an actual browser, to run your code. Since your UI components may use browser features, we try to create a minimal browser environment with JSDom and with some common polyfills.

You can see them [here](https://github.com/kadirahq/storyshots/blob/master/src/default_config/polyfills.js).

But, you may also use some other browser features. Then, we allow you to add custom polyfills, replacing our own config.
Create a file like [this](https://github.com/kadirahq/storyshots/blob/master/src/default_config/polyfills.js) with your own polyfills.

Then, run StoryShots like this:

```sh
npm run test-storybook -- --polyfills=polyfills.js
```

## Other Features

Beside these main features, StoryShots comes with few other minor features.
You could see them by looking at the help:

```sh
npm run test-storybook -- -h
```
