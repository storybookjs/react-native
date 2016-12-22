# StoryShots

Jest Snapshot Testing for [React Storybook](https://github.com/kadirahq/react-storybook)

![StoryShots In Action](docs/screenshot.png)

With StoryShots, you could use your existing Storybook stories as the input for Jest Snapshot Testing.

> Now, we don't ship a CLI tool for storyshots. Check version [2.x](#) for that.

## Getting Started

First of all, you need to use the latest version of React Storybook.
So, do this:

```sh
npm update @kadira/storybook
```

Then add the following NPM module into your app.

```sh
npm i -D storyshots
```

## Configure your app for Jest

Usually, you might already have completed this step. If not, here are some resources for you.

* If you are using Create React App, it's already configured for Jest. You just need to create a filename with the extension `.test.js`.
* Otherwise check this EggHead [lesson](https://egghead.io/lessons/javascript-test-javascript-with-jest).

## Configure Storyshots

Create a new test file with the name `Storyshots.test.js`. (Or whatever the name you prefer).
Then add following content to it:

```js
import initStoryshots from '@kadira/storyshots';
initStoryshots();
```

That's all.

Now run your Jest test command. (Usually, `npm test`.) Then you can see all of your stories are converted as Jest snapshot tests.

![](docs/storyshots.png)

## Options

### configPath

By default Storyshots assume the default config directory path for your project as below:

* For React Storybook: `.storybook`
* For React Native Storybook: `storybook`

If you are using a different config directory path, you could change it like this:

```js
initStoryshots({
  configPath: '.my-storybook-config-dir'
});
```

### suit

By default, we group stories inside Jest test suit called "StoryShots". You could change it like this:

```js
initStoryshots({
  suit: 'MyStoryShots'
});
```
