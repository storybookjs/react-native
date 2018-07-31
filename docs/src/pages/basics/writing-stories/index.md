---
id: 'writing-stories'
title: 'Writing Stories'
---

Storybook is all about writing stories. A story usually contains a single state of one component, almost like a visual test case.

> Technically, a story is a function that returns a React element.

A Storybook can be comprised of many stories for many components.

## Location for Stories

There are no rules for this, but in general, stories are easier to maintain when they are located closer to components.

For example, if the UI components live in a directory called: `src/components`, then the stories can be written inside the `src/stories` directory.

The Storybook config file can also be edited to load stories from other folders too.

## Writing Stories

This is how you write stories:
(Let's assume there's a component called "Button" in `src/components/Button.js`.)

```js
// file: src/stories/index.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));
```

This will add stories in the storybook like this:

![Basic stories](../static/basic-stories.png)

This uses our basic API for writing stories. There are official and third party Storybook [addons](/addons/introduction) for more advanced functionality.

## Loading stories dynamically

Sometimes, it is necessary to load stories dynamically rather than explicitly in the Storybook config file.

For example, the stories for an app may all be inside the `src/components` directory with the `.stories.js` extension. It is easier to load all the stories automatically like this inside the `.storybook/config.js` file:

```js
import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Storybook uses Webpack's [require.context](https://webpack.js.org/guides/dependency-management/#require-context) to load modules dynamically. Take a look at the relevant Webpack [docs](https://webpack.js.org/guides/dependency-management/#require-context) to learn more about how to use `require.context`.

The **React Native** packager resolves all the imports at build-time, so it's not possible to load modules dynamically. There is a third party loader  [react-native-storybook-loader](https://github.com/elderfo/react-native-storybook-loader) to automatically generate the import statements for all stories.

## Using Decorators

A decorator is a way to wrap a story with a common set of components. Here is an example on centering all components:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import MyComponent from '../my_component';

storiesOf('MyComponent', module)
  .addDecorator(story => <div style={{ textAlign: 'center' }}>{story()}</div>)
  .add('without props', () => <MyComponent />)
  .add('with some props', () => <MyComponent text="The Comp" />);
```

This only applies the decorator to the current set of stories. (In this example, the decorator is added only to the **MyComponent** story group.)

It is possible to apply a decorator **globally** to all the stories. Here is an example of the Storybook config file:

```js
import React from 'react';
import { configure, addDecorator } from '@storybook/react';

addDecorator(story => <div style={{ textAlign: 'center' }}>{story()}</div>);

configure(function() {
  // ...
}, module);
```

## Using Markdown

As of storybook 3.3, [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) can be used in storybook by default. All you need to do is import a markdown file, which extracts the raw markdown content into a string. You can then use that string in any addon that supports markdown (such as notes).

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import MyComponent from './MyComponent';
import someMarkdownText from './someMarkdownText.md';

storiesOf('Component', module).add('With Markdown', () => <MyComponent />, {
  notes: { markdown: someMarkdownText },
});
```

## Nesting stories

You can organize your stories in a nesting structures using "/" as a separator:

```js
// file: src/stories/index.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../components/Button';

storiesOf('My App/Buttons/Simple', module).add('with text', () => (
  <Button onClick={action('clicked')}>Hello Button</Button>
));

storiesOf('My App/Buttons/Emoji', module).add('with some emoji', () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
));
```

## Generating nesting path based on \_\_dirname

The name is just a javascript string, by using a template literal, you can easily interpolate data.

One example would be to use `base` from [`paths.macro`](https://github.com/storybooks/paths.macro):

```js
import React from 'react';
import base from 'paths.macro';

import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

storiesOf(`Other|${base}/Dirname Example`, module)
  .add('story 1', () => <BaseButton label="Story 1" />)
  .add('story 2', () => <BaseButton label="Story 2" />);
```

_This uses [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros)_.

## Run multiple storybooks

You can run multiple storybooks for different kinds of stories (or components). To do that, you can create different NPM scripts to start different stories. See:

```json
{
  "scripts": {
    "start-storybook-for-theme": "start-storybook -p 9001 -c .storybook-theme",
    "start-storybook-for-app": "start-storybook -p 8001 -c .storybook-app"
  }
}
```
