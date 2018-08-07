import { RoutedLink, MenuLink } from '@storybook/components';

import React from 'react';

import { inject } from 'mobx-react';

// import genPoddaLoader from '../libs/gen_podda_loader';
// import { getUrlState } from '../configs/handle_routing';
// import compose from '../../../compose';

export function mapper() {
  // const { url } = getUrlState({ ...state, ...props.overrideParams });

  return {
    // href: url,
    href: ''
  };
}

const ComposedMenuLink = inject(({ store }) => mapper(store))(MenuLink);
const ComposedRoutedLink = inject(({ store }) => mapper(store))(RoutedLink);

export { ComposedMenuLink as MenuLink };
export { ComposedRoutedLink as RoutedLink };
