import { inject } from 'mobx-react';

import Nav from '../components/nav/nav';

export const mapper = store => {
  const {
    uiOptions: { name, url },
    notifications,
    componentsUrl,
  } = store;

  return {
    title: name,
    url,
    componentsUrl,
    notifications,
    stories: store.storiesHash,
  };
};

export default inject(({ store }) => mapper(store))(Nav);
