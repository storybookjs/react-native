# Storybook addon Jest

Brings Jest results in storybook.

[![Storybook Jest Addon Demo](@storybook/addon-jest.gif)](https://storybook-addon-jest-example.herokuapp.com/)

> Checkout the above [Live Storybook](https://storybook-addon-jest-example.herokuapp.com/).

## Getting started

### Install

`npm install --save-dev @storybook/addon-jest`

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
but this can mean you'll experience merge conflicts on this file in the future. (*re-generating this file is super easy though, just like lockfiles and snapshots*)

## Generating the test results

You need to make sure the generated test-restuls file exists before you start storybook.
During development you will likely start jest in watch-mode 
and so the json file will be re-generated every time code or tests change.

```sh
npm run test:generate-output -- --watch
```

This change will then be HMR (hot module reloaded) using webpack and displayed by this addon.

If you want to pre-run jest automaticly during development or a static build, 
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

Assuming that you have created a test files `MyComponent.test.js` and `MyOtherComponent.test.js`

In your `story.js`

```js
import results from '../.jest-test-results.json';
import { withTests } from '@storybook/addon-jest';

storiesOf('MyComponent', module)
  .addDecorator(withTests({ results })('MyComponent', 'MyOtherComponent'))
  .add('This story shows test results from MyComponent.test.js and MyOtherComponent.test.js', () => (
    <div>Jest results in storybook</div>
  ));
```

Or in order to avoid importing `.jest-test-results.json` in each story, you can create a simple file `withTests.js`:

```js
import results from '../.jest-test-results.json';
import { withTests } from '@storybook/addon-jest';

export default withTests({
  results,
});
```

Then in your story:

```js
// import your file
import withTests from '.withTests';

storiesOf('MyComponent', module)
  .addDecorator(withTests('MyComponent', 'MyOtherComponent'))
  .add('This story shows test results from MyComponent.test.js and MyOtherComponent.test.js', () => (
    <div>Jest results in storybook</div>
  ));
```

### withTests(options)

- **options.results**: [OBJECT] jest output results. *mandatory*
- **filteExt**: [STRING] test file extention. *optionnal*. This allow you to write "MyComponent" and not "MyComponent.test.js". It will be used as regex to find your file results. Default value is `((\\.specs?)|(\\.tests?))?(\\.js)?$`. That mean it will match: MyComponent.js, MyComponent.test.js, MyComponent.tests.js, MyComponent.spec.js, MyComponent.specs.js...

## TODO

- [ ] Add coverage
- [ ] Display nested test better (describe)
- [ ] Display the date of the test
- [ ] Add unit tests
- [ ] Add linting
- [ ] Split <TestPanel />

## Contributing

Every ideas and contributions are welcomed.

## Licence

MIT © 2017-present Renaud Tertrais
