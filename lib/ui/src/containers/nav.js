import { inject } from 'mobx-react';

import Nav from '../components/nav/nav';

export const mapper = store => {
  const {
    uiOptions: { name, url },
    notifications,
  } = store;

  return {
    title: name,
    url,
    notifications,
    stories: store.storiesHash,
  };
};

export default inject(({ store }) => mapper(store))(Nav);
