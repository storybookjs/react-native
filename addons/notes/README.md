# Storybook Addon Notes

Storybook Addon Notes allows you to write notes (text or HTML) for your stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Notes Demo](docs/demo.png)

## Getting Started

**NOTE: Documentation on master branch is for alpha version, stable release is on [master](https://github.com/storybooks/storybook/tree/master/addons/)**

```sh
yarn add -D @storybook/addon-notes
```

Then create a file called `addons.js` in your Storybook config.

Add following content to it:

```js
// register the notes addon as a tab
import '@storybook/addon-notes/register';
// or register the notes addon as a panel. Only one can be used!
import '@storybook/addon-notes/register-panel';
```

Now, you can use the `notes` parameter to add a note to each story.

### With React

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module).add('with some emoji', () => <Component />, {
  notes: 'A very simple example of addon notes',
});
```

### With Vue

```js
import { storiesOf } from '@storybook/vue';

import MyButton from './MyButton.vue';

storiesOf('MyButton', module).add(
  'with some emoji',
  () => ({
    components: { MyButton },
    template: '<my-button>😀 😎 👍 💯</my-button>',
  }),
  {
    notes: 'A very simple example of addon notes',
  }
);
```

## Using Markdown

Using Markdown in your notes is supported, Storybook will load Markdown as raw by default.

```js
import { storiesOf } from '@storybook/react';
import Component from './Component';
import markdownNotes from './someMarkdownText.md';

storiesOf('Component', module).add('With Markdown', () => <Component />, {
  notes: { markdown: markdownNotes },
});
```

## Giphy

When using Markdown, you can also embed gifs from Giphy into your Markdown. Currently, the value `gif` of the gif prop is used to search and return the first result returned by Giphy.

```md
# Title

<Giphy gif='cheese' />
```
