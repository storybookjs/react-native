# Storybook GraphiQL Addon

Storybook GraphQL Addon can be used to display the GraphiQL IDE with example queries in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Screenshot](docs/screenshot.png)

## Getting Started

First, install the addon

```sh
yarn add @storybook/addon-graphql --dev
```

Import the `setupGraphiQL` function and use it to create the graphiql helper with a base url.

```js
import { storiesOf } from '@storybook/react'
import { setupGraphiQL } from '@storybook/addon-graphql'

// setup the graphiql helper which can be used with the add method later
const graphiql = setupGraphiQL({ url: 'http://localhost:3000/graphql' });

storiesOf('GraphQL Demo', module)
  .add('get user info', graphiql(`{
    user(id: "1") {
      name
    }
  }`));
```

> Tip: try creating the helper in another file and import the configured graphiql helper from it

## Advanced Setup

The `setupGraphiQL` function also accepts a fetcher parameter which can be used to change how graphiql gets data. If the fetcher parameter is not given, it'll create a fetcher which uses the `fetch` api to make requests. The above example can also be written using a custom fetcher.

```js
import { storiesOf } from '@storybook/react'
import { setupGraphiQL } from '@storybook/addon-graphql'

import { url } from './settings';

const fetcher = params => {
  const options = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  };
  return fetch(url, options).then(res => res.json());
};

// create the helper with a custom fetcher
const graphiql = setupGraphiQL({ fetcher });

storiesOf('GraphQL Demo', module)
  .add('get user info', graphiql(`{
    user(id: "1") {
      name
    }
  }`));
```
