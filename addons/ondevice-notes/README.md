# Storybook Addon On Device Notes

Storybook Addon On Device Notes allows you to write notes (text or markdown) for your stories in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started

**NOTE: Documentation on master branch is for alpha version, stable release is on [release/4.0](https://github.com/storybooks/storybook/tree/release/4.0/addons/)**

```sh
yarn add -D @storybook/addon-ondevice-notes
```

Then create a file called `rn-addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-ondevice-notes/register';
```

Then import `rn-addons.js` next to your `getStorybookUI` call.

```js
import './rn-addons';
```

Then add the `withNotes` decorator to all stories in your `config.js`:

```js
// Import from @storybook/X where X is your framework
import { addDecorator } from '@storybook/react-native';
import { withNotes } from '@storybook/addon-ondevice-notes';

addDecorator(withNotes);
```

You can use the `notes` parameter to add a note to each story:

```js
import { storiesOf } from '@storybook/react-native';

import Component from './Component';

storiesOf('Component', module).add('with some emoji', () => <Component />, {
  notes: 'A very simple component',
});
```
