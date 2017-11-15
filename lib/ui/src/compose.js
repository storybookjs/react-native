import { setDefaults } from '@storybook/react-komposer';

let context;
let actions;

export const setContext = c => {
  context = c;
};

export const setActions = a => {
  actions = a;
};

const compose = setDefaults({
  propsToWatch: [],
  pure: true,
  env: {
    context: () => context,
    actions: () => actions,
  },
});

export default compose;
