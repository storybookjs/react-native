import { storiesOf } from '@storybook/react';
import { setupGraphiQL } from '../src';

// setup the graphiql helper which can be used with the add method later
const graphiql = setupGraphiQL({ url: 'http://localhost:3000/graphql' });

storiesOf('GraphQL Demo', module).add(
  'get user info',
  graphiql(`{
    user(id: "1") {
      name
    }
  }`)
);
