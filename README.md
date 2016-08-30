# Storybook Addon Notes

This [Storybook](https://getstorybook.io) addon allows you to write notes for your stories.

![Storybook Addon Notes Demo](docs/demo.png)

### Getting Started

```sh
npm i --save @kadira/storybook-addon-notes
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@kadira/storybook/addons';
import '@kadira/storybook-addon-notes/register';
```

Then write your stories like this:

```js
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Button from './Button';
import { WithNotes } from '@kadira/storybook-addon-notes';

storiesOf('Button', module)
  .add('with text', () => (
    <WithNotes notes={'This is a very simple Button and you can click on it.'}>
      <Button onClick={action('clicked')}>Hello Button</Button>
    </WithNotes>
  ))
  .add('with some emoji', () => (
    <WithNotes notes={'Here we use some emoji as the Button text. Isn\'t it look nice?'}>
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    </WithNotes>
  ));
```
