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
    stories: store.stories,
    hierarchyRootSeparator: store.uiOptions.hierarchyRootSeparator,
    hierarchySeparator: store.uiOptions.hierarchySeparator,
  };
};

export default inject(({ store }) => mapper(store))(Nav);
