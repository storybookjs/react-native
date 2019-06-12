# storybook-addon-queryparams

This storybook addon can be helpful if your components need special query parameters to work the way you want them.

## Getting started

First, install the addon.

```sh
$ yarn add @storybook/addon-queryparams --dev
```

import the `withQuery` decorator so the url will be changed before rendering stories.

```js
import React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { withQuery } from '@storybook/addon-queryparams';

storiesOf('button', module)
  .addDecorator(withQuery)
  .addParameters({
    query: {
      mock: true,
    }
  })
  .add('Prints the document.search', () => (
    <div>
      This is the current document.search: {document.search}, it includes `mock`!
    </div>
  ));
```
