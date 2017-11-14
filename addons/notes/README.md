# Storybook Addon Notes

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-nqnzoygycp.now.sh/badge.svg)](https://now-examples-slackin-nqnzoygycp.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook Addon Notes allows you to write notes (text or HTML) for your stories in [Storybook](https://storybook.js.org).

This addon works with Storybook for:
- [React](https://github.com/storybooks/storybook/tree/master/app/react)
- [React Native](https://github.com/storybooks/storybook/tree/master/app/react-native)
- [Vue](https://github.com/storybooks/storybook/tree/master/app/vue)

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started

```sh
npm i --save-dev @storybook/addon-notes
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-notes/register';
```

Then write your stories like this:

```js
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

import Component from './Component';

storiesOf('Component', module)
  .add('with some emoji', withNotes('A very simple component')(() => <Component></Component>));
```

### Deprecated API
This API is slated for removal in 4.0

```js
import { WithNotes } from '@storybook/addon-notes';

storiesOf('Addon Notes', module)
  .add('using deprecated API', () => (
    <WithNotes notes="Hello">
      <BaseButton onClick={action('clicked')} label="😀 😎 👍 💯" />
    </WithNotes>
  ));
```
