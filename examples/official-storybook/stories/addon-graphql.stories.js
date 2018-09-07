import { storiesOf } from '@storybook/react';
import { setupGraphiQL } from '@storybook/addon-graphql';

const graphiql = setupGraphiQL({
  url: 'https://graphql-pokemon.now.sh/?',
});

storiesOf('Addons|GraphQL', module).add(
  'get Pickachu',
  graphiql(`{
    pokemon(name: "Pikachu") {
      id
      number
      name
      attacks {
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        weight {
          minimum
          maximum
        }
        attacks {
          fast {
            name
            type
            damage
          }
        }
      }
    }
  }`)
);
