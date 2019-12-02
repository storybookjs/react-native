import React from 'react';

export default {
  title: 'Addons/GraphQL',
};

export const GetPikachu = () => <div>hello</div>;

GetPikachu.story = {
  name: 'get Pikachu',
  parameters: {
    graphiql: {
      query: `{
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
        }`,
      url: 'https://graphql-pokemon.now.sh/?',
    },
  },
};
