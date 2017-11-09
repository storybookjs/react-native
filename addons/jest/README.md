# Storybook addon Jest

Brings Jest results in storybook.

[![Storybook Jest Addon Demo](storybook-addon-jest.gif)](https://renaudtertrais.github.io/storybook-addon-jest)

> Checkout the above [Live Storybook](https://renaudtertrais.github.io/storybook-addon-jest).

## Getting started

### Install

`npm install --save-dev storybook-addon-jest`

or

`yarn add --dev storybook-addon-jest`

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

### Register

Register addon at `.storybook/addons.js`

```js
import 'storybook-addon-jest/register';
```

## Usage

Assuming that you have created a test files `MyComponent.test.js` and `MyOtherComponent.test.js`

In your `story.js`

```js
import jestTestResults from '../.jest-test-results.json';
import withTests from 'storybook-addon-jest';

storiesOf('MyComponent', module)
  .addDecorator(withTests(jestTestResults, { filesExt: '.test.js' })('MyComponent', 'MyOtherComponent'));
```

Or in order to avoid importing `.jest-test-results.json` in each story, you can create a simple file `withTests.js`:

```js
import jestTestResults from '../.jest-test-results.json';
import withTests from 'storybook-addon-jest';

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
import 'storybook-addon-jest/register';
import 'storybook-addon-jest/styles';
```

If you already use `storybook-readme` addon, you do not need to import it.

## TODO

- [ ] Add coverage
- [ ] Add unit tests
- [ ] Add linting
- [ ] Split <TestPanel />

## Contributing

Every ideas and contributions are welcomed.

## Licence

MIT © 2017-present Renaud Tertrais
