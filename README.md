# React Storybook Info Addon

A React Storybook addon to show additional information for your stories.

![React Storybook Screenshot](docs/screenshot.png)

### Usage

Install the following npm module:

```sh
npm i --save @kadira/react-storybook-addon-info
```

Then set the addon in the place you configure storybook like this:

```js
import React from 'react';
import { configure, setAddon } from '@kadira/storybook';

setAddon(InfoAddon);

configure(function () {
  ...
}, module);
```

Then create your stories with the `.addWithInfo` API.

```js
import React from 'react';
import Button from './Button';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button')
  .addWithInfo(
    'simple usage',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (
      <div>
        <Button label="The Button" onClick={action('onClick')}/>
        <br />
        <p>
          Click the "?" mark at top-right to view the info.
        </p>
      </div>
    ),
  );
```

> Have a look at [this example](example/story.js) stories to learn more about the `addWithInfo` API.
