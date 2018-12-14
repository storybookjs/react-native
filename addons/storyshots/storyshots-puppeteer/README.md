## Getting Started

Add the following module into your app.

 ```sh
npm install --save-dev @storybook/addon-storyshots-puppeteer
```

## Configure Storyshots for image snapshots

/\*\ **React-native** is **not supported** by this test function.

Internally, it uses [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot).

When willing to generate and compare image snapshots for your stories, you have two options:

- Have a storybook running (ie. accessible via http(s), for instance using `yarn run storybook`)
- Have a static build of the storybook (for instance, using `yarn run build-storybook`)

Then you will need to reference the storybook URL (`file://...` if local, `http(s)://...` if served)

### Using default values for _imageSnapshots_

Then you can either create a new Storyshots instance or edit the one you previously used:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({ suite: 'Image storyshots', test: imageSnapshot() });
```

This will assume you have a storybook running on at _<http://localhost:6006>_.
Internally here are the steps:

- Launches a Chrome headless using [puppeteer](https://github.com/GoogleChrome/puppeteer)
- Browses each stories (calling _<http://localhost:6006/iframe.html?...>_ URL),
- Take screenshots & save all images under \_\_image_snapshots\_\_ folder.

### Specifying the storybook URL

If you want to set specific storybook URL, you can specify via the `storybookUrl` parameter, see below:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://my-specific-domain.com:9010' }),
});
```

The above config will use _<https://my-specific-domain.com:9010>_ for screenshots. You can also use query parameters in your URL (e.g. for setting a different background for your storyshots, if you use `@storybook/addon-backgrounds`).

You may also use a local static build of storybook if you do not want to run the webpack dev-server:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'file:///path/to/my/storybook-static' }),
});
```

### Specifying options to _jest-image-snapshots_

If you wish to customize [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot), then you can provide a `getMatchOptions` parameter that should return the options config object. Additionally, you can provide `beforeScreenshot` which is called before the screenshot is captured.

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const getMatchOptions = ({ context: { kind, story }, url }) => {
  return {
    failureThreshold: 0.2,
    failureThresholdType: 'percent',
  };
};
const beforeScreenshot = (page, { context: { kind, story }, url }) => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, 600)
  );
};
initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://localhost:6006', getMatchOptions, beforeScreenshot }),
});
```

`getMatchOptions` receives an object: `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot.

`beforeScreenshot` receives the [Puppeteer page instance](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page) and an object: `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot. `beforeScreenshot` is part of the promise chain and is called after the browser navigation is completed but before the screenshot is taken. It allows for triggering events on the page elements and delaying the screenshot and can be used avoid regressions due to mounting animations.

### Specifying options to _goto()_ (puppeteer API)

You might use `getGotoOptions` to specify options when the storybook is navigating to a story (using the `goto` method). Will be passed to [Puppeteer .goto() fn](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const getGotoOptions = ({ context, url }) => {
  return {
    waitUntil: 'networkidle0',
  };
};
initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://localhost:6006', getGotoOptions }),
});
```

### Specifying options to _screenshot()_ (puppeteer API)

You might use `getScreenshotOptions` to specify options for screenshot. Will be passed to [Puppeteer .screenshot() fn](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const getScreenshotOptions = ({context, url}) {
  return {
    fullPage: false // Do not take the full page screenshot. Default is 'true' in Storyshots.
  }
}
initStoryshots({suite: 'Image storyshots', test: imageSnapshot({storybookUrl: 'http://localhost:6006', getScreenshotOptions})});
```

`getScreenshotOptions` receives an object `{ context: {kind, story}, url}`. _kind_ is the kind of the story and the _story_ its name. _url_ is the URL the browser will use to screenshot.

### Specifying custom Chrome executable path (puppeteer API)

You might use `chromeExecutablePath` to specify the path to a different version of Chrome, without downloading Chromium. Will be passed to [Runs a bundled version of Chromium](https://github.com/GoogleChrome/puppeteer#default-runtime-settings)

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const chromeExecutablePath = '/usr/local/bin/chrome';

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({ storybookUrl: 'http://localhost:6006', chromeExecutablePath }),
});
```

### Specifying a custom puppeteer `browser` instance

You might use `customBrowser` to specify a custom instance of a puppeteer `browser` object. This will prevent `storyshots-puppeteer` from creating its own `browser`. It will create and close pages within the `browser`, and it is your responsibility to manage the lifecycle of the `browser` itself.

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import puppeteer from 'puppeteer';

(async function() {
    const customBrowser = await puppeteer.connect('ws://yourUrl');

    initStoryshots({
      suite: 'Image storyshots',
      test: imageSnapshot({ storybookUrl: 'http://localhost:6006', customBrowser }),
    });
})();
```


### Customizing a `page` instance

Sometimes, there is a need to customize a page before it calls the `goto` api.

An example of device emulation:

```js
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
const devices = require('puppeteer/DeviceDescriptors');

const iPhone = devices['iPhone 6'];

function customizePage(page) {
  return page.emulate(iPhone);
}

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:6006',
    customizePage,
  }),
});
```

### Integrate image storyshots with regular app

You may want to use another Jest project to run your image snapshots as they require more resources: Chrome and Storybook built/served.
You can find a working example of this in the [official-storybook](https://github.com/storybooks/storybook/tree/master/examples/official-storybook) example.

### Integrate image storyshots with [Create React App](https://github.com/facebookincubator/create-react-app)

You have two options here, you can either:

- Simply add the storyshots configuration inside any of your `test.js` file. You must ensure you have either a running storybook or a static build available.

- Create a custom test file using Jest outside of the CRA scope:

  A more robust approach would be to separate existing test files ran by create-react-app (anything `(test|spec).js` suffixed files) from the test files to run storyshots with image snapshots.
  This use case can be achieved by using a custom name for the test file, ie something like `image-storyshots.runner.js`. This file will contains the `initStoryshots` call with image snapshots configuration.
  Then you will create a separate script entry in your package.json, for instance

  ```json
  {
    "scripts": {
      "image-snapshots": "jest image-storyshots.runner.js --config path/to/custom/jest.config.json"
    }
  }
  ```

  Note that you will certainly need a custom config file for Jest as you run it outside of the CRA scope and thus you do not have the built-in config.

  Once that's setup, you can run `yarn run image-snapshots` (or `npm run image-snapshots`).

### Reminder

An image snapshot is simply a screenshot taken by a web browser (in our case, Chrome).

The browser opens a page (either using the static build of storybook or a running instance of Storybook)

If you run your test without either the static build or a running instance, this wont work.

To make sure your screenshots are taken from latest changes of your Storybook, you must keep your static build or running Storybook up-to-date.
This can be achieved by adding a step before running the test ie: `yarn run build-storybook && yarn run image-snapshots`.
If you run the image snapshots against a running Storybook in dev mode, you don't have to worry about the snapshots being up-to-date because the dev-server is watching changes and rebuilds automatically.
