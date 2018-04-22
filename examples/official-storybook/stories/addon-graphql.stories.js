import { storiesOf } from '@storybook/react';
import { setupGraphiQL } from '@storybook/addon-graphql';

// setup the graphiql helper which can be used with the add method later
const graphiql = setupGraphiQL({ url: 'http://localhost:3000/graphql' });

// run yarn graphql in examples/official-storybook to start graphql server
storiesOf('Addons|GraphQL', module).add(
  'get user info',
  graphiql(`{
    user(id: "1") {
      name
    }
  }`)
);
