# StoryShots [![CircleCI](https://circleci.com/gh/storybooks/storyshots.svg?style=shield)](https://circleci.com/gh/storybooks/storyshots)

Jest Snapshot Testing for [Storybook](https://getstorybook.io/).<br/>
(Supports both [React](https://github.com/storybooks/react-storybook) and [React Native](https://github.com/storybooks/react-native-storybook) Storybook)

![StoryShots In Action](docs/storyshots-fail.png)

With StoryShots, you could use your existing Storybook stories as the input for Jest Snapshot Testing.

> Now, we don't ship a CLI tool for storyshots. Check version [2.x](https://github.com/storybooks/storyshots/tree/v2.1.0) for that.

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
* Otherwise check this Egghead [lesson](https://egghead.io/lessons/javascript-test-javascript-with-jest).

## Configure Storyshots

Create a new test file with the name `Storyshots.test.js`. (Or whatever the name you prefer).
Then add following content to it:

```js
import initStoryshots from 'storyshots';
initStoryshots();
```

That's all.

Now run your Jest test command. (Usually, `npm test`.) Then you can see all of your stories are converted as Jest snapshot tests.

![](docs/storyshots.png)

## Options

### `configPath`

By default Storyshots assume the default config directory path for your project as below:

* For React Storybook: `.storybook`
* For React Native Storybook: `storybook`

If you are using a different config directory path, you could change it like this:

```js
initStoryshots({
  configPath: '.my-storybook-config-dir'
});
```

### `suit`

By default, we group stories inside Jest test suit called "StoryShots". You could change it like this:

```js
initStoryshots({
  suit: 'MyStoryShots'
});
```

### `storyRegex`

If you'd like to only run a subset of the stories for your snapshot tests:

```js
initStoryshots({
  storyRegex: /buttons/
});
```

Here is an example of [a regex](https://regex101.com/r/vkBaAt/2) which does not pass if `"Relay"` is in the name: `/^((?!(r|R)elay).)*$/`.
