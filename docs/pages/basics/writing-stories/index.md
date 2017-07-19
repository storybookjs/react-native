---
id: 'writing-stories'
title: 'Writing Stories'
---

Storybook is all about writing stories. Usually a story contains a single state of one of your components. That's like a visual test case.

> Technically, a story is a function that returns a React element.

You can write a set of stories for your components and you'll get a storybook.

## Keeping your stories

There's no hard and fast rule for this. But, keeping stories close to your components is a good idea.

For example, let's say your UI components live in a directory called: `src/components.` Then you can write stories inside the `src/stories` directory.

This is just one way to do that. You can always edit your storybook config file and ask it to load stories from anywhere you want.

## Writing stories

This is how you write stories:
(Let's assume there's a component called "Button" in `src/components/Button.js`.)

```js
// file: src/stories/index.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '../components/Button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
```

This will show stories in your storybook like this:

![Basic stories](../static/basic-stories.png)

This is just our core API for writing stories. In addition to this, you can use the official and third party Storybook [addons](/addons/introduction) to get more functionality.

## Loading stories dynamically

Sometimes, you will want to load your stories dynamically rather than explicitly requiring them in the Storybook config file.

For example, you may write stories for your app inside the `src/components` directory with the `.stories.js` extension. Then you will want to load them at once. Simply edit your config directory at `.storybook/config.js` as follows:

```js
import { configure } from '@storybook/react';

const req = require.context('../src/components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
```

Here we use Webpack's [require.context](https://webpack.github.io/docs/context.html#require-context) to load modules dynamically. Have a look at the relevant Webpack [docs](https://webpack.github.io/docs/context.html#require-context) to learn more about how to use require.context.

The **React Native** packager resolves all the imports at build-time, so it's not possible to load modules dynamically. If you don't want to import all your stories manually you can use [react-native-storybook-loader](https://github.com/elderfo/react-native-storybook-loader) to automatically create the import statements for all of your stories. 

## Using Decorators

A decorator is a way to wrap a story with a common set of component(s). Let's say you want to center all your stories. Here is how we can do this with a decorator:

```js
import React from 'react';
import { storiesOf } from '@storybook/react';
import MyComponent from '../my_component';

storiesOf('MyComponent', module)
  .addDecorator(story => (
    <div style={{textAlign: 'center'}}>
      {story()}
    </div>
  ))
  .add('without props', () => <MyComponent />)
  .add('with some props', () => <MyComponent text="The Comp"/>);
```

Here we only add the decorator for the current set of stories. (In this example, we add it just for the **MyComponent** story group.)

But, you can also add a decorator **globally** and it'll be applied to all the stories you create. This is how to add a decorator like that:

```js
import React from 'react';
import { configure, addDecorator } from '@storybook/react';

addDecorator(story => (
  <div style={{textAlign: 'center'}}>
    {story()}
  </div>
));

configure(function () {
  // ...
}, module);
```

## Managing stories

Storybook has a very simple API to write stories.
With that, you can’t display nested stories.

But you might ask, how do I manage stories If I have many of them?
We're currently very much interested in changing our api to support this!

Until that's implemented, here's how different developers address this issue, right now:

### Prefix with dots

For example, you can prefix story names with a dot (`.`):

```js
import { storiesOf } from '@storybook/react';

storiesOf('core.Button', module);
```

Then you can filter stories to display only the stories you want to see.

### [Chapters](https://github.com/yangshun/react-storybook-addon-chapters)

With this addon, you can showcase multiple components (or varying component states) within 1 story.
Break your stories down into smaller categories (chapters) and subcategories (sections) for more organizational goodness.

### Run multiple storybooks

You can run multiple storybooks for different kinds of stories (or components). To do that, you can create different NPM scripts to start different stories. See:

```json
{
   "scripts": {
     "start-storybook-for-theme": "start-storybook -p 9001 -c .storybook-theme",
     "start-storybook-for-app": "start-storybook -p 8001 -c .storybook-app"
   }
}
```
