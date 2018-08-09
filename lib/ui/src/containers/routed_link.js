import { MenuLink } from '@storybook/components';
import { inject } from 'mobx-react';
import qs from 'qs';

export function mapper(store, { overrideParams = {} }) {
  const search = qs.stringify(
    {
      ...store.searchState,
      ...overrideParams,
    },
    { addQueryPrefix: true }
  );

  return {
    href: search,
  };
}

const ComposedMenuLink = inject(({ store }, props) => mapper(store, props))(MenuLink);

export { ComposedMenuLink as MenuLink };
