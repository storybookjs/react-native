import { action, extendObservable } from 'mobx';

export const bindActions = (store, actions) => {
  extendObservable(store, actions, {
    ...Object.keys(actions).reduce((acc, key) => {
      acc[key] = action;
      return acc;
    }, {}),
  });
};
