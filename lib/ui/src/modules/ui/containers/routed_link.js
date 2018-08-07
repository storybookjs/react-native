import { RoutedLink, MenuLink } from '@storybook/components';

import React from 'react';

import { inject } from 'mobx-react';

// import genPoddaLoader from '../libs/gen_podda_loader';
import { getUrlState } from '../configs/handle_routing';
// import compose from '../../../compose';

export function mapper(store, props) {
  const { url } = getUrlState({ ...store, ...props.overrideParams });

  return {
    href: url
  };
}

const ComposedMenuLink = inject(({ store }, props) => mapper(store, props))(
  MenuLink
);
const ComposedRoutedLink = inject(({ store }, props) => mapper(store, props))(
  RoutedLink
);

export { ComposedMenuLink as MenuLink };
export { ComposedRoutedLink as RoutedLink };
