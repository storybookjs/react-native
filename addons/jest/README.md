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
  "test": "jest --json --outputFile=.jest-test-results.json"
}
```

Add it the result file to `.gitignore`:

```
.jest-test-results.json
```

## Generating the test results

You should run jest before you start storybook and have the json file generated prior.
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
import jestTestResults from '../.jest-test-results.json';
import withTests from '@storybook/addon-jest';

storiesOf('MyComponent', module)
  .addDecorator(withTests(jestTestResults, { filesExt: '.test.js' })('MyComponent', 'MyOtherComponent'));
```

Or in order to avoid importing `.jest-test-results.json` in each story, you can create a simple file `withTests.js`:

```js
import jestTestResults from '../.jest-test-results.json';
import withTests from '@storybook/addon-jest';

export default withTests(jestTestResults, {
  filesExt: '.test.js',
});
```

Then in your story:

```js
// import your file
import withTests from '.withTests';

storiesOf('MyComponent', module)
  .addDecorator(withTests('MyComponent', 'MyOtherComponent'));
```

### Styling

The panel comes with a basic design. If you want to make it look a bit nicer, you add github markdown style by importing it in `.storybook/addons.js`

```js
import '@storybook/addon-jest/register';
import '@storybook/addon-jest/styles';
```

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
