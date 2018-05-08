# Storybook Addon Notes
[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)](https://now-examples-slackin-rrirkqohko.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

---

Storybook Addon Notes allows you to write notes (text or HTML) for your stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started
**NOTE: Documentation on master branch is for alpha version, stable release is on [release/3.4](https://github.com/storybooks/storybook/tree/release/3.4/addons/)**

```sh
yarn add -D @storybook/addon-notes
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-notes/register';
```

Then add the `withNotes` decorator to all stories in your `config.js`:

```js
// Import from @storybook/X where X is your framework
import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

addDecorator(withNotes);
```

You can use the `notes` parameter to add a note to each story:

```js
import { storiesOf } from '@storybook/react';

import Component from './Component';

storiesOf('Component', module)
  .add('with some emoji', () => </Component>, { notes: 'A very simple component' });
```

#### Using Markdown

To use markdown in your notes, either through import or inline, simply put it in the `markdown` property of your note.

```js
import { storiesOf } from '@storybook/react';
import Component from './Component';
import someMarkdownText from './someMarkdownText.md';

storiesOf('Component', module).add(
  'With Markdown',
  () => <Component />,
  { notes: { markdown: someMarkdownText } }
);
```
