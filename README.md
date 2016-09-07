# GraphiQL Addon

The GraphiQL addon can be used to display the GraphiQL IDE with example queries. This addon works with [React Storybook](https://github.com/kadirahq/react-storybook).

![](docs/screenshot.png)

## Getting Started

First, install the addon

```shell
npm install -D @kadira/storybook-addon-graphql
```

Import the `setupGraphiQL` function and use it to create the graphiql helper with a base url.

```js
import { storiesOf } from '@kadira/storybook'
import { setupGraphiQL } from '@kadira/storybook-addon-graphql'

// setup the graphiql helper which can be used with the add method later
const graphiql = setupGraphiQL({ url: 'http://localhost:3000/graphql' });

storiesOf('GraphQL Demo', module)
  .add('get user info', graphiql(`{
    user(id: "1") {
      name
    }
  }`));
```

## Advanced Setup

The `setupGraphiQL` function also accepts a fetcher parameter which can be used to change how graphiql gets data. If the fetcher parameter is not given, it'll create a fetcher which uses the `fetch` api to make requests. The above example can also be written using a custom fetcher.

```js
import { storiesOf } from '@kadira/storybook'
import { setupGraphiQL } from '@kadira/storybook-addon-graphql'

const fetcher = function (params) {
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
