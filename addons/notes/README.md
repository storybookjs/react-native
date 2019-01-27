# Storybook Addon Notes

Storybook Addon Notes allows you to write notes (text or HTML) for your stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started

**NOTE: Documentation on master branch is for alpha version, stable release is on [master](https://github.com/storybooks/storybook/tree/master/addons/)**

```sh
yarn add -D @storybook/addon-notes
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-notes/register';
```

You can use the `notes` parameter to add a note to each story:

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module)
  .add('with some emoji', () => <Component />, {
    notes: 'A very simple example of addon notes',
  });
```

#### Using Markdown

To use markdown in your notes is supported, storybook will load markdown as raw by default.

```js
import { storiesOf } from '@storybook/react';
import Component from './Component';
import notes from './someMarkdownText.md';

storiesOf('Component', module)
  .add('With Markdown', () => <Component />, { notes });
```

### Giphy

When using markdown, you can also embed gifs from Giphy into your markdown. Currently, the value `gif` of the gif prop is used to search and return the first result returned by Giphy.

```md
# Title

<Giphy gif='cheese' />
```

