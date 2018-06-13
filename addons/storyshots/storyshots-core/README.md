# StoryShots

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

StoryShots adds automatic Jest Snapshot Testing for [Storybook](https://storybook.js.org/).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![StoryShots In Action](docs/storyshots-fail.png)

To use StoryShots, you must use your existing Storybook stories as the input for Jest Snapshot Testing.

## Getting Started

Add the following module into your app.

```sh
npm install --save-dev @storybook/addon-storyshots
```

## Configure your app for Jest

Usually, you might already have completed this step. If not, here are some resources for you.

If you are using Create React App, it's already configured for Jest. You just need to create a filename with the extension `.test.js`.

If you aren't familiar with Jest, here are some resources:

-   [Getting Started - Jest Official Documentation](https://facebook.github.io/jest/docs/en/getting-started.html)
-   [Javascript Testing with Jest - Egghead](https://egghead.io/lessons/javascript-test-javascript-with-jest). ***paid content***

> Note: If you use React 16, you'll need to follow [these additional instructions](https://github.com/facebook/react/issues/9102#issuecomment-283873039).

### Configure Jest for React
StoryShots addon for React is dependent on [react-test-renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer), but
[doesn't](#deps-issue) install it, so you need to install it separately.

```sh
npm install --save-dev react-test-renderer
```

### Configure Jest for Angular
StoryShots addon for Angular is dependent on [jest-preset-angular](https://github.com/thymikee/jest-preset-angular), but
[doesn't](#deps-issue) install it, so you need to install it separately.

```sh
npm install --save-dev jest-preset-angular
```

If you already use Jest for testing your angular app - probably you already have the needed jest configuration.
Anyway you can add these lines to your jest config:
```js
module.exports = {
  globals: {
    __TRANSFORM_HTML__: true,
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', '.html'],
};
```
### Configure Jest for Vue
StoryShots addon for Vue is dependent on [jest-vue-preprocessor](https://github.com/vire/jest-vue-preprocessor), but
[doesn't](#deps-issue) install it, so you need to install it separately.

 ```sh
 npm install --save-dev jest-vue-preprocessor
 ```

If you already use Jest for testing your vue app - probably you already have the needed jest configuration.
Anyway you can add these lines to your jest config:
```js
module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@storybook/.*\\.vue$))',
  ],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json', 'node'],
};
```

### <a name="deps-issue"></a>Why don't we install dependencies of each framework ?
Storyshots addon is currently supporting React, Angular and Vue. Each framework needs its own packages to be integrated with Jest. We don't want people that use only React will need to bring other dependencies that do not make sense for them.

`dependencies` - will installed an exact version of the particular dep - Storyshots can work with different versions of the same framework (let's say React v16 and React v15), that have to be compatible with a version of its plugin (react-test-renderer).

`optionalDependencies` - behaves like a regular dependency, but do not fail the installation in case there is a problem to bring the dep.

`peerDependencies` - listing all the deps in peer will trigger warnings during the installation - we don't want users to install unneeded deps by hand.

`optionalPeerDependencies` - unfortunately there is nothing like this =(

For more information read npm [docs](https://docs.npmjs.com/files/package.json#dependencies)

## Configure Storyshots for HTML snapshots

Create a new test file with the name `Storyshots.test.js`. (Or whatever the name you prefer, as long as it matches Jest's config [`testMatch`](http://facebook.github.io/jest/docs/en/configuration.html#testmatch-array-string)).
Then add following content to it:

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

That's all.

Now run your Jest test command. (Usually, `npm test`.) Then you can see all of your stories are converted as Jest snapshot tests.

![Screenshot](docs/storyshots.png)


### Using `createNodeMock` to mock refs

`react-test-renderer` doesn't provide refs for rendered components. By
default, it returns null when the refs are referenced. In order to mock
out elements that rely on refs, you will have to use the
`createNodeMock` option [added to React](https://reactjs.org/blog/2016/11/16/react-v15.4.0.html#mocking-refs-for-snapshot-testing) starting with version 15.4.0.

Here is an example of how to specify the `createNodeMock` option in Storyshots:

```js
import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots'
import TextareaThatUsesRefs from '../component/TextareaThatUsesRefs'

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: (element) => {
      if (element.type === TextareaThatUsesRefs) {
        return document.createElement('textarea')
      }
    },
  }),
})
```

## Options

### `config`

The `config` parameter must be a function that helps to configure storybook like the `config.js` does.
If it's not specified, storyshots will try to use [configPath](#configPath) parameter.

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  config: ({ configure }) =>
    configure(() => {
      require('../stories/Button.story.js');
    }, module),
});
```

### `configPath`

By default, Storyshots assumes the config directory path for your project as below:

-   Storybook for React: `.storybook`
-   Storybook for React Native: `storybook`

If you are using a different config directory path, you could change it like this:

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  configPath: '.my-storybook-config-dir'
});
```

`configPath` can also specify path to the `config.js` itself. In this case, config directory will be
a base directory of the `configPath`. It may be useful when the `config.js` for test should differ from the
original one. It also may be useful for separating tests to different test configs:

```js
initStoryshots({
  configPath: '.my-storybook-config-dir/testConfig1.js'
});

initStoryshots({
  configPath: '.my-storybook-config-dir/testConfig2.js'
});
```


### `suite`

By default, Storyshots groups stories inside a Jest test suite called "Storyshots". You could change it like this:

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  suite: 'MyStoryshots'
});
```

### `storyKindRegex`

If you'd like to only run a subset of the stories for your snapshot tests based on the story's kind:

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  storyKindRegex: /^MyComponent$/
});
```

This can be useful if you want to separate the snapshots in directories next to each component. See an example [here](https://github.com/storybooks/storybook/issues/892).

If you want to run all stories except stories of a specific kind, you can write an inverse regex which is true for all kinds except those with a specific word such as `DontTest`

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  storyKindRegex:/^((?!.*?DontTest).)*$/
});
```

This can be useful while testing react components which make use of the findDomNode API since they always fail with snapshot testing
while using react-test-renderer see [here](https://github.com/facebook/react/issues/8324)

### `storyNameRegex`

If you'd like to only run a subset of the stories for your snapshot tests based on the story's name:

```js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  storyNameRegex: /buttons/
});
```

### `framework`

If you are running tests from outside of your app's directory, storyshots' detection of which framework you are using may fail. Pass `"react"` or `"react-native"` to short-circuit this.

### `test`

Run a custom test function for each story, rather than the default (a vanilla snapshot test). Setting `test` will take precedence over the `renderer` option. See the exports section below for more details.

### `renderer`

Pass a custom renderer (such as enzymes `mount`) to record snapshots. Note that setting `test` overrides `renderer`.

```js
import initStoryshots from '@storybook/addon-storyshots';
import { mount } from 'enzyme';

initStoryshots({
  renderer: mount,
});
```

If you are using enzyme, you need to make sure jest knows how to serialize rendered components.
You can either pass in a serializer (see below) or specify an enzyme-compatible serializer (like [enzyme-to-json](https://github.com/adriantoine/enzyme-to-json), [jest-serializer-enzyme](https://github.com/rogeliog/jest-serializer-enzyme) etc.) as the default `snapshotSerializer` in your config.

Example for jest config in `package.json`:
```json
"devDependencies": {
    "enzyme-to-json": "^3.2.2"
},
"jest": {
    "snapshotSerializers": [
      "enzyme-to-json/serializer"
    ]
  }
```

### `serializer`

Pass a custom serializer (such as enzyme-to-json) to serialize components to snapshot-comparable data.

```js
import initStoryshots from '@storybook/addon-storyshots';
import toJSON from 'enzyme-to-json';

initStoryshots({
  renderer: mount,
  serializer: toJSON,
});
```

This option only needs to be set if the default `snapshotSerializers` is not set in your jest config.

### `stories2snapsConverter`
This parameter should be an instance of the [`Stories2SnapsConverter`](src/Stories2SnapsConverter.js) (or a derived from it) Class that is used to convert story-file name to snapshot-file name and vice versa.

By default, the instance of this class is created with these default options:

```js
{
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
  storiesExtensions: ['.js', '.jsx', '.ts', '.tsx'],
}
```

This class might be overridden to extend the existing conversion functionality or instantiated to provide different options:

```js
import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';

initStoryshots({
  stories2snapsConverter: new Stories2SnapsConverter({
    snapshotExtension: '.storypuke',
    storiesExtensions: ['.foo'],
  }),
});

```

## Exports

Apart from the default export (`initStoryshots`), Storyshots also exports some named test functions (see the `test` option above):

### `snapshot`

The default, render the story as normal and take a Jest snapshot.

### `renderOnly`

Just render the story, don't check the output at all (useful if you just want to ensure it doesn't error)

### `snapshotWithOptions(options)`

Like the default, but allows you to specify a set of options for the test renderer. [See for example here](https://github.com/storybooks/storybook/blob/b915b5439786e0edb17d7f5ab404bba9f7919381/examples/test-cra/src/storyshots.test.js#L14-L16).

### `renderWithOptions(options)`

Like the default, but allows you to specify a set of options for the renderer. See above.

### `multiSnapshotWithOptions(options)`

Like `snapshotWithOptions`, but generate a separate snapshot file for each stories file rather than a single monolithic file (as is the convention in Jest). This makes it dramatically easier to review changes. If you'd like the benefit of separate snapshot files, but don't have custom options to pass, simply pass an empty object.

#### integrityOptions
This option is useful when running test with `multiSnapshotWithOptions(options)` in order to track snapshots are matching the stories. (disabled by default).
The value is just a [settings](https://github.com/isaacs/node-glob#options) to a `glob` object, that searches for the snapshot files.

```js
initStoryshots({
  integrityOptions: { cwd: __dirname }, // it will start searching from the current directory
  test: multiSnapshotWithOptions(),
});
```

### `shallowSnapshot`

Take a snapshot of a shallow-rendered version of the component. Note that this option will be overriden if you pass a `renderer` option.

### `Stories2SnapsConverter`

This is a class that generates snapshot's name based on the story (kind, story & filename) and vice versa.

###### Example:

Let's say we wanted to create a test function for shallow && multi-file snapshots:

```js
import initStoryshots, { getSnapshotFileName } from '@storybook/addon-storyshots';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

initStoryshots({
  test: ({ story, context }) => {
    const snapshotFileName = getSnapshotFileName(context);
    const storyElement = story.render(context);
    const shallowTree = shallow(storyElement);

    if (snapshotFileName) {
      expect(toJson(shallowTree)).toMatchSpecificSnapshot(snapshotFileName);
    }
  }
});
```
