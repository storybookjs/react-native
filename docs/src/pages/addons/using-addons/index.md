---
id: 'using-addons'
title: 'Using Addons'
---

Storybook comes with a variety of "core" addons developed and maintained alongside Storybook. Most examples in this site use [actions](https://github.com/storybookjs/storybook/tree/master/addons/actions) and [links](https://github.com/storybookjs/storybook/tree/master/addons/links). But you can use any third party addons distributed via NPM.

Here's how to do it.

We are going to use an addon called [Notes](https://github.com/storybookjs/storybook/tree/master/addons/notes). Basically, it allows you to write notes for your stories.

First, we need to install the addons:

```sh
yarn add -D @storybook/addons @storybook/addon-actions @storybook/addon-knobs @storybook/addon-notes
```

within `.storybook/main.js`:

```js
module.exports = {
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-notes/register',
  ],
};
```

Once created, you'll have to restart storybook to make the underlying webpack aware of the addons file.

This will register all the addons and you'll be able to see the actions and knobs panels (in that order) when you are viewing the story. (Links do not register a tab--check individual addon docs to see which Storybook features they use!)

![Stories without notes](../static/stories-without-notes.png)

## Addons tab order

The tab order is created by order in which they appear in the array in the `main.js` file.

## Using the addon

Now when you are writing a story, you can import the actions addon to log actions. Also, you can add notes:

```js
import { action } from '@storybook/addon-actions';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const buttonWithEmoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
buttonWithEmoji.story = {
  parameters: {
    notes: 'A small component',
  },
};
```

Then you'll be able to see those notes when you are viewing the story.

![Stories with notes](../static/stories-with-notes.png)

## Disable the addon

You can disable an addon panel for a story by adding a `disabled` parameter.

```js
import { action } from '@storybook/addon-actions';
import Button from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const buttonWithEmoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
buttonWithEmoji.story = {
  parameters: {
    notes: { disabled: true }
  }
};
```

## Global Configuration

Sometimes you might want to configure an addon globally, as in the case of collocating stories with components, or to keep your stories file cleaner. To do that, you can add your decorators to a config file, typically in `.storybook/preview.js`. Here's an example of how you might do that.

```js
import { addParameters } from '@storybook/react';

addParameters({
  notes: 'global notes',
});
```

Just like this, you can install any other addon and use it. Have a look at our [addon gallery](https://storybook.js.org/addons/) to discover more addons.
