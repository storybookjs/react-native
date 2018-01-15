# StoryShots

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

StoryShots adds automatic Jest Snapshot Testing for [Storybook](https://storybook.js.org/).

This addon works with Storybook for:
- [React](https://github.com/storybooks/storybook/tree/master/app/react)
- [React Native](https://github.com/storybooks/storybook/tree/master/app/react-native)
- [Angular](https://github.com/storybooks/storybook/tree/master/app/angular)
- [Vue](https://github.com/storybooks/storybook/tree/master/app/vue)

![StoryShots In Action](docs/storyshots-fail.png)

To use StoryShots, you must use your existing Storybook stories as the input for Jest Snapshot Testing.

## Getting Started

Add the following module into your app.

```sh
npm install --save-dev @storybook/addon-storyshots
```

## Configure your app for Jest

Usually, you might already have completed this step. If not, here are some resources for you.

-   If you are using Create React App, it's already configured for Jest. You just need to create a filename with the extension `.test.js`.
-   Otherwise check this Egghead [lesson](https://egghead.io/lessons/javascript-test-javascript-with-jest).

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
[doesn't](#deps-issue) install it, so you need yo install it separately.
 
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


## Configure Storyshots for image snapshots

/*\ **React-native** is **not supported** by this test function.

Internally, it uses [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot).

When willing to generate and compare image snapshots for your stories, you have to two options: 
 - Have a storybook running (ie. accessible via http(s):// , for instance using `yarn run storybook`)
 - Have a static build of the storybook (for instance, using `yarn run build-storybook`)

Then you will need to reference the storybook URL (`file://...` if local, `http(s)://...` if served)

### Using default values for _imageSnapshots_

Then you can either create a new Storyshots instance or edit the one you previously used: 
```js
import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';

initStoryshots({suite: 'Image storyshots', test: imageSnapshot});
```
This will assume you have a storybook running on at _http://localhost:6006_.
Internally here are the steps:  
- Launches a Chrome headless using [puppeteer](https://github.com/GoogleChrome/puppeteer)
- Browses each stories (calling _http://localhost:6006/iframe.html?..._ URL),
- Take screenshots & save all images under _\_image_snapshots\__ folder.

### Specifying the storybook URL

If you want to set specific storybook URL, you can specify via the `storybookUrl` parameter, see below: 
```js
import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';

initStoryshots({suite: 'Image storyshots', test: imageSnapshot({storybookUrl: 'http://my-specific-domain.com:9010'})});
```
The above config will use _https://my-specific-domain.com:9010_ for screenshots.


You may also use a local static build of storybook if you do not want to run the webpack dev-server:
```js
import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';

initStoryshots({suite: 'Image storyshots', test: imageSnapshot({storybookUrl: 'file:///path/to/my/storybook-static'})});
```

### Specifying options to _jest-image-snapshots_

If you wish to customize [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot), then you can provide a `getMatchOptions` parameter that should return the options config object.
```js
import initStoryshots, { imageSnapshot } from '@storybook/addon-storyshots';
const getMatchOptions = ({context : {kind, story}, url}) => {
  return {
    failureThreshold: 0.2,
    failureThresholdType: 'percent',
  }
}
initStoryshots({suite: 'Image storyshots', test: imageSnapshot({storybookUrl: 'http://localhost:6006', getMatchOptions})});
```
`getMatchOptions` receives an object: `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot.


### Integrate image storyshots with regular app
You may want to use another Jest project to run your image snapshots as they require more resources: Chrome and Storybook built/served.
You can find a working example of this in the [official-storybook](https://github.com/storybooks/storybook/tree/master/examples/official-storybook) example.

### Integrate image storyshots with [Create React App](https://github.com/facebookincubator/create-react-app)
You have two options here, you can either: 

- Simply add the storyshots configuration inside any of your `test.js` file. You must ensure you have either a running storybook or a static build available.

- Create a custom test file using Jest outside of the CRA scope:

    A more robust approach would be to separate existing test files ran by create-react-app (anything `(test|spec).js` suffixed files) from the test files to run storyshots with image snapshots.
    This use case can be achieved by using a custom name for the test file, ie something like `image-storyshots.runner.js`. This file will contains the `initStoryshots` call with image snapshots configuration.
    Then you will create a separate script entry in your package.json, for instance 
    ```json
    {
        "scripts": { 
            "image-snapshots" : "jest image-storyshots.runner.js --config path/to/custom/jest.config.json"
        }
    }
    ```
    Note that you will certainly need a custom config file for Jest as you run it outside of the CRA scope and thus you do not have the built-in config.

    Once that's setup, you can run `yarn run image-snapshots` (or `npm run image-snapshots`).

### Reminder
An image snapshot is simply a screenshot taken by a web browser (in our case, Chrome).

The browser opens a page (either using the static build of storybook or a running instance of Storybook)

If you run your test without either the static build or a running instance, this wont work.

To make sure your screenshots are taken from latest changes of your Storybook, you must keep your static build or running Storybook up-to-date. 
This can be achieved by adding a step before running the test ie: `yarn run build-storybook && yarn run image-snapshots`.
If you run the image snapshots against a running Storybook in dev mode, you don't have to care about being up-to-date because the dev-server is watching changes and rebuilds automatically.

## Options

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

Pass a custom renderer (such as enzymes `mount`) to record snapshots.

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

## Exports

Apart from the default export (`initStoryshots`), Storyshots also exports some named test functions (see the `test` option above):

### `snapshot`

The default, render the story as normal and take a Jest snapshot.

### `renderOnly`

Just render the story, don't check the output at all (useful if you just want to ensure it doesn't error).

### `snapshotWithOptions(options)`

Like the default, but allows you to specify a set of options for the test renderer. [See for example here](https://github.com/storybooks/storybook/blob/b915b5439786e0edb17d7f5ab404bba9f7919381/examples/test-cra/src/storyshots.test.js#L14-L16).

### `multiSnapshotWithOptions(options)`

Like `snapshotWithOptions`, but generate a separate snapshot file for each stories file rather than a single monolithic file (as is the convention in Jest). This makes it dramatically easier to review changes.

### `shallowSnapshot`

Take a snapshot of a shallow-rendered version of the component. Note that this option will be overriden if you pass a `renderer` option.

### `getSnapshotFileName`

Utility function used in `multiSnapshotWithOptions`. This is made available for users who implement custom test functions that also want to take advantage of multi-file storyshots.

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
