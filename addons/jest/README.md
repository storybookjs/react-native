# Storybook addon Jest

Brings Jest results in storybook.

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

[![Storybook Jest Addon Demo](https://raw.githubusercontent.com/storybooks/storybook-addon-jest/master/storybook-addon-jest.gif)](http://storybooks-official.netlify.com/?selectedKind=Addons%7Cjest&selectedStory=withTests&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Ftests%2Fpanel)

> Checkout the above [Live Storybook](http://storybooks-official.netlify.com/?selectedKind=Addons%7Cjest&selectedStory=withTests&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Ftests%2Fpanel).

## Getting started

### Install

`yarn add --save-dev @storybook/addon-jest --dev`

or

`yarn add --dev @storybook/addon-jest`

### Jest Configuration

When running **Jest**, be sure to save the results in a json file:

`package.json`

```js
"scripts": {
  "test:generate-output": "jest --json --outputFile=jest-test-results.json"
}
```

You may want to add it the result file to `.gitignore`, since it's a generated file:

```
jest-test-results.json
```

But much like lockfiles and snapshots checking-in generated files can have certain advantages as well. It's up to you.
We recommend to **do** check in the test results file so starting storybook from an clean git clone doesn't require running all tests first,
but this can mean you'll experience merge conflicts on this file in the future. (_re-generating this file is super easy though, just like lockfiles and snapshots_)

## Generating the test results

You need to make sure the generated test-results file exists before you start storybook.
During development you will likely start jest in watch-mode
and so the json file will be re-generated every time code or tests change.

```sh
npm run test:generate-output -- --watch
```

This change will then be HMR (hot module reloaded) using webpack and displayed by this addon.

If you want to pre-run jest automatically during development or a static build,
you may need to consider that if your tests fail, the script receives a non-0 exit code and will exit.
You could create a `prebuild:storybook` npm script, which will never fail by appending `|| true`:

```json
"scripts": {
  "test:generate-output": "jest --json --outputFile=.jest-test-results.json || true",
  "test": "jest",
  "prebuild:storybook": "npm run test:generate-output",
  "build:storybook": "build-storybook -c .storybook -o build/",
  "predeploy": "npm run build:storybook",
  "deploy": "gh-pages -d build/",
}
```

### Register

Register addon at `.storybook/addons.js`

```js
import '@storybook/addon-jest/register';
```

## Usage

Assuming that you have created test files `MyComponent.test.js` and `MyOtherComponent.test.js`

In your `story.js`

```js
import results from '../.jest-test-results.json';
import { withTests } from '@storybook/addon-jest';

storiesOf('MyComponent', module)
  .addDecorator(withTests({ results }))
  .add(
    'This story shows test results from MyComponent.test.js and MyOtherComponent.test.js',
    () => <div>Jest results in storybook</div>,
    {
      jest: ['MyComponent.test.js', 'MyOtherComponent.test.js'],
    }
  );
```

Or in order to avoid importing `.jest-test-results.json` in each story, simply add the decorator in your `.storybook/config.js` and results will display for stories that you have set the `jest` parameter on:

```js
import { addDecorator } from '@storybook/react'; // <- or your view layer
import { withTests } from '@storybook/addon-jest';

import results from '../.jest-test-results.json';

addDecorator(
  withTests({
    results,
  })
);
```

Then in your story:

```js
storiesOf('MyComponent', module)
  // Use .addParameters if you want the same tests displayed for all stories of the component
  .addParameters({ jest: ['MyComponent', 'MyOtherComponent'] })
  .add(
    'This story shows test results from MyComponent.test.js and MyOtherComponent.test.js',
    () => <div>Jest results in storybook</div>
  );
```

### Disabling

You can disable the addon for a single story by setting the `jest` parameter to `{disable: true}`:

```js
storiesOf('MyComponent', module).add('Story', () => <div>Jest results disabled here</div>, {
  jest: { disable: true },
});
```

### withTests(options)

- **options.results**: OBJECT jest output results. _mandatory_
- **filesExt**: STRING test file extension. _optional_. This allows you to write "MyComponent" and not "MyComponent.test.js". It will be used as regex to find your file results. Default value is `((\\.specs?)|(\\.tests?))?(\\.js)?$`. That means it will match: MyComponent.js, MyComponent.test.js, MyComponent.tests.js, MyComponent.spec.js, MyComponent.specs.js...

## Usage with Angular

Assuming that you have created test files `my.component.spec.ts` and `my-other.comonent.spec.ts`

Configure Jest with [jest-preset-angular](https://www.npmjs.com/package/jest-preset-angular)

In project's `typings.d.ts` add

```ts
declare module '*.json' {
  const value: any;
  export default value;
}
```

In your `.storybook/config.ts`:

```ts
import { addDecorator } from '@storybook/angular';
import { withTests } from '@storybook/addon-jest';

import * as results from '../.jest-test-results.json';

addDecorator(
  withTests({
    results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
  })
);
```

Then in your story:

```js
storiesOf('MyComponent', module)
  .addParameters({ jest: ['my.component', 'my-other.component'] })
  .add(
    'This story shows test results from my.component.spec.ts and my-other.component.spec.ts',
    () => <div>Jest results in storybook</div>
  );
```

##### Example [here](https://github.com/storybooks/storybook/tree/master/examples/angular-cli)

## TODO

- [ ] Add coverage
- [ ] Display nested test better (describe)
- [ ] Display the date of the test
- [ ] Add unit tests
- [ ] Add linting
- [ ] Split <TestPanel />

## Contributing

All ideas and contributions are welcomed.

## Licence

MIT © 2017-present Renaud Tertrais
